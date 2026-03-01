# Static Kineticism: Share Image Animation Ideas

This document explores graphic design techniques to imply motion and energy in static JPEG/PNG share images for the "Roost Kinetic" aesthetic.

## Option 1: The "Echo" Effect (Stutter Motion) - [EXPERIMENTING]
Render key text elements (winner name, high scores) with multiple "ghost" layers offset behind them.
- **Visual:** Progressive transparency (e.g., 20%, 10%, 5%) and slight positional offsets.
- **Energy:** Implies high-velocity impact or "slimming" into place.
- **Implementation:** Layered CSS `text-shadow` or absolute duplicated elements.

## Option 2: Directional Speed Trails (Swoosh Graphics)
Thin, tapered strokes radiating from the edges of numbers or containers.
- **Visual:** Sharp "wind lines" trailing horizontally or diagonally.
- **Energy:** Classic sports-broadcast/comic-book urgency.
- **Implementation:** SVG paths or pseudo-elements with `clip-path`.

## Option 3: The "Motion Blur" Gradient
A directional "smear" or streak effect behind moving elements.
- **Visual:** A brand-colored gradient that fades from sharp to blurred.
- **Energy:** Mimics camera shutter lag for a "live" feel.
- **Implementation:** `linear-gradient` masks or `backdrop-filter`.
