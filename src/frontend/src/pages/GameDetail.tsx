import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Game, LuckyNumberSet } from "../backend.d";
import { LotteryBall } from "../components/LotteryBall";
import {
  useGenerateLuckyNumbers,
  useLuckyNumberSetsForGame,
} from "../hooks/useQueries";
import { drawTimeToLabel, getTheme } from "../utils/theme";

interface GameDetailProps {
  game: Game;
  onBack: () => void;
}

function formatTimestamp(ts: bigint): string {
  // timestamp is in nanoseconds from ICP
  const ms = Number(ts) / 1_000_000;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function GameDetail({ game, onBack }: GameDetailProps) {
  const theme = getTheme(game.colorTheme);
  const drawLabel = drawTimeToLabel(game.drawTime);

  const [animateSet, setAnimateSet] = useState<LuckyNumberSet | null>(null);

  const { data: history, isLoading: historyLoading } =
    useLuckyNumberSetsForGame(game.id);
  const generateMutation = useGenerateLuckyNumbers();

  const handleGenerate = async () => {
    try {
      await generateMutation.mutateAsync(game.id);
      toast.success("Lucky numbers generated!");
    } catch {
      toast.error("Failed to generate numbers");
    }
  };

  // When history updates after generation, animate the newest set
  useEffect(() => {
    if (!generateMutation.isSuccess || !history || history.length === 0) return;
    const sorted = [...history].sort(
      (a, b) => Number(b.timestamp) - Number(a.timestamp),
    );
    setAnimateSet(sorted[0]);
    const timer = setTimeout(() => setAnimateSet(null), 3000);
    return () => clearTimeout(timer);
  }, [history, generateMutation.isSuccess]);

  const sortedHistory = history
    ? [...history].sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    : [];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-6 px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-border hover:bg-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Back to Select Game"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
              Lucky Draw
            </p>
          </div>
        </div>

        {/* Game Title Card */}
        <div
          className={`rounded-xl overflow-hidden border-2 ${theme.border} mb-6 shadow-card`}
        >
          <div
            className={`${theme.headerBg} px-5 py-2.5 flex items-center gap-2`}
          >
            <Clock className="w-3.5 h-3.5 text-white/80" />
            <span className="text-white text-sm font-semibold tracking-wide">
              {drawLabel}
            </span>
          </div>
          <div className="bg-white px-5 py-4">
            <p
              className={`${theme.bodyText} text-4xl font-extrabold font-display tracking-tight`}
            >
              {game.name.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Latest Numbers Display */}
        {sortedHistory.length > 0 && (
          <div
            className={`${theme.lightBg} rounded-xl p-5 mb-4 border ${theme.border}`}
          >
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest mb-4 text-center">
              Latest Numbers
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {sortedHistory[0].numbers.map((num, i) => (
                <LotteryBall
                  key={`latest-${i}-${num}`}
                  number={num}
                  colorTheme={game.colorTheme}
                  size="lg"
                  animate={animateSet?.id === sortedHistory[0].id}
                  animationDelay={i * 120}
                />
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-3">
              {formatTimestamp(sortedHistory[0].timestamp)}
            </p>
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={generateMutation.isPending}
          className={`
            w-full h-12 text-base font-bold font-display tracking-wide
            ${theme.buttonBg} ${theme.buttonHover}
            text-white
            rounded-xl
            shadow-md
            transition-all
            hover:scale-[1.01] active:scale-[0.99]
            focus-visible:ring-2 focus-visible:ring-ring
            shimmer-btn
            border-0
          `}
        >
          {generateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <Sparkles className="mr-2 w-4 h-4" />
              Generate Lucky Numbers
            </>
          )}
        </Button>

        {/* Streak History */}
        <div className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Streak History
          </h2>

          {historyLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : sortedHistory.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-border p-6 text-center">
              <p className="text-muted-foreground text-sm">
                No numbers generated yet. Hit the button above!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {sortedHistory.map((set, idx) => (
                <div
                  key={set.id.toString()}
                  className={`
                    bg-card rounded-xl border border-border px-4 py-3
                    ${idx === 0 ? "ring-1 ring-inset ring-border" : ""}
                    fade-slide-up
                  `}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-bold ${idx === 0 ? theme.bodyText : "text-muted-foreground"}`}
                    >
                      {idx === 0 ? "Latest" : `#${sortedHistory.length - idx}`}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(set.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {set.numbers.map((num, i) => (
                      <LotteryBall
                        key={`${set.id}-${i}-${num}`}
                        number={num}
                        colorTheme={game.colorTheme}
                        size="sm"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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
