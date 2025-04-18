# Robot Wars Online - Project Status & Next Steps Plan

## Summary of Accomplishments (Phase 2 Complete - Lobby & UX)

*   **Player Identity:** Implemented player name input, localStorage persistence, server-side storage, and display within the game UI (below robot, stats panel) and lobby messages.
*   **Lobby UI:** Added dedicated UI elements for Lobby Status, an Event Log, and basic Chat input/button.
*   **Real-time Lobby Feedback:**
    *   **Event Log:** Displays system messages (connect, disconnect, ready, game start/over) and player chat messages, with basic type-based styling and auto-scroll.
    *   **Lobby Status:** Shows connection status and the number of players waiting vs. ready for a match.
    *   **Chat:** Enabled real-time message sending and receiving among all connected clients via the server.
*   **Explicit Ready System:** Replaced the auto-start mechanism with a "Ready Up" / "Unready" button toggle. Players must now explicitly signal readiness (by submitting code/name/appearance) before being considered for matchmaking. Unreadying is possible via the button or resetting.
*   **Matchmaking:** Updated `GameManager` to only match players who are currently marked as `isReady`.
*   **UI Polish:** Integrated selected retro fonts (`VT323`, `Press Start 2P`) while maintaining the modern dark theme, adjusting font sizes for readability.
*   **Bug Fixes:**
    *   Resolved the canvas width discrepancy issue, ensuring client rendering matches the server's coordinate space.
    *   Fixed the "Unknown" name display on robots by correctly passing the name to the client's game state representation.
    *   Corrected issues with the dashboard stats display (`SyntaxError`).

## Next Steps Plan (Phase 3 - Spectator Mode & Game Tracking)

**Priority 1: Implement Spectator Mode**

*   **Goal:** Allow users connecting while a game is in progress to watch the ongoing match. When the match ends, automatically transition spectators back to the lobby state.

1.  **Server - Connection Logic (`GameManager`, `socket-handler`):**
    *   On client connection, check `GameManager.activeGames`.
    *   If a game is active:
        *   Select a game to spectate (e.g., the first active one).
        *   Emit a `spectateStart` event to the client (include `gameId` and the upcoming `gameName`).
        *   Add the client's socket to a dedicated spectator room (e.g., `spectator-${gameId}`).
        *   **Do not** add the client to `pendingPlayers` yet.
    *   If no game is active: Proceed with existing lobby logic (add to `pendingPlayers`, etc.).
2.  **Server - State Broadcasting (`GameInstance`):**
    *   In `tick()`, broadcast `gameStateUpdate` to *both* the game room (`this.gameId`) and the spectator room (`spectator-${this.gameId}`).
3.  **Server - Game End Handling (`GameManager`, `GameInstance`):**
    *   When `GameInstance.checkGameOver` is true:
        *   Besides calling the `gameOverCallback`, emit a `spectateGameOver` event to the spectator room (`spectator-${this.gameId}`).
        *   In `GameManager`, when cleaning up a finished game (perhaps after the `gameOverCallback`), ensure all sockets are removed from the spectator room (`io.in(spectatorRoom).socketsLeave(spectatorRoom)`).
        *   Transition sockets that were in the spectator room to the `pendingPlayers` list (effectively moving them to the lobby). Call `addPlayer` for each. Broadcast lobby status update after moving them.
4.  **Client - State Management (`network.js`, `game.js`, `controls.js`, `lobby.js`):**
    *   `network.js`: Add `isSpectating` flag. Listen for `spectateStart` (set flag, store `gameId`/`gameName`, call `game.handleSpectateStart`). Listen for `spectateGameOver` (clear flag, call `game.handleSpectateEnd`). Modify `gameStateUpdate` listener to update `game` state even if spectating. Ensure player `gameOver` handler ignores event if spectating.
    *   `game.js`: Add `handleSpectateStart(gameInfo)` (clear state, disable controls via `controls.setReadyState(false)`, show "Spectating Game [Name]" status, start render loop). Add `handleSpectateEnd()` (stop render loop, enable controls via `controls.setReadyState(false)`, show "Returned to Lobby" status).
    *   `controls.js`: Ensure `setReadyState(false)` correctly disables all interaction when spectating begins, and re-enables when it ends (via `handleSpectateEnd` calling it).
    *   `lobby.js`: Update `updateLobbyStatus` based on `spectateStart` and `spectateEnd` events.

**Priority 2: Implement Game Tracking & Naming**

*   **Goal:** Assign a unique, thematic name to each game instance, display it, and potentially log match results briefly (server-side, volatile).

1.  **Server - Naming Formula (`GameManager`):**
    *   Create `generateGameName()` function.
    *   Implement a simple R&M style formula using `gameIdCounter`, e.g., `return \`Dimension C-\${137 + this.gameIdCounter}\`;` or similar variation (like `X-${gameIdCounter % 26}${Math.floor(gameIdCounter / 26)}`).
2.  **Server - Storage & Association (`GameManager`, `GameInstance`):**
    *   In `GameManager.createGame`: Call `generateGameName()` and store the result.
    *   Pass the `gameName` to the `GameInstance` constructor.
    *   `GameInstance`: Store `this.gameName`. Include it in the payload for the `gameStart` event sent to players and the `spectateStart` event sent to spectators.
    *   `GameManager` (Optional): Maintain a small, volatile map (`Map<gameId, {name, winnerName, players, endTime}>`) of recently completed games. Populate this in `handleGameOverEvent`. Prune old entries if needed.
3.  **Client - Display (`lobby.js`, `game.js`):**
    *   `lobby.js`: Update `updateLobbyStatus` to display "Spectating Game: [Game Name]" when spectating starts. Use the game name received in the `spectateStart` event. Modify `addEventLogMessage` to potentially include the game name in game start/over messages.
    *   `game.js`: Consider adding the `gameName` display to the UI during a match or while spectating (e.g., near the stats panel or on the canvas). Retrieve from the data passed to `handleGameStart` or `handleSpectateStart`.