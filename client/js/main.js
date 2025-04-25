// Declare globals for potential access by other modules or console
window.loadoutBuilderInstance = null;
window.audioManager = null;
window.game = null;
window.network = null;
window.controls = null;
window.authHandler = null; // Reference to the auth handler instance

document.addEventListener('DOMContentLoaded', async () => { // Make async
    console.log('[Main.js] Document loaded, initializing game components...');

    try {
        // 1. Instantiate LoadoutBuilder (Assigns to window)
        window.loadoutBuilderInstance = new LoadoutBuilder();
        console.log('[Main.js] LoadoutBuilder instance created.');
        // Basic check if the builder seems okay (e.g., found its overlay)
        if (!window.loadoutBuilderInstance.overlayElement) {
            throw new Error("LoadoutBuilder instantiation failed basic check (missing overlayElement).");
        }

        // 2. Initialize AudioManager (Assigns to window)
        window.audioManager = new AudioManager();
        console.log('[Main.js] AudioManager initialized.');

        // 3. Initialize Game (Assigns to window)
        window.game = new Game('arena');
        console.log('[Main.js] Game instance created.');

        // 4. Initialize Network (Assigns to window)
        window.network = new Network(window.game);
        console.log('[Main.js] Network handler created.');

        // 5. Initialize Controls (Assigns to window)
        // Controls now needs the globally available game and network instances
        window.controls = new Controls(window.game, window.network);
        console.log('[Main.js] Controls handler created.');

        // 6. Initialize AuthHandler (Assigns to window)
        // Assuming AuthHandler class is defined in auth.js
        window.authHandler = new AuthHandler();
        console.log('[Main.js] Auth handler created.');

        // 7. Initialize Auth Flow (critical step AFTER other instances exist)
        // This checks login, sets up UI, and calls _onLoginSuccess or shows modal
        console.log('[Main.js] Initializing auth flow...');
        await window.authHandler.initialize(); // Call the async init method
        console.log('[Main.js] Auth flow initialization complete.');

        // 8. Initial Draw (background is always useful)
        if (window.game && window.game.renderer) {
            window.game.renderer.redrawArenaBackground();
            console.log('[Main.js] Initial arena background drawn.');
        }

        // 9. Initialization Complete
        console.log('[Main.js] Core components initialization complete.');
        console.log('[Main.js] Application ready.');

    } catch (error) {
        console.error("[Main.js] CRITICAL ERROR during initialization:", error);
        // Display a user-friendly error message covering the whole page
        document.body.innerHTML = `<div style="padding: 20px; background-color: #330000; border: 2px solid red; color: white; font-family: monospace; text-align: center;">
            <h2>Critical Error During Initialization</h2>
            <p>The application could not start correctly.</p>
            <p><strong>Error:</strong> ${error.message}</p>
            <p>Please check the browser console (F12) for more details or try refreshing the page.</p>
        </div>`;
        // alert("Failed to initialize the game client. Check the console for details."); // Alert might be annoying
    }
});