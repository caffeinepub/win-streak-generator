import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings } from "lucide-react";
import type { Game } from "../backend.d";
import { GameCard } from "../components/GameCard";
import { useAllGames } from "../hooks/useQueries";

interface SelectGameProps {
  onSelectGame: (game: Game) => void;
  onAdminClick: () => void;
}

export function SelectGame({ onSelectGame, onAdminClick }: SelectGameProps) {
  const { data: games, isLoading, isError } = useAllGames();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase mb-1">
              Lottery
            </p>
            <h1 className="text-2xl font-extrabold font-display text-foreground tracking-tight">
              Select Game
            </h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onAdminClick}
            className="flex items-center gap-1.5 text-xs font-semibold border-border"
          >
            <Settings className="w-3.5 h-3.5" />
            Admin
          </Button>
        </div>

        {/* Game List */}
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden border border-border"
              >
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-[72px] w-full rounded-none" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <p className="text-destructive font-semibold">
              Failed to load games
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              Please try again later
            </p>
          </div>
        ) : !games || games.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-border bg-card p-10 text-center">
            <div className="text-4xl mb-3">🎱</div>
            <p className="font-bold font-display text-foreground text-lg">
              No games yet
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              Go to Admin to add lottery games
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={onAdminClick}
            >
              Go to Admin
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {games.map((game) => (
              <GameCard
                key={game.id.toString()}
                game={game}
                onClick={() => onSelectGame(game)}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-10">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Built with love using caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
