export type BrandConfig = {
  enabled: boolean
  primary: string   // interactive elements, active states (e.g. header accent border)
  secondary: string // structural darks — header bg, result card bg
  accent: string    // CTA buttons, accent lines, highlights
  displayFont: string
  bodyFont: string
}

export const DEFAULT_BRAND: BrandConfig = {
  enabled: false,
  primary: "#0093CA",
  secondary: "#111111",
  accent: "#FF5C00",
  displayFont: "Playfair Display",
  bodyFont: "Space Grotesk",
}

// Curated free Google Fonts grouped by category.
// Fonts in this list are loaded dynamically on selection via loadGoogleFont().
// TODO(v2): allow free-text Google Font name input with debounced live preview
// TODO(v3): allow custom font upload (WOFF2/TTF) via FontFace API

export const DISPLAY_FONTS: Record<"serif" | "sansSerif", string[]> = {
  serif: [
    "Playfair Display",
    "Cormorant Garamond",
    "DM Serif Display",
    "Lora",
  ],
  sansSerif: [
    "Bebas Neue",
    "Oswald",
    "Barlow Condensed",
  ],
}

export const BODY_FONTS: Record<"serif" | "sansSerif", string[]> = {
  serif: [
    "Lora",
    "Merriweather",
    "EB Garamond",
  ],
  sansSerif: [
    "Space Grotesk",
    "Didact Gothic",
    "Inter",
    "DM Sans",
    "Nunito",
  ],
}

// Flat list used by the font loader to preload all catalog fonts eagerly.
// TODO(v2): lazy-load only on hover/selection instead of preloading all
export const ALL_CATALOG_FONTS: string[] = [
  ...DISPLAY_FONTS.serif,
  ...DISPLAY_FONTS.sansSerif,
  ...BODY_FONTS.serif,
  ...BODY_FONTS.sansSerif,
]
