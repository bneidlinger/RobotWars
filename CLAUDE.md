# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- Install dependencies: `npm install`
- Start server: `npm start`
- Access app at: http://localhost:3000

## Code Style Guidelines
- Use ES6 JavaScript syntax with CommonJS modules (require/module.exports)
- Class-based OOP with properly named methods and properties
- Follow existing indentation (4 spaces) and formatting patterns
- Group related functionality with clear section comments (// --- Section Name ---)
- Error handling: Check for environment variables, log errors appropriately
- Descriptive variable names (camelCase for variables, functions, and methods)
- Use constants for magic numbers and configuration values

## Project Structure
- `/client` - Frontend assets (JS, CSS, images, HTML)
- `/server` - Backend Node.js/Express code, Socket.IO handlers
- Main components: Robot, Game, Arena, Interpreter

## Naming Conventions
- Classes: PascalCase (Robot, Missile, GameManager)
- Variables/functions: camelCase (scanResult, generateColor)
- Constants: UPPER_CASE or camelCase for imported modules
- File names: kebab-case (game-manager.js) or camelCase (socketHandler.js)