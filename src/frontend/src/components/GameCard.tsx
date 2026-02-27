import type { Game } from "../backend.d";
import { getTheme } from "../utils/theme";
import { drawTimeToLabel } from "../utils/theme";

interface GameCardProps {
  game: Game;
  onClick: () => void;
}

export function GameCard({ game, onClick }: GameCardProps) {
  const theme = getTheme(game.colorTheme);
  const drawLabel = drawTimeToLabel(game.drawTime);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full text-left rounded-xl overflow-hidden
        border-2 ${theme.border}
        shadow-card game-card
        focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
      `}
      aria-label={`Select ${game.name} at ${drawLabel}`}
    >
      {/* Colored header bar */}
      <div className={`${theme.headerBg} px-4 py-2`}>
        <span
          className={`${theme.headerText} text-sm font-semibold font-sans tracking-wide`}
        >
          {drawLabel}
        </span>
      </div>

      {/* White body with game name */}
      <div className="bg-white px-4 py-5">
        <p
          className={`${theme.bodyText} text-3xl font-extrabold font-display tracking-tight`}
        >
          {game.name.toUpperCase()}
        </p>
      </div>
    </button>
  );
}
