// CONFIGURATION
// Go to Project Settings > Script Properties to add these keys:
// SUPABASE_URL: Your Supabase Project URL
// SUPABASE_SERVICE_ROLE_KEY: Your Supabase Service Role Key (preferred) or Anon Key
// TARGET_SENDER: Email address to accept results from (e.g. sender@example.com)
// TARGET_SUBJECT: Subject line to match (e.g. Corporate League Results)
// DISCORD_WEBHOOK_URL: Webhook URL for status notifications

const CONFIG = {
  PROCESSED_LABEL: 'Processed_Pickleball_Results'
};

function processMatchResults() {
  const props = PropertiesService.getScriptProperties();
  const targetSenders = props.getProperty('TARGET_SENDERS'); // Expects comma-separated list
  const targetSubject = props.getProperty('TARGET_SUBJECT');
  
  if (!targetSenders || !targetSubject) {
    log("Error: TARGET_SENDERS or TARGET_SUBJECT not set in Script Properties.");
    return;
  }

  // Gmail search syntax for OR is {sender1 sender2}
  const sendersList = targetSenders.split(',').map(s => s.trim()).filter(s => s).join(' ');
  
  // Search query: from:{sender1 sender2} subject:"..." is:unread
  const searchQuery = `from:{${sendersList}} subject:"${targetSubject}" is:unread`;
  log(`Searching for emails: ${searchQuery}`);

  const threads = GmailApp.search(searchQuery);
  
  if (threads.length === 0) {
    log("No new emails found.");
    return;
  }

  log(`Found ${threads.length} unread threads.`);

  // 1. Fetch Lookups (Divisions and Teams)
  const lookups = fetchSupabaseLookups();
  if (!lookups) {
    sendDiscordNotification(false, "Service Error", "Failed to fetch lookups from Supabase.");
    return;
  }

  let emailsToProcess = [];

  // 2. Collect all valid CSV attachments
  for (const thread of threads) {
    const messages = thread.getMessages();
    for (const message of messages) {
      if (!message.isUnread()) continue;

      const attachments = message.getAttachments();
      let hasCsv = false;
      
      for (const attachment of attachments) {
        if (attachment.getContentType() === 'text/csv' || attachment.getName().endsWith('.csv')) {
          emailsToProcess.push({
            date: message.getDate(),
            subject: message.getSubject(),
            attachment: attachment,
            messageId: message.getId()
          });
          hasCsv = true;
        }
      }
      
      // Mark as read immediately
      message.markRead();
    }
    // Add label
    addLabel(thread);
  }

  if (emailsToProcess.length === 0) {
    log("No CSV attachments found in the unread emails.");
    return;
  }

  // 3. Sort by date descending (Newest first)
  emailsToProcess.sort((a, b) => b.date.getTime() - a.date.getTime());

  // 4. Process only the newest email
  const newest = emailsToProcess[0];
  log(`Processing newest email: "${newest.subject}" from ${formatDate(newest.date)}`);

  const csvData = newest.attachment.getDataAsString();
  const { matches: matchesToInsert, errors, createdTeams } = parseCSVAndMap(csvData, lookups);
  const newCount = matchesToInsert.length;

  // 5. Data Safety Check
  const currentCount = getMatchCount();
  log(`Current DB rows: ${currentCount}. New valid CSV rows: ${newCount}.`);

  const stats = {
    "Email Subject": newest.subject,
    "Email Date": formatDate(newest.date),
    "Current DB Rows": currentCount,
    "New CSV Rows": newCount
  };

  if (createdTeams.length > 0) {
    let createdMsg = createdTeams.slice(0, 5).join("\n");
    if (createdTeams.length > 5) createdMsg += `\n...and ${createdTeams.length - 5} more.`;
    stats["New Teams Created"] = createdMsg;
  }

  if (errors.length > 0) {
    let errorMsg = errors.slice(0, 10).join("\n");
    if (errors.length > 10) errorMsg += `\n...and ${errors.length - 10} more.`;
    stats["Validation Errors"] = errorMsg;
  }

  if (newCount < currentCount) {
    const msg = `WARNING: New data has fewer rows (${newCount}) than DB (${currentCount}). Skipping update.`;
    log(msg);
    sendDiscordNotification(false, "Ingestion Skipped", msg, stats);
    return;
  }

  if (newCount === 0) {
    const msg = "WARNING: New CSV has 0 matches. Skipping.";
    log(msg);
    sendDiscordNotification(false, "Ingestion Skipped", msg, stats);
    return;
  }

  // 6. Update Database (Clear & Insert)
  const success = updateDatabase(matchesToInsert);

  if (success) {
    log("Ingestion complete.");
    sendDiscordNotification(true, "Ingestion Successful", "Match data has been updated.", stats);
  } else {
    log("Ingestion failed.");
    sendDiscordNotification(false, "Ingestion Failed", "Database update encountered an error.", stats);
  }
}

// --- Supabase Helpers ---

function getMatchCount() {
  const url = PropertiesService.getScriptProperties().getProperty('SUPABASE_URL');
  const key = PropertiesService.getScriptProperties().getProperty('SUPABASE_SERVICE_ROLE_KEY');
  
  // select id, count=exact, head=true (to avoid fetching body)
  // Range header is typical for counting in PostgREST but 'count=exact' query param works too with HEAD method
  const options = {
    method: 'get',
    headers: {
      'apikey': key, 
      'Authorization': `Bearer ${key}`,
      'Range': '0-0',
      'Prefer': 'count=exact'
    }
  };

  try {
    const response = UrlFetchApp.fetch(`${url}/rest/v1/matches?select=id`, options);
    // Content-Range header format: 0-0/27 (where 27 is total)
    const rangeHeader = response.getHeaders()['Content-Range'];
    if (rangeHeader) {
      return parseInt(rangeHeader.split('/')[1]);
    }
    return 0;
  } catch (e) {
    log("Error getting count: " + e);
    return 0;
  }
}

function updateDatabase(matches) {
  const url = PropertiesService.getScriptProperties().getProperty('SUPABASE_URL');
  const key = PropertiesService.getScriptProperties().getProperty('SUPABASE_SERVICE_ROLE_KEY');
  const headers = {
    'apikey': key, 
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json'
  };

  try {
    // 1. Clear Table
    log("Clearing existing matches...");
    // DELETE /rest/v1/matches?id=neq.00000000-0000-0000-0000-000000000000
    const deleteOptions = { method: 'delete', headers: headers };
    UrlFetchApp.fetch(`${url}/rest/v1/matches?id=neq.00000000-0000-0000-0000-000000000000`, deleteOptions);
    
    // 2. Insert New Data
    log(`Inserting ${matches.length} matches...`);
    const insertOptions = {
      method: 'post',
      headers: { ...headers, 'Prefer': 'return=minimal' },
      payload: JSON.stringify(matches)
    };
    const response = UrlFetchApp.fetch(`${url}/rest/v1/matches`, insertOptions);
    
    return response.getResponseCode() === 201;
  } catch (e) {
    log("Database Update Error: " + e);
    return false;
  }
}

function createTeam(name, divisionId) {
  const url = PropertiesService.getScriptProperties().getProperty('SUPABASE_URL');
  const key = PropertiesService.getScriptProperties().getProperty('SUPABASE_SERVICE_ROLE_KEY');

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Prefer': 'return=representation'
    },
    payload: JSON.stringify({ name: name, division_id: divisionId })
  };

  try {
    const response = UrlFetchApp.fetch(`${url}/rest/v1/teams`, options);
    if (response.getResponseCode() === 201) {
      const data = JSON.parse(response.getContentText());
      log(`Created new team: ${name}`);
      return data[0];
    }
  } catch (e) {
    log(`Error creating team ${name}: ${e}`);
  }
  return null;
}

function fetchSupabaseLookups() {
  const url = PropertiesService.getScriptProperties().getProperty('SUPABASE_URL');
  const key = PropertiesService.getScriptProperties().getProperty('SUPABASE_SERVICE_ROLE_KEY');

  if (!url || !key) {
    log("Missing Script Properties. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    return null;
  }

  try {
    // Fetch Divisions
    const divResponse = UrlFetchApp.fetch(`${url}/rest/v1/divisions?select=id,name`, {
      headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
    });
    const divisions = JSON.parse(divResponse.getContentText());

    // Fetch Teams
    const teamResponse = UrlFetchApp.fetch(`${url}/rest/v1/teams?select=id,name,division_id`, {
      headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
    });
    const teams = JSON.parse(teamResponse.getContentText());

    return { divisions, teams };
  } catch (e) {
    log("Error fetching lookups: " + e);
    return null;
  }
}

// --- Parsing & Utilities ---

function parseCSVAndMap(csvText, { divisions, teams }) {
  const lines = csvText.split(/\r\n|\n/);
  const mappedMatches = [];
  const errors = [];
  const createdTeams = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // Simple split (assuming no commas in fields)
    const cols = line.split(',');
    
    if (cols.length < 9) continue;

    // Check for incomplete match data (upcoming matches have empty score cols)
    if (!cols[5].trim() || !cols[6].trim()) {
      continue;
    }

    const divNameRaw = cols[0].trim();
    const team1Name = cols[1].trim();
    const team2Name = cols[3].trim();
    const dateRaw = cols[4].trim();
    const t1Wins = parseInt(cols[5]);
    const t2Wins = parseInt(cols[6]);
    const t1Points = parseInt(cols[7]);
    const t2Points = parseInt(cols[8]);

    // Lookup IDs (Case Insensitive)
    const divId = getDivisionId(divNameRaw, divisions);
    if (!divId) {
      const msg = `Row ${i+1}: Division '${divNameRaw}' not found.`;
      log(msg);
      errors.push(msg);
      continue;
    }

    let t1Id = getTeamId(team1Name, divId, teams);
    if (!t1Id) {
      // Auto-create Team 1
      const newTeam = createTeam(team1Name, divId);
      if (newTeam) {
        t1Id = newTeam.id;
        teams.push(newTeam); // Update cache
        createdTeams.push(`${team1Name} (${divNameRaw})`);
      } else {
        const msg = `Row ${i+1}: Failed to create team '${team1Name}'.`;
        log(msg);
        errors.push(msg);
        continue;
      }
    }

    let t2Id = getTeamId(team2Name, divId, teams);
    if (!t2Id) {
      // Auto-create Team 2
      const newTeam = createTeam(team2Name, divId);
      if (newTeam) {
        t2Id = newTeam.id;
        teams.push(newTeam); // Update cache
        createdTeams.push(`${team2Name} (${divNameRaw})`);
      } else {
        const msg = `Row ${i+1}: Failed to create team '${team2Name}'.`;
        log(msg);
        errors.push(msg);
        continue;
      }
    }

    mappedMatches.push({
      division_id: divId,
      team1_id: t1Id,
      team2_id: t2Id,
      date: parseDate(dateRaw),
      team1_wins: t1Wins,
      team2_wins: t2Wins,
      team1_points_for: t1Points,
      team2_points_for: t2Points
    });
  }

  return { matches: mappedMatches, errors: errors, createdTeams: createdTeams };
}

function getDivisionId(nameRaw, divisions) {
  const name = nameRaw.trim().toLowerCase();
  for (const d of divisions) {
    if (d.name.toLowerCase() === name) return d.id;
  }
  const altName = `division ${name}`;
  for (const d of divisions) {
    if (d.name.toLowerCase() === altName) return d.id;
  }
  return null;
}

function getTeamId(nameRaw, divId, teams) {
  const name = nameRaw.trim().toLowerCase();
  for (const t of teams) {
    if (t.name.toLowerCase() === name && t.division_id === divId) return t.id;
  }
  return null;
}

function parseDate(dateStr) {
  // Input: "13-Jan-26" -> Output: "2026-01-13"
  const months = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', 
                   jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };
  
  const parts = dateStr.split('-');
  if (parts.length !== 3) return new Date().toISOString().split('T')[0];

  const day = parts[0].padStart(2, '0');
  const monthStr = parts[1].toLowerCase();
  const yearShort = parts[2];
  
  const month = months[monthStr] || '01';
  const year = yearShort.length === 2 ? `20${yearShort}` : yearShort;

  return `${year}-${month}-${day}`;
}

function log(message) {
  const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd MMM yyyy HH:mm:ss");
  console.log(`${timestamp} - ${message}`);
}

function formatDate(dateObj) {
  return Utilities.formatDate(dateObj, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
}

function addLabel(thread) {
  let label = GmailApp.getUserLabelByName(CONFIG.PROCESSED_LABEL);
  if (!label) {
    label = GmailApp.createLabel(CONFIG.PROCESSED_LABEL);
  }
  thread.addLabel(label);
}

function sendDiscordNotification(success, title, description, details) {
  const webhookUrl = PropertiesService.getScriptProperties().getProperty('DISCORD_WEBHOOK_URL');
  if (!webhookUrl) return;

  // Colors: Green (5763719), Red (15548997)
  const color = success ? 5763719 : 15548997;
  
  const fields = [];
  if (details) {
    for (const key in details) {
      fields.push({ "name": key, "value": String(details[key]), "inline": true });
    }
  }

  const payload = {
    "embeds": [{
      "title": title,
      "description": description,
      "color": color,
      "fields": fields,
      "footer": { "text": "GAS Ingestion Service" },
      "timestamp": new Date().toISOString()
    }]
  };

  try {
    UrlFetchApp.fetch(webhookUrl, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload)
    });
  } catch (e) {
    log("Failed to send Discord notification: " + e);
  }
}