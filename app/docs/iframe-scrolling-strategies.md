# Cross-Browser Iframe Scrolling Strategies

This document outlines alternative techniques to force a parent page scroll adjustment from within an iframe without parent-side code.

## Option 1: The `scrollIntoView` Method
Use the dedicated browser API designed specifically for viewport alignment.
- **Mechanism:** `anchor.scrollIntoView({ block: 'start', behavior: 'smooth' })`
- **Why:** Often treated as a more explicit "intent to move" by browser engines than simple focus.

## Option 2: The "Hidden Input" Trick
Leverage aggressive mobile browser behavior regarding form accessibility.
- **Mechanism:** Use a hidden `<input type="text" />` as the anchor.
- **Why:** Especially on iOS/Safari, browsers prioritize keeping active inputs visible to ensure the user can see what they are interacting with.

## Option 3: Hash Navigation (URL Fragment)
Utilize native browser anchor behavior.
- **Mechanism:** Briefly append `#top` or similar to the iframe URL.
- **Why:** Browsers naturally attempt to align the parent window when a fragment identifier is present in an iframe source change.

## Proposed "Triple-Threat" Implementation
Combine all three for maximum compatibility:
1. Replace the `div` anchor with a hidden `input`.
2. Trigger `.focus()` AND `.scrollIntoView()` simultaneously.
3. Pulse a URL hash update as a final fallback.
