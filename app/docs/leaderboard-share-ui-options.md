# Leaderboard Social Sharing UI Options (Desktop)

This document outlines the proposed layout options for the social sharing section on the Leaderboard page after removing the border and shadow.

## Option 1: Horizontal Row (The "Linear" Look) - [SELECTED]
Place all three sharing options (Story, Post, WhatsApp) in a single horizontal row on desktop.
- **Pros:** Very compact vertically; looks like a modern toolbar.
- **Implementation:** Center the heading above a `flex-row` container of buttons.

## Option 2: Featured Grid (The "Triptych" Look)
A 3-column grid where each sharing option gets its own "card" space (without the outer border/shadow).
- **Pros:** Feels more intentional and "designed" than a simple row.
- **Visuals:** Each column could have a small descriptive icon.

## Option 3: Split Header & Action (The "Call to Action" Look)
Keep the heading on the left and group the three buttons on the right.
- **Pros:** Maximizes horizontal space; makes the section feel less like a "block" and more like a footer extension.
- **Implementation:** `flex flex-row justify-between items-center`.
