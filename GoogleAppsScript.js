// CONFIGURATION
// Go to Project Settings > Script Properties to add these keys:
// SUPABASE_URL: Your Supabase Project URL
// SUPABASE_KEY: Your Supabase Service Role Key (preferred) or Anon Key

const CONFIG = {
  SEARCH_QUERY: 'from:jerry@pickleball.ky subject:"Corporate League Results" is:unread', // Filter for unprocessed emails
  PROCESSED_LABEL: 'Processed_Pickleball_Results'
};

function processMatchResults() {
  const threads = GmailApp.search(CONFIG.SEARCH_QUERY);
  if (threads.length === 0) {
    console.log("No new emails found.");
    return;
  }

  // 1. Fetch Lookups (Divisions and Teams)
  const lookups = fetchSupabaseLookups();
  if (!lookups) return;

  // 2. Process Each Email
  for (const thread of threads) {
    const messages = thread.getMessages();
    for (const message of messages) {
      if (!message.isUnread()) continue; // Skip if somehow read (though search filters it)

      const attachments = message.getAttachments();
      for (const attachment of attachments) {
        if (attachment.getContentType() === 'text/csv' || attachment.getName().endsWith('.csv')) {
          const csvData = attachment.getDataAsString();
          const matches = parseCSVAndMap(csvData, lookups);
          
          if (matches.length > 0) {
            const success = uploadMatchesToSupabase(matches);
            if (success) {
              console.log(`Successfully uploaded ${matches.length} matches from ${attachment.getName()}`);
            } else {
              console.error(`Failed to upload matches from ${attachment.getName()}`);
            }
          }
        }
      }
      message.markRead(); // Mark as read so we don't process it again
    }
    
    // Optional: Add a label
    addLabel(thread);
  }
}

function fetchSupabaseLookups() {
  const url = PropertiesService.getScriptProperties().getProperty('SUPABASE_URL');
  const key = PropertiesService.getScriptProperties().getProperty('SUPABASE_KEY');

  if (!url || !key) {
    console.error("Missing Script Properties. Please set SUPABASE_URL and SUPABASE_KEY.");
    return null;
  }

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
}

function parseCSVAndMap(csvText, { divisions, teams }) {
  const lines = csvText.split(/\r\n|\n/);
  const mappedMatches = [];

  for (const line of lines) {
    if (!line.trim()) continue; // Skip empty lines
    // Simple CSV split (assumes no commas in names for now, or use a robust parser if needed)
    const cols = line.split(','); 
    
    if (cols.length < 9) continue; // Skip invalid rows

    // CSV Columns based on example:
    // 0: Division (e.g., "B3")
    // 1: Team 1 Name
    // 2: "v"
    // 3: Team 2 Name
    // 4: Date (e.g., "13-Jan-26")
    // 5: Team 1 Wins
    // 6: Team 2 Wins
    // 7: Team 1 Points
    // 8: Team 2 Points

    const divNameRaw = cols[0].trim();
    const team1Name = cols[1].trim();
    const team2Name = cols[3].trim();
    const dateRaw = cols[4].trim();
    const t1Wins = parseInt(cols[5]);
    const t2Wins = parseInt(cols[6]);
    const t1Points = parseInt(cols[7]);
    const t2Points = parseInt(cols[8]);

    // 1. Find Division ID
    // Logic: Try exact match, then try prepending "Division "
    let division = divisions.find(d => d.name === divNameRaw || d.name === `Division ${divNameRaw}`);
    if (!division) {
      console.warn(`Division not found for: ${divNameRaw}`);
      continue;
    }

    // 2. Find Team IDs
    const team1 = teams.find(t => t.name === team1Name && t.division_id === division.id);
    const team2 = teams.find(t => t.name === team2Name && t.division_id === division.id);

    if (!team1 || !team2) {
      console.warn(`Team not found: ${team1Name} or ${team2Name} in ${division.name}`);
      continue;
    }

    // 3. Format Date (13-Jan-26 -> YYYY-MM-DD)
    const formattedDate = parseDate(dateRaw);

    mappedMatches.push({
      division_id: division.id,
      team1_id: team1.id,
      team2_id: team2.id,
      date: formattedDate,
      team1_wins: t1Wins,
      team2_wins: t2Wins,
      team1_points_for: t1Points,
      team2_points_for: t2Points
    });
  }

  return mappedMatches;
}

function parseDate(dateStr) {
  // Input: "13-Jan-26" or "13-Jan-2026"
  // Output: "2026-01-13"
  const months = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', 
                   jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };
  
  const parts = dateStr.split('-');
  if (parts.length !== 3) return new Date().toISOString().split('T')[0]; // Fallback to today

  const day = parts[0].padStart(2, '0');
  const monthStr = parts[1].toLowerCase();
  const yearShort = parts[2];
  
  const month = months[monthStr] || '01';
  const year = yearShort.length === 2 ? `20${yearShort}` : yearShort;

  return `${year}-${month}-${day}`;
}

function uploadMatchesToSupabase(matches) {
  const url = PropertiesService.getScriptProperties().getProperty('SUPABASE_URL');
  const key = PropertiesService.getScriptProperties().getProperty('SUPABASE_KEY');

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Prefer': 'return=minimal' // Don't return the inserted rows
    },
    payload: JSON.stringify(matches)
  };

  try {
    const response = UrlFetchApp.fetch(`${url}/rest/v1/matches`, options);
    return response.getResponseCode() === 201;
  } catch (e) {
    console.error("Supabase Upload Error: " + e.toString());
    return false;
  }
}

function addLabel(thread) {
  let label = GmailApp.getUserLabelByName(CONFIG.PROCESSED_LABEL);
  if (!label) {
    label = GmailApp.createLabel(CONFIG.PROCESSED_LABEL);
  }
  thread.addLabel(label);
}
