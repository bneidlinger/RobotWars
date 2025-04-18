# Robot Wars Online - Project Status & Next Steps Plan

## Summary of Accomplishments (Phase 1 Complete)

*   **Client-Server Architecture:** Successfully migrated the local game prototype to a robust client-server model using Node.js, Express, and Socket.IO.
*   **Authoritative Server:** Implemented an authoritative server architecture where the server handles all core game simulation logic (AI execution via sandboxed `vm`, movement, physics, collisions) ensuring fairness and preventing cheating.
*   **Real-time Communication:** Established bidirectional real-time communication using Socket.IO for player connections, data submission, and game state synchronization.
*   **Game Management:** Created a basic `GameManager` on the server to handle player connections, store pending players, and instantiate `GameInstance` objects for matches (currently auto-starting when 2 players submit code).
*   **State Synchronization:** The server regularly broadcasts the authoritative `gameState` (robot positions, health, missiles, appearance, explosions) to clients in the correct game room.
*   **Client Refactoring:** The client (`game.js`, `arena.js`) now focuses primarily on rendering the game state received from the server, rather than running its own simulation.
*   **Visual Enhancements:** Added multiple selectable robot appearances, rendered using the Canvas API based on server state, and included a textured arena background.
*   **Deployment:** Successfully deployed the application to **Render** (`https://robotwars-c198.onrender.com`), allowing for live online testing.
*   **Debugging:** Added server-side logging to investigate coordinate clamping.

## Current Issue Under Investigation

*   **Problem:** Robots visually drive off the **right edge** of the game arena on the client, despite server logs indicating their X-coordinates are being correctly clamped to the maximum boundary (`585 = 600 - 15`). The top, bottom, and left boundaries appear to be respected correctly.
*   **Key Observation:** The browser's developer tools (Elements tab) consistently show the live deployed `<canvas id="arena">` element having `width="550"` and `height="600"`.
*   **Contradiction:** The committed `client/index.html` file explicitly sets `<canvas id="arena" width="600" height="600">`. Even after replacing the entire file content and re-pushing/re-deploying, the browser inspector on the live site still reports `width="550"`.
*   **Status:** The server-side coordinate logic seems correct based on logs. The issue appears to be a discrepancy between the intended HTML width attribute and what the browser actually renders on the live deployment, causing a mismatch between the server's coordinate space (0-600) and the client's drawing surface width (0-550). Potential causes under consideration: incorrect file version actually being served by Render despite Git state, aggressive browser/CDN caching, or an unknown client-side factor modifying the dimension.

## Next Steps Plan (Phase 2 - Lobby, Chat & UX Improvements)

**Priority 1: Resolve Canvas Width Issue**

1.  **Verify Deployed File:** Double-check the content of `client/index.html` directly on GitHub *after* the last push to ensure `width="600"` is definitely there.
2.  **Clear Cache Vigorously:** Perform hard refreshes (Ctrl+Shift+R / Cmd+Shift+R) and potentially clear all browser cache/site data for the Render URL. Test in an incognito/private window or a different browser.
3.  **Render Support/Rebuild:** If the issue persists, consider triggering a manual rebuild/deploy on Render or exploring Render's cache settings (if any). As a last resort, contact Render support or check their community forums for similar static file issues.
4.  **Client-Side JS Check (Low Probability):** Briefly review client-side JS (`arena.js` constructor, `main.js`) one last time to ensure nothing could possibly be overwriting the canvas width *after* the HTML attribute is set.

**Priority 2: Implement Lobby Enhancements & Player Names**

1.  **Player Name Input & Handling:**
    *   **UI:** Add `<input type="text" id="playerName" placeholder="Enter your name">` before the appearance selector in `index.html`.
    *   **Client (`controls.js`, `network.js`):** Modify `submitPlayerData` / `sendCodeAndAppearance` to read the value from `#playerName` and send it as part of the data payload (e.g., `{ code: ..., appearance: ..., name: playerName }`).
    *   **Server (`GameManager`, `GameInstance`):** Update `pendingPlayers` and the `players` map in `GameInstance` to store the received `name`. Add the name to the robot data structure.
    *   **Server (`GameInstance`):** Include `name` in the robot objects within the broadcasted `gameState`.
    *   **Client (`arena.js`, `dashboard.js`):** Modify drawing logic to display `robotData.name` near the robot and in the stats panel.

2.  **Global Event Log & Lobby Status:**
    *   **UI (`index.html`):** Add a display area: `<div id="event-log" style="height: 100px; overflow-y: scroll; border: 1px solid #555; margin-top: 10px; padding: 5px; background: #222;">Event Log Loading...</div>`. Add a simple status indicator: `<div id="lobby-status">Connecting...</div>`.
    *   **Client (JS):** Create `function addEventLogMessage(message)` to append messages to `#event-log` (keeping maybe the last 20-30 lines). Create `function updateLobbyStatus(statusText)` to update `#lobby-status`.
    *   **Server (`GameManager`, `SocketHandler`):**
        *   On player connect: `io.emit('lobbyEvent', { message: `Player ${socket.id.substring(0, 4)}... connected.` });` (Update later with name).
        *   On player disconnect: `io.emit('lobbyEvent', { message: `Player ${playerName || socket.id.substring(0, 4)}... disconnected.` });`
        *   On receiving player data (name/ready): `io.emit('lobbyEvent', { message: `Player ${playerName} is ready!` });` (or similar).
        *   On game start: `io.emit('lobbyEvent', { message: `Game starting between ${player1Name} and ${player2Name}!` });`
        *   On game over: `io.emit('lobbyEvent', { message: `Game over! Winner: ${winnerName}` });`
        *   Periodically or on change: `io.emit('lobbyStatusUpdate', { waiting: pendingPlayers.size });` (Expand later with ready count).
    *   **Client (`network.js`):** Add listeners for `lobbyEvent` (call `addEventLogMessage`) and `lobbyStatusUpdate` (call `updateLobbyStatus`).

3.  **Explicit "Ready" System:**
    *   **UI (`index.html`):** Change button text `id="btn-run"` from "Run Simulation" to "Ready Up". Consider adding an "Unready" button or making "Ready Up" a toggle.
    *   **Server (`GameManager`):** Add `isReady: false` to the initial player data in `pendingPlayers`.
    *   **Client (`controls.js`, `network.js`):** When "Ready Up" is clicked, send player data as before, but also implicitly signal readiness. Add logic for an "Unready" action if implemented (sending a specific event like `playerUnready`). Update button state (disable/enable, change text to "Waiting..." or "Unready").
    *   **Server (`socket-handler.js`):** Listen for the player data submission. In `GameManager.handlePlayerCode`, store the data and explicitly set `playerData.isReady = true`. Add a handler for `playerUnready` to set `isReady = false`.
    *   **Server (`GameManager`):** After setting a player to `isReady = true` (or handling `playerUnready`), run a new function `tryStartMatch()`:
        *   Filter `pendingPlayers` to find all players with `isReady === true`.
        *   If count >= 2: Select the first two, call `createGame(selectedPlayers)`, remove them from `pendingPlayers`, emit lobby updates.
        *   If count < 2: Do nothing, players remain pending but ready.
    *   **Client (`game.js`):** Ensure `handleGameStart` correctly resets UI (like disabling the Ready/Unready buttons). `handleGameOver` should re-enable them.

**Priority 3: Basic Lobby Chat**

1.  **UI (`index.html`):** Add `<input type="text" id="chat-input" placeholder="Enter chat message...">` and `<button id="send-chat">Send</button>`.
2.  **Client (`controls.js`):** Add event listener to `#send-chat` button and potentially Enter key on `#chat-input`. When triggered, get message text, clear input, and call `network.sendChatMessage(messageText)`.
3.  **Client (`network.js`):** Create `sendChatMessage(text)` function: `if (text.trim()) { socket.emit('chatMessage', { text: text.trim() }); }`.
4.  **Server (`socket-handler.js`):**
    *   Listen for `chatMessage`: `socket.on('chatMessage', (data) => { ... });`
    *   Inside handler: Get sender's name from `GameManager` based on `socket.id`. Perform basic validation/sanitization on `data.text`.
    *   Broadcast to all: `io.emit('chatUpdate', { sender: playerName || 'Anon', text: sanitizedText });`
5.  **Client (`network.js`):** Add listener for `chatUpdate`. Call `addEventLogMessage(\`${data.sender}: ${data.text}\`)` (or format differently).

This provides a solid roadmap for when you return. Good luck with the break!