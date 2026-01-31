# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- Install dependencies: `npm install`
- Start server: `npm start`
- Access app at: http://localhost:3000

## Environment Setup
Requires a `.env` file with:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Secret key for session management
- `NODE_ENV` - Set to `production` for production mode

## Architecture Overview

### Server-Side (Node.js/Express + Socket.IO)
The server uses an authoritative game model where all game logic runs server-side:

- **index.js** - Express server entry point, configures session middleware (PostgreSQL-backed via `connect-pg-simple`), mounts API routes, initializes Socket.IO
- **socket-handler.js** - Handles WebSocket connections, validates sessions, routes events to GameManager
- **game-manager.js** - Orchestrates matchmaking, manages pending players, creates/destroys GameInstance objects, handles lobby state and game history
- **game-instance.js** - Runs a single match: game loop (30 tick/sec), manages robots/missiles, broadcasts state updates to participants and spectators
- **server-robot.js** - Server-side robot state (position, damage, missiles, visuals)
- **server-interpreter.js** - Executes player robot AI code in a sandboxed VM (vm2) with timeouts and memory limits
- **server-collision.js** - Collision detection between robots, missiles, and arena boundaries
- **stats-manager.js** - Tracks player statistics and leaderboard data

### Client-Side (Vanilla JS + HTML5 Canvas)
- **main.js** - Application bootstrap, initializes all managers/controllers
- **network.js** - Socket.IO client, handles all server communication
- **auth.js** - Authentication UI and session management
- **engine/** - Game rendering: `game.js` (main loop), `arena.js` (canvas rendering), `robot.js` (robot drawing), `particle-system.js` (visual effects)
- **ui/** - UI components: `controls.js`, `dashboard.js`, `editor.js` (CodeMirror), `loadoutBuilder.js`, `lobby.js`, `leaderboard.js`

### Data Flow
1. Player authenticates via REST API (`/api/auth/*`)
2. Socket connection established with session cookie
3. Player submits loadout (name, visuals, code) via `submitPlayerData` event
4. GameManager queues player, starts match when 2+ ready
5. GameInstance runs 30Hz game loop, executes AI code, broadcasts `gameStateUpdate`
6. Client renders state, sends `selfDestruct`/`chatMessage` events as needed

### Database (PostgreSQL)
Tables: `users`, `session`, `loadouts`, `code_snippets`, `user_preferences`, `player_stats`
Schema scripts in `server/db-scripts/`

## API Routes
- `/api/auth` - Registration, login, logout, session check
- `/api/loadouts` - CRUD for saved robot loadouts
- `/api/snippets` - CRUD for code snippets
- `/api/preferences` - User preferences storage
- `/api/leaderboard` - Public leaderboard data

## Robot API (Available in Player Code)
```javascript
robot.drive(direction, speed);  // 0-359 degrees, -5 to 5 speed
robot.scan(direction, resolution);  // Returns {distance, direction, id, name} or null
robot.fire(direction, power);  // Power 1-3, triggers cooldown
robot.damage();  // Current damage 0-100
robot.getX(); robot.getY(); robot.getDirection();
state.variableName;  // Persistent state between ticks
console.log(message);  // Output to robot console
```

## Code Style Guidelines
- ES6 JavaScript with CommonJS modules (require/module.exports)
- 4-space indentation
- Class-based OOP with PascalCase class names
- camelCase for variables, functions, methods
- Group related code with `// --- Section Name ---` comments

## Key Constants
- Arena: 900x900 pixels
- Tick rate: 30 Hz
- Robot radius: 15 pixels
- Scan range: 800 pixels
- Destruction visual delay: 1500ms
