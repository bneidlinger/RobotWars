# 🤖 ROBOT WARS 🤖

A modern, web-based reincarnation of the classic CROBOTS game where you battle with JavaScript instead of bullets.

**[🔥 PLAY NOW ON GITHUB PAGES 🔥](https://bneidlinger.github.io/RobotWars)**

![Robot Wars Game Screenshot](assets/images/screenshot.jpg)

## Overview

Robot Wars is a programming game where players write JavaScript code to control robot avatars in a virtual arena. Your code controls your robot's movement, scanning, and weapons as it battles other player-controlled robots in real-time.

## Features

- 🎮 In-browser JavaScript coding environment
- 🔄 Real-time multiplayer battles
- 🎨 Multiple robot appearance options
- 📊 Live battle statistics
- 🌐 WebSocket-based communication
- 🛡️ Secure sandboxed code execution

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/bneidlinger/RobotWars.git
cd RobotWars
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser to `http://localhost:3000`

Alternatively, you can access the latest version directly at:
- GitHub Pages: https://bneidlinger.github.io/RobotWars
- Render Deployment: https://robotwars-c198.onrender.com

## How to Play

1. **Write Your Robot AI**: Use the in-browser code editor to program your robot's behavior
2. **Choose Appearance**: Select from different robot designs  
3. **Battle**: Click "Run Simulation" to join a match against other players
4. **Analyze**: Study the results and refine your strategy

## Robot API

Your code can use these methods to control your robot:

```javascript
robot.drive(direction, speed); // Move in a direction (0-359 degrees) at speed (-5 to 5)
robot.scan(direction, resolution); // Scan for enemies in an arc
robot.fire(direction, power); // Fire a missile (power 1-3)
robot.damage(); // Get current damage level (0-100)
```

State is preserved between ticks with the `state` object:

```javascript
// Initialize state variables
if (typeof state.counter === 'undefined') {
    state.counter = 0;
    state.lastDirection = 0;
}
// Use and modify state
state.counter++;
```

## Project Structure

```
/robot-wars/
├── client/           # Frontend assets and code
│   ├── assets/       # Images and resources
│   ├── css/          # Styling
│   ├── js/           # Client-side logic
│   └── index.html    # Main HTML file
└── server/           # Backend Node.js code
    ├── game-*.js     # Game logic
    ├── server-*.js   # Server-side components
    └── index.js      # Entry point
```

## Technologies

- **Frontend**: HTML5 Canvas, JavaScript, Socket.IO client
- **Backend**: Node.js, Express, Socket.IO
- **Code Execution**: Node.js VM for sandboxed evaluation

## Inspirations

This project is inspired by the original [CROBOTS](https://github.com/tpoindex/crobots) game, where players programmed virtual robots in a simplified C language.

## License

[ISC License](LICENSE)

## Links

- [Play Now on GitHub Pages](https://bneidlinger.github.io/RobotWars)
- [Play on Render](https://robotwars-c198.onrender.com) (Always up-to-date with latest features)
- [View Demo Video](https://youtube.com/...)
- [Leave Feedback](https://github.com/bneidlinger/RobotWars/issues)

---

*"In the arena of code, only the clever survive."*