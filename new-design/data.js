// Corporate Pickleball League — data extracted from existing pages
// All visible values preserved exactly as shown in the source screenshots.

window.CPL_DATA = {
  league: "Corporate Pickleball League",
  shortName: "CPL",
  asOf: "MAY 6TH",
  asOfDate: "2026-05-06",
  divisions: ["CPL", "DIV A", "DIV B1", "DIV B2", "DIV B3", "DIV B4", "DIV C1", "DIV C2", "DIV C3"],

  // Leaderboard rows visible in screenshot #1 (CPL division).
  // Fields shown there: rank, team, W-L, win%, pts for/against, diff.
  standings: {
    CPL: [
      { rank: 1, team: "20/20 Picklers",      w: 57, l: 24, winPct: 70, pf: 789, pa: 588, diff:  201 },
      { rank: 2, team: "Jennie Invest",       w: 48, l: 34, winPct: 59, pf: 740, pa: 648, diff:   92 },
      { rank: 3, team: "Interesting Things",  w: 45, l: 36, winPct: 56, pf: 731, pa: 675, diff:   56 },
      { rank: 4, team: "Dill Breakers",       w: 41, l: 42, winPct: 49, pf: 668, pa: 707, diff:  -39 },
    ],
  },

  // Match cards visible in screenshot #2 (CPL division, dated 06 May 26).
  // Each card shows: date, total points "A / B PTS", and two teams with
  // game counts. Winner side has the yellow dot + dark navy type.
  // Game wins always total 8 across both teams in the visible cards
  // (5+3, 1+7, 4+4) — opponent counts in the partially-clipped row are
  // inferred from that same sum so the data model stays internally consistent.
  matches: {
    CPL: [
      {
        date: "06 May 26",
        a: { team: "Interesting Things", games: 5, pts: 71, win: true  },
        b: { team: "Jennie Invest",      games: 3, pts: 68, win: false },
      },
      {
        date: "06 May 26",
        a: { team: "Burger Shack",       games: 1, pts: 45, win: false },
        b: { team: "20/20 Picklers",     games: 7, pts: 82, win: true  },
      },
      {
        date: "06 May 26",
        a: { team: "Interesting Things", games: 4, pts: 66, win: true  },
        b: { team: "20/20 Picklers",     games: 4, pts: 62, win: false },
      },
      {
        date: "06 May 26",
        a: { team: "Jennie Invest",      games: 4, pts: 66, win: false },
        b: { team: "Dill Breakers",      games: 4, pts: 76, win: true  },
      },
      {
        date: "06 May 26",
        a: { team: "Burger Shack",       games: 5, pts: 70, win: true  },
        b: { team: "Quality - Dill With It!", games: 3, pts: 69, win: false },
      },
      {
        date: "06 May 26",
        a: { team: "Quality - Dill With It!", games: 2, pts: 75, win: false },
        b: { team: "Dill Breakers",      games: 6, pts: 78, win: true  },
      },
    ],
  },
};
