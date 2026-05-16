# Iframe Integration Guide

To ensure the Corporate Pickleball League application integrates seamlessly when embedded into host websites, specific UI behaviors and communication protocols are implemented.

## Detection Mechanism

The application detects if it is running inside an iframe using a `useMemo` hook in `Layout.tsx`:

```typescript
const isIframe = React.useMemo(() => {
  try {
    return window.self !== window.top;
  } catch {
    // Fallback for security errors in some environments
    return true;
  }
}, []);
```

This state is used to conditionally toggle layout elements and enable parent-window communication.

## UI Adjustments

When `isIframe` is true, the following "outer" branding and navigation elements are hidden to allow the host site to provide its own context:

- **TopFrame**: The fixed dark navy bar at the very top (containing status/time).
- **Global Branding**: The "Corporate Pickleball League" text in the sticky top bar.
- **Page Headings**: The large "Standings" or "Matches" headings and the "Summer 2026" season text.

**Retained Elements**:
- **Division Tabs**: Essential for filtering data.
- **Page Selector Pill**: Essential for switching between Leaderboard and Matches views.
- **Update Banners**: Necessary for notifying users of new data/versions.

## Height Resizer (Parent Communication)

The application automatically communicates its height to the parent window to prevent internal scrollbars. This is handled via a `ResizeObserver` and `postMessage` in `Layout.tsx`:

- **Event**: `postMessage`
- **Payload**: `{ height: number }` (Includes a 20px buffer)
- **Target**: `window.parent`

Host sites should listen for this message and adjust the iframe height accordingly.

## CSS Adjustments

- **Min-Height**: The `min-h-screen` class is removed from the app container when in an iframe to prevent unnecessary vertical stretching.
- **Data Attributes**: The `data-is-iframe` attribute is added to the `#app-container` element for targetable CSS overrides.
