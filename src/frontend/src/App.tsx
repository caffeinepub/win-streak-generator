import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import type { Game } from "./backend.d";
import { AdminPanel } from "./pages/AdminPanel";
import { GameDetail } from "./pages/GameDetail";
import { SelectGame } from "./pages/SelectGame";

type Screen =
  | { view: "select" }
  | { view: "detail"; game: Game }
  | { view: "admin" };

export default function App() {
  const [screen, setScreen] = useState<Screen>({ view: "select" });

  return (
    <>
      <Toaster position="top-center" richColors />

      {screen.view === "select" && (
        <SelectGame
          onSelectGame={(game) => setScreen({ view: "detail", game })}
          onAdminClick={() => setScreen({ view: "admin" })}
        />
      )}

      {screen.view === "detail" && (
        <GameDetail
          game={screen.game}
          onBack={() => setScreen({ view: "select" })}
        />
      )}

      {screen.view === "admin" && (
        <AdminPanel onBack={() => setScreen({ view: "select" })} />
      )}
    </>
  );
}
