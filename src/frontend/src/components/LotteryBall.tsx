import { getTheme } from "../utils/theme";

interface LotteryBallProps {
  number: number | bigint;
  colorTheme: string;
  size?: "sm" | "md" | "lg";
  animationDelay?: number;
  animate?: boolean;
}

export function LotteryBall({
  number,
  colorTheme,
  size = "md",
  animationDelay = 0,
  animate = false,
}: LotteryBallProps) {
  const theme = getTheme(colorTheme);

  const sizeClasses = {
    sm: "w-8 h-8 text-xs font-bold",
    md: "w-11 h-11 text-base font-bold",
    lg: "w-14 h-14 text-lg font-extrabold",
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${theme.ballBg}
        ${theme.ballText}
        rounded-full
        flex items-center justify-center
        shadow-[inset_0_-3px_6px_oklch(0_0_0/25%),inset_0_2px_4px_oklch(1_0_0/30%)]
        select-none
        font-display
        ${animate ? "ball-animate" : ""}
      `}
      style={animate ? { animationDelay: `${animationDelay}ms` } : undefined}
    >
      {String(number)}
    </div>
  );
}
