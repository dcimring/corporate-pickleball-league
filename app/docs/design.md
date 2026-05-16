# Design System: Corporate Pickleball League

This document details the visual design system and branding for the Corporate Pickleball League application. The design aesthetic is **"Editorial Athlete"**—a high-contrast, professional sports-editorial UI optimized for performance and impact.

## Color Palette

The system uses a high-contrast palette built around Navy and Yellow, with varying levels of intensity.

### Core Colors
| Token | HEX | Usage |
| :--- | :--- | :--- |
| `navy` | `#005596` | Primary brand color, body text |
| `yellow` | `#ffc93c` | Primary accent, highlights, active states |
| `surface` | `#eef2f7` | Main background color |
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
- **Gradients:** Use of radial and linear gradients on the body to create a sense of depth and focus.
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
