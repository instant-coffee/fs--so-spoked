import type { BrandConfig } from "./brand"

export type TThemeMode = "dark" | "light";

// Built-in accent swatches shown in TweaksPanel.
// TODO(future): allow users to define additional custom hex values here
export const ACCENT_HEXES = ["#FF5C00", "#99E500", "#7B00D4"];

export const ACCENT_NAMES: Record<string, string> = {
  "#FF5C00": "Safety Orange",
  "#99E500": "Acid Green",
  "#7B00D4": "Pure Purple",
};

const DEFAULT_DISPLAY_FONT = "Playfair Display"
const DEFAULT_BODY_FONT = "Space Grotesk"

/**
 * Builds the theme object consumed by every component.
 *
 * When a BrandConfig is provided and enabled, brand colors overlay the
 * base dark/light palette:
 *   brand.accent    → accent, accentLine, resultAccent
 *   brand.secondary → headerBg, resultBg (the structural dark panels)
 *   brand.primary   → primary (new field — interactive elements, active borders)
 *   brand.displayFont / brand.bodyFont → typography fields
 */
export function makeTheme(mode: TThemeMode, accentHex: string, brand?: BrandConfig) {
  const branded = brand?.enabled ?? false
  const accent  = branded ? brand!.accent    : (accentHex || "#FF5C00")
  const primary = branded ? brand!.primary   : accent

  const displayFont = branded ? brand!.displayFont : DEFAULT_DISPLAY_FONT
  const bodyFont    = branded ? brand!.bodyFont    : DEFAULT_BODY_FONT

  const headerBg = branded ? brand!.secondary : (mode === "dark" ? "#000000" : "#101010")
  const resultBg = branded ? brand!.secondary : (mode === "dark" ? "#000000" : "#101010")

  const base = {
    accent,
    accentLine: accent,
    primary,
    accentName: ACCENT_NAMES[accent] ?? "Custom",
    resultAccent: accent,
    resultBg,
    resultText: "#FFFFFF",
    headerBg,
    displayFont,
    bodyFont,
  }

  if (mode === "dark") {
    return {
      ...base,
      bg: "#101010",
      surface: "#1A1A1A",
      surfaceActive: "#222222",
      text: "#FFFFFF",
      muted: "#888880",
      border: "#2A2A28",
    }
  }

  return {
    ...base,
    bg: "#F9F8F5",
    surface: "#FFFFFF",
    surfaceActive: "#F0F0EC",
    text: "#101010",
    muted: "#888880",
    border: "#DCDBD8",
  }
}
