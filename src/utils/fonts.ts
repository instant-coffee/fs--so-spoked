// Tracks which font families have already been injected so we don't
// add duplicate <link> tags on repeated calls.
const loaded = new Set<string>()

// Default fonts are already declared in index.html; mark them as loaded
// so the loader never issues a redundant request for them.
loaded.add("Playfair Display")
loaded.add("Space Grotesk")
loaded.add("Space Mono")

/**
 * Injects a Google Fonts stylesheet for `name` if it hasn't been loaded yet.
 * Requests 400 and 700 weights — sufficient for the display/body roles.
 *
 * TODO(v2): accept a `weights` param so heavy display fonts can request 900
 * TODO(v3): loadCustomFont(name, url) — load from an uploaded file URL via FontFace API
 */
export function loadGoogleFont(name: string): void {
  if (!name || loaded.has(name)) return
  const family = name.replace(/ /g, "+")
  const href = `https://fonts.googleapis.com/css2?family=${family}:wght@400;700&display=swap`
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = href
  document.head.appendChild(link)
  loaded.add(name)
}
