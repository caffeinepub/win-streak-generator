import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Check,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Game } from "../backend.d";
import {
  useAllGames,
  useCreateGame,
  useDeleteGame,
  useUpdateGame,
} from "../hooks/useQueries";
import {
  COLOR_THEME_OPTIONS,
  DRAW_TIME_OPTIONS,
  drawTimeToLabel,
  getTheme,
} from "../utils/theme";

interface GameFormData {
  name: string;
  drawTimeValue: string;
  colorTheme: string;
}

const DEFAULT_FORM: GameFormData = {
  name: "",
  drawTimeValue: "1",
  colorTheme: "red",
};

interface AdminPanelProps {
  onBack: () => void;
}

function GameForm({
  initialData,
  onSubmit,
  onCancel,
  isPending,
  submitLabel,
}: {
  initialData: GameFormData;
  onSubmit: (data: GameFormData) => void;
  onCancel: () => void;
  isPending: boolean;
  submitLabel: string;
}) {
  const [form, setForm] = useState<GameFormData>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Game name is required");
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="game-name" className="text-sm font-semibold">
          Game Name
        </Label>
        <Input
          id="game-name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="e.g. DEAR, KL, LUCKY"
          className="font-display font-bold uppercase tracking-wide"
          autoComplete="off"
          maxLength={20}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="draw-time" className="text-sm font-semibold">
          Draw Time
        </Label>
        <Select
          value={form.drawTimeValue}
          onValueChange={(v) => setForm((f) => ({ ...f, drawTimeValue: v }))}
        >
          <SelectTrigger id="draw-time">
            <SelectValue placeholder="Select draw time" />
          </SelectTrigger>
          <SelectContent>
            {DRAW_TIME_OPTIONS.map((opt) => (
              <SelectItem
                key={opt.value.toString()}
                value={opt.value.toString()}
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="color-theme" className="text-sm font-semibold">
          Color Theme
        </Label>
        <Select
          value={form.colorTheme}
          onValueChange={(v) => setForm((f) => ({ ...f, colorTheme: v }))}
        >
          <SelectTrigger id="color-theme">
            <SelectValue placeholder="Select color" />
          </SelectTrigger>
          <SelectContent>
            {COLOR_THEME_OPTIONS.map((opt) => {
              const t = getTheme(opt.value);
              return (
                <SelectItem key={opt.value} value={opt.value}>
                  <span className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${t.ballBg} inline-block`}
                    />
                    {opt.label}
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Preview */}
      {form.name && (
        <div
          className={`rounded-lg overflow-hidden border-2 ${getTheme(form.colorTheme).border} mt-2`}
        >
          <div className={`${getTheme(form.colorTheme).headerBg} px-3 py-1.5`}>
            <span className="text-white text-xs font-semibold">
              {(() => {
                const found = DRAW_TIME_OPTIONS.find(
                  (o) => o.value.toString() === form.drawTimeValue,
                );
                return found
                  ? found.label
                  : drawTimeToLabel(BigInt(form.drawTimeValue || 1));
              })()}
            </span>
          </div>
          <div className="bg-white px-3 py-3">
            <p
              className={`${getTheme(form.colorTheme).bodyText} text-xl font-extrabold font-display tracking-tight`}
            >
              {form.name.toUpperCase()}
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 font-semibold"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Saving…
            </>
          ) : (
            <>
              <Check className="mr-2 w-4 h-4" /> {submitLabel}
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const { data: games, isLoading } = useAllGames();
  const createMutation = useCreateGame();
  const updateMutation = useUpdateGame();
  const deleteMutation = useDeleteGame();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  const handleCreate = async (data: GameFormData) => {
    try {
      await createMutation.mutateAsync({
        name: data.name.trim(),
        drawTime: BigInt(data.drawTimeValue),
        colorTheme: data.colorTheme,
      });
      toast.success(`"${data.name}" added!`);
      setShowAddForm(false);
    } catch {
      toast.error("Failed to create game");
    }
  };

  const handleUpdate = async (data: GameFormData) => {
    if (!editingGame) return;
    try {
      await updateMutation.mutateAsync({
        gameId: editingGame.id,
        name: data.name.trim(),
        drawTime: BigInt(data.drawTimeValue),
        colorTheme: data.colorTheme,
      });
      toast.success(`"${data.name}" updated!`);
      setEditingGame(null);
    } catch {
      toast.error("Failed to update game");
    }
  };

  const handleDelete = async (game: Game) => {
    try {
      await deleteMutation.mutateAsync(game.id);
      toast.success(`"${game.name}" deleted`);
    } catch {
      toast.error("Failed to delete game");
    }
  };

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
              Management
            </p>
            <h1 className="text-xl font-extrabold font-display text-foreground tracking-tight">
              Admin Panel
            </h1>
          </div>
        </div>

        {/* Add Game Button */}
        {!showAddForm && !editingGame && (
          <Button
            onClick={() => setShowAddForm(true)}
            className="w-full mb-5 font-semibold"
            variant="default"
          >
            <Plus className="mr-2 w-4 h-4" />
            Add Game
          </Button>
        )}

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-card rounded-xl border border-border p-4 mb-5 shadow-card">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
              New Game
            </h2>
            <GameForm
              initialData={DEFAULT_FORM}
              onSubmit={handleCreate}
              onCancel={() => setShowAddForm(false)}
              isPending={createMutation.isPending}
              submitLabel="Add Game"
            />
          </div>
        )}

        {/* Games List */}
        <div className="space-y-3">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))
          ) : !games || games.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-border p-8 text-center">
              <p className="text-muted-foreground text-sm">
                No games yet. Add one above.
              </p>
            </div>
          ) : (
            games.map((game) => {
              const theme = getTheme(game.colorTheme);
              const isEditing = editingGame?.id === game.id;

              if (isEditing) {
                return (
                  <div
                    key={game.id.toString()}
                    className="bg-card rounded-xl border border-border p-4 shadow-card"
                  >
                    <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
                      Edit Game
                    </h2>
                    <GameForm
                      initialData={{
                        name: game.name,
                        drawTimeValue: game.drawTime.toString(),
                        colorTheme: game.colorTheme,
                      }}
                      onSubmit={handleUpdate}
                      onCancel={() => setEditingGame(null)}
                      isPending={updateMutation.isPending}
                      submitLabel="Save Changes"
                    />
                  </div>
                );
              }

              return (
                <div
                  key={game.id.toString()}
                  className={`rounded-xl overflow-hidden border-2 ${theme.border} shadow-card`}
                >
                  <div className={`${theme.headerBg} px-4 py-2`}>
                    <span className="text-white text-sm font-semibold tracking-wide">
                      {drawTimeToLabel(game.drawTime)}
                    </span>
                  </div>
                  <div className="bg-white px-4 py-3 flex items-center justify-between">
                    <p
                      className={`${theme.bodyText} text-2xl font-extrabold font-display tracking-tight`}
                    >
                      {game.name.toUpperCase()}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddForm(false);
                          setEditingGame(game);
                        }}
                        className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={`Edit ${game.name}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            type="button"
                            className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label={`Delete ${game.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete "{game.name}"?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the game and all its
                              generated lucky numbers. This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(game)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {deleteMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                "Delete"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              );
            })
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
