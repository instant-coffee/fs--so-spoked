export type TThemeMode = "dark" | "light";
export type TThemeCodes = "#FF5C00" | "#99E500" | "#7B00D4";

export const ACCENT_HEXES = ["#FF5C00", "#99E500", "#7B00D4"];

export const ACCENT_NAMES = {
  "#FF5C00": "Safety Orange",
  "#99E500": "Acid Green",
  "#7B00D4": "Pure Purple",
};

export function makeTheme(mode: TThemeMode, accentHex: TThemeCodes) {
  const accent = accentHex || "#FF5C00";
  if (mode === "dark") {
    return {
      bg: "#101010",
      surface: "#1A1A1A",
      surfaceActive: "#222222",
      headerBg: "#000000",
      accentLine: accent,
      text: "#FFFFFF",
      muted: "#888880",
      border: "#2A2A28",
      accent,
      accentName: ACCENT_NAMES[accent] || "Custom",
      resultBg: "#000000",
      resultText: "#FFFFFF",
      resultAccent: accent,
    };
  }
  return {
    bg: "#F9F8F5",
    surface: "#FFFFFF",
    surfaceActive: "#F0F0EC",
    headerBg: "#101010",
    accentLine: accent,
    text: "#101010",
    muted: "#888880",
    border: "#DCDBD8",
    accent,
    accentName: ACCENT_NAMES[accent] || "Custom",
    resultBg: "#101010",
    resultText: "#FFFFFF",
    resultAccent: accent,
  };
}
