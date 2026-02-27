export type ColorTheme =
  | "red"
  | "green"
  | "purple"
  | "black"
  | "blue"
  | "orange";

export interface ThemeConfig {
  headerBg: string;
  headerText: string;
  bodyText: string;
  border: string;
  ballBg: string;
  ballText: string;
  buttonBg: string;
  buttonHover: string;
  lightBg: string;
}

const themes: Record<string, ThemeConfig> = {
  red: {
    headerBg: "bg-[oklch(0.55_0.22_25)]",
    headerText: "text-white",
    bodyText: "text-[oklch(0.5_0.22_25)]",
    border: "border-[oklch(0.75_0.1_25)]",
    ballBg: "bg-[oklch(0.55_0.22_25)]",
    ballText: "text-white",
    buttonBg: "bg-[oklch(0.55_0.22_25)]",
    buttonHover: "hover:bg-[oklch(0.48_0.22_25)]",
    lightBg: "bg-[oklch(0.97_0.02_25)]",
  },
  green: {
    headerBg: "bg-[oklch(0.5_0.18_150)]",
    headerText: "text-white",
    bodyText: "text-[oklch(0.42_0.18_150)]",
    border: "border-[oklch(0.72_0.1_150)]",
    ballBg: "bg-[oklch(0.5_0.18_150)]",
    ballText: "text-white",
    buttonBg: "bg-[oklch(0.5_0.18_150)]",
    buttonHover: "hover:bg-[oklch(0.44_0.18_150)]",
    lightBg: "bg-[oklch(0.97_0.02_150)]",
  },
  purple: {
    headerBg: "bg-[oklch(0.48_0.22_295)]",
    headerText: "text-white",
    bodyText: "text-[oklch(0.44_0.22_295)]",
    border: "border-[oklch(0.72_0.1_295)]",
    ballBg: "bg-[oklch(0.48_0.22_295)]",
    ballText: "text-white",
    buttonBg: "bg-[oklch(0.48_0.22_295)]",
    buttonHover: "hover:bg-[oklch(0.42_0.22_295)]",
    lightBg: "bg-[oklch(0.97_0.02_295)]",
  },
  black: {
    headerBg: "bg-[oklch(0.22_0.02_265)]",
    headerText: "text-white",
    bodyText: "text-[oklch(0.28_0.02_265)]",
    border: "border-[oklch(0.65_0.02_265)]",
    ballBg: "bg-[oklch(0.22_0.02_265)]",
    ballText: "text-white",
    buttonBg: "bg-[oklch(0.22_0.02_265)]",
    buttonHover: "hover:bg-[oklch(0.32_0.02_265)]",
    lightBg: "bg-[oklch(0.95_0.005_265)]",
  },
  blue: {
    headerBg: "bg-[oklch(0.48_0.2_240)]",
    headerText: "text-white",
    bodyText: "text-[oklch(0.42_0.2_240)]",
    border: "border-[oklch(0.72_0.1_240)]",
    ballBg: "bg-[oklch(0.48_0.2_240)]",
    ballText: "text-white",
    buttonBg: "bg-[oklch(0.48_0.2_240)]",
    buttonHover: "hover:bg-[oklch(0.42_0.2_240)]",
    lightBg: "bg-[oklch(0.97_0.02_240)]",
  },
  orange: {
    headerBg: "bg-[oklch(0.65_0.22_50)]",
    headerText: "text-white",
    bodyText: "text-[oklch(0.52_0.22_50)]",
    border: "border-[oklch(0.78_0.12_50)]",
    ballBg: "bg-[oklch(0.65_0.22_50)]",
    ballText: "text-white",
    buttonBg: "bg-[oklch(0.65_0.22_50)]",
    buttonHover: "hover:bg-[oklch(0.58_0.22_50)]",
    lightBg: "bg-[oklch(0.97_0.03_50)]",
  },
};

export function getTheme(colorTheme: string): ThemeConfig {
  return themes[colorTheme] ?? themes.blue;
}

export const DRAW_TIME_OPTIONS = [
  { value: 1n, label: "1:00 PM" },
  { value: 3n, label: "3:00 PM" },
  { value: 6n, label: "6:00 PM" },
  { value: 8n, label: "8:00 PM" },
  { value: 10n, label: "10:00 AM" },
  { value: 11n, label: "11:00 AM" },
  { value: 2n, label: "2:00 PM" },
  { value: 4n, label: "4:00 PM" },
  { value: 7n, label: "7:00 PM" },
  { value: 9n, label: "9:00 PM" },
];

export function drawTimeToLabel(drawTime: bigint): string {
  const hour = Number(drawTime);
  if (hour < 12) {
    return `${hour}:00 AM`;
  }
  if (hour === 12) {
    return "12:00 PM";
  }
  return `${hour}:00 PM`;
}

export const COLOR_THEME_OPTIONS: { value: string; label: string }[] = [
  { value: "red", label: "Red" },
  { value: "green", label: "Green" },
  { value: "purple", label: "Purple" },
  { value: "black", label: "Black" },
  { value: "blue", label: "Blue" },
  { value: "orange", label: "Orange" },
];
