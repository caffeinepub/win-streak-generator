# Win Streak Generator

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- A lottery win streak generator app inspired by https://win-streak-generator.lovable.app/
- "Select Game" screen showing lottery draws grouped by time slot (1:00PM, 3:00PM, 6:00PM, 8:00PM)
- Each time slot card shows the draw time (colored header) and game name (e.g., DEAR, KL)
- After selecting a game, show a number generator / streak display screen
- Generate a set of lucky numbers for the selected lottery draw
- Display win streak history: previous generated numbers and their results
- Admin can add/edit game schedules (draw time, game name, color theme)
- Users can generate lucky numbers for any draw slot and save streak records

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan
1. Backend: Store lottery games (id, name, drawTime, colorTheme), lucky number sets per game, and streak records (generated numbers, timestamp)
2. Backend: Functions to list games, generate lucky numbers for a game, get streak history, add/update/delete games (admin)
3. Frontend: Home screen — "Select Game" with cards per draw time, color-coded by game
4. Frontend: Game detail screen — lucky number generator button, animated number reveal, streak history list
5. Frontend: Admin panel — manage game list (add/edit/delete draw slots)
