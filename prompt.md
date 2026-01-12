**Prompt:**

"I am designing a website for the 'CORPORATE PICKLEBALL LEAGUE' with the following divisions and teams from the attached 'Corporate League Divisions Winter 2026.pdf'. 

The divisions, their playing times, and the teams in each division are:

| Division | Play Time | Teams |
| --- | --- | --- |
| **Cayman Premier League** | Wednesday 7:30pm | No teams listed 

 |
| **Division B1/B2** | Thursday 7:30pm & 8:30pm | Conch Picklers, AON, The Bird, McAlpine, MUFG 1, North End Re, GT 1, McCormick 1, Conyers 1, CUC 1 

 |
| **Division C1** | Monday 7:30pm & 8:30pm | Conyers 2, MUFG 3, Dart 2, KPMG 2, Walkers, CINICO, Stuarts Humphries, Kirk IT, Waystone, Mourant, Royal Bank of Canada Insurance Co, Healthy Futures 

 |
| **Division A** | Wednesday 6:30pm | Dilluminati, Locale Staycationers, Anglin-Lewis & Associates, Quality, The UpSetters, Century 21 

 |
| **Division B3** | Tuesday 7:30pm & 8:30pm | McGrath Tonner, Baker Tilly Cayman, Autonomous, Dentons, MHA Cayman, Kensington Management Group, Hash Directors, Dart 1, KPMG 1, Greenlight Re 1, Bogle Insurance Brokers Ltd., TechCayman 

 |
| **Division C2** | Monday 7:30pm & 8:30pm | Phoenix Ltd, CUC 2, Greenlight Re 2, CSC, Calderwood, Expertise Group Cayman, IRIS 365 Slammers, MBTS, Paget-Brown Financial Services, Digicel, Metabase58 Cayman Limited, The Security Centre Ltd. 

 |
| **Division B4** | Tuesday 7:30pm & 8:30pm | MUFG 2, GT 2, McCormick 2, RBC Dominion Securities, Pickle Tickle LTD, CIRCA, Harneys, Strategic Risk Solutions, Rubis Cayman Islands Limited, IMS Ltd, Campbells LLP, CITCO 1 

 |
| **Division C3** | Monday 7:30pm & 8:30pm | KPMG 3, CITCO 2, Rawlinson & Hunter, Tower Research Capital, Samson Law, Kimpton Seafire / Hotel Indigo, BDO, CITCO 2, Rawlinson & Hunter, Tower Research Capital, Samson Law, Kimpton Seafire / Hotel Indigo, BDO 

 |

**Task:** Generate a comprehensive JSON output that simulates the data for the four pages of the website: 'Team', 'Leaderboard', 'Scores', and 'Statistics'.

1. **Team Page Data:** List all divisions, their playing days/times, and the complete list of teams in a structure suitable for the 'Team' page.
2. **Leaderboard Page Data:** Create a separate, simulated leaderboard for **Division A** and **Division B1/B2** using dummy statistics. Each team entry must include: **Wins**, **Losses**, **Win %** (as a decimal), **Points For**, and **Points Against**. Sort the teams by their Win %.
3. **Scores Page Data:** Create a list of 5 recent game results for **Division A** using dummy data. Each result must include: **Winning Team**, **Losing Team**, **Winner Score** (always 11), and **Loser Score** (a random score less than 11).
4. **Statistics Page Data (Team Level):** For two teams—'Dilluminati' (Division A) and 'Conch Picklers' (Division B1/B2)—create advanced team statistics using dummy data, including: **Total Games Played**, **Average Points Per Game**, **Average Point Differential**, and **Longest Win Streak**.
5. **Statistics Page Data (Player Level):** For the 'Dilluminati' team, create a list of 4 dummy player names (e.g., Player 1, Player 2) and assign each dummy player individual advanced statistics: **Player Name**, **Total Games Played**, **Average Points Scored**, **Total Aces**, and **Faults Per Game**.

**Constraint:** Ensure all dummy data is realistic for a pickleball league where the winning score is 11."


