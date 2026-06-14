// Thin wrapper around Umami's custom-event tracking.
//
// Page views (including which dog profiles get visited) are tracked
// automatically by the Umami script — so this is only for conversion-style
// events worth counting on top of that. `track()` is a safe no-op when Umami
// isn't loaded (local dev, CI, or before the script arrives), so callers never
// need to guard.
type UmamiEventData = Record<string, string | number | boolean>

declare global {
  interface Window {
    umami?: { track: (event: string, data?: UmamiEventData) => void }
  }
}

export function useAnalytics() {
  function track(event: string, data?: UmamiEventData) {
    if (import.meta.client) {
      window.umami?.track(event, data)
    }
  }

  return { track }
}
