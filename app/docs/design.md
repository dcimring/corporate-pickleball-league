# Design System: Corporate Pickleball League

This document details the visual design system and branding for the Corporate Pickleball League application. The design aesthetic is **"Editorial Athlete"**—a high-contrast, professional sports-editorial UI optimized for performance and impact.

## Color Palette

The system uses a high-contrast palette built around Navy and Yellow, with varying levels of intensity.

### Core Colors
| Token | HEX | Usage |
| :--- | :--- | :--- |
| `navy` | `#005596` | Primary brand color, body text |
| `yellow` | `#ffc93c` | Primary accent, highlights, active states |
| `surface` | `#ffffff` | Main background color (pure white so the pickleball.ky iframe embed blends seamlessly with the parent page — do not tint) |
| `card` | `#ffffff` | Background for cards and containers |

### Semantic Colors
| Token | HEX | Usage |
| :--- | :--- | :--- |
| `success` | `#1f9b51` | Positive point differentials, win indicators |
| `error` | `#d6362a` | Negative point differentials, loss indicators |
| `muted` | `#a3b3d0` | Secondary labels, disabled states |

### Themes
The application supports a "Court" theme and a "Dark" theme, adjusted via the `data-theme` attribute.
- **Court Theme:** Enhanced contrast with deeper background tints.
- **Dark Theme:** Deep blue background (`#0a1d44`) with high-visibility white and yellow accents.

## Typography

The design uses a modern, bold typographic stack to create an editorial feel.

- **Display & Headings:** `Archivo` (Extra Bold/Black, Tracking: -0.02em)
- **Body Text:** `Archivo` (SemiBold/Bold)
- **Stats & Labels:** `JetBrains Mono` (Medium/SemiBold, Tracking: 0.08em, Uppercase)

## Visual Elements

### Shapes & Spacing
- **Border Radius:** Standard `14px` for cards and containers, `8px` for smaller elements.
- **Shadows:** Ambient depth with large, soft shadows (e.g., `0 24px 60px -40px rgba(20, 58, 120, 0.25)`).
- **Rules:** Light borders (`rgba(20, 58, 120, 0.08)`) are used to separate sections without adding visual weight.

### Layout Patterns
- **Ground:** Flat pure-white body (`--bg: #ffffff`). The body previously carried
  radial/linear gradients; these were removed (Aug 2026) so the module blends
  seamlessly into the white pickleball.ky parent page when embedded — separation
  now comes entirely from card shadows and rules. Do not reintroduce a tinted or
  gradient ground.
- **Grid:** Responsive grid for match cards and leaderboard rows.
- **Mobile Optimization:** Semantic grid areas for leaderboard rows on mobile to ensure data remains legible.

## Component Specifics

### Match Cards
- Floating effect on hover (`translateY(-2px)`).
- Clear win/loss indicators via the "Win Dot" and margin bars.

### Leaderboard
- High-contrast ranking numbers in Mono font.
- Accent bars on "Featured" rows (e.g., the top team).
- Color-coded "Diff Chips" for point differential.

### Share Cards (social export)
- Fixed 1080×1350 portrait canvas (`src/components/share/`), "Masthead"
  direction chosen from mockups in Sep 2026: mono yellow kicker, huge Archivo
  Black headline (STANDINGS / MATCH RESULT), yellow bar, division line, then
  the body. The leader row (standings) and the winning team (match) sit on a
  solid yellow tile with navy type — borrowed from the "Scoreboard" mockup.
- **Navy ground is intentional here** and is the only exception to the
  white-ground rule: the card is a standalone social image, not part of the
  embedded page.
- Colours are literal hex (`#005596`, `#ffc93c`, `#ffffff`), sizes are px,
  and no Tailwind responsive classes or theme tokens are used, so the export
  never changes with viewport or `[data-theme]`.
- Footer carries the favicon mark, "Pickleball Cayman", the as-of date and
  `pickleball.ky/corporate-league`.
