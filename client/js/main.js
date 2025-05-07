// Declare globals for potential access by other modules or console
window.loadoutBuilderInstance = null;
window.audioManager = null;
window.game = null;
window.network = null;
window.controls = null;
window.authHandler = null; // Reference to the auth handler instance

// Initialization function with retry mechanism
async function initializeComponents(retryCount = 0) {
    console.log(`[Main.js] Initialization attempt ${retryCount + 1}...`);
    
    const MAX_RETRIES = 3;
    const requiredClasses = ['LoadoutBuilder', 'AudioManager', 'Game', 'Network'];
    const missingClasses = [];
    
    // Check which required classes are available
    for (const className of requiredClasses) {
        if (typeof window[className] !== 'function') {
            missingClasses.push(className);
        }
    }
    
    // If we're missing classes and have retries left, wait and try again
    if (missingClasses.length > 0) {
        if (retryCount < MAX_RETRIES) {
            console.warn(`[Main.js] Missing required classes: ${missingClasses.join(', ')}. Retrying in 200ms...`);
            await new Promise(resolve => setTimeout(resolve, 200));
            return initializeComponents(retryCount + 1);
        } else {
            throw new Error(`[Main.js] Failed to initialize after ${MAX_RETRIES} attempts. Missing classes: ${missingClasses.join(', ')}`);
        }
    }
    
    // Initialize components in order with proper error handling
    try {
        // 1. Create PreferenceManager instance if available
        if (typeof PreferenceManager === 'function' && !window.preferenceManager) {
            try {
                window.preferenceManager = new PreferenceManager();
                console.log('[Main.js] PreferenceManager instance created.');
            } catch (prefError) {
                console.warn('[Main.js] Error creating PreferenceManager:', prefError);
                // Continue without preferences
            }
        }
        
        // 2. Instantiate LoadoutBuilder
        window.loadoutBuilderInstance = new LoadoutBuilder();
        if (!window.loadoutBuilderInstance.overlayElement) {
            throw new Error("LoadoutBuilder instantiation failed (missing overlayElement).");
        }
        console.log('[Main.js] LoadoutBuilder instance created.');

        // 3. Initialize AudioManager
        window.audioManager = new AudioManager();
        console.log('[Main.js] AudioManager initialized.');

        // 4. Initialize Game
        window.game = new Game('arena');
        console.log('[Main.js] Game instance created.');

        // 5. Initialize Network
        window.network = new Network(window.game);
        console.log('[Main.js] Network instance created.');
        
        // 6. Initialize Controls
        window.controls = new Controls(window.game, window.network);
        console.log('[Main.js] Controls initialized.');
        
        // --- Initialize Authentication Module LAST (depends on other modules) ---
        window.authHandler = new AuthHandler();
        console.log('[Main.js] AuthHandler initialized.');
        window.authHandler.checkLoginState(); // Check initial login state
        
        return true; // Successfully initialized
    } catch (error) {
        console.error('[Main.js] CRITICAL ERROR during initialization:', error);
        document.body.innerHTML = `
            <div style="padding: 20px; background-color: #f8d7da; color: #721c24; margin: 20px; border-radius: 5px; max-width: 600px; margin: 50px auto; font-family: Arial, sans-serif;">
                <h2>Critical Error During Initialization</h2>
                <p>The application could not start correctly.</p>
                <p><strong>Error:</strong> ${error.message}</p>
                <p>Please check the browser console (F12) for more details or try refreshing the page.</p>
            </div>
        `;
        return false; // Failed to initialize
    }
}

// Main initialization on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[Main.js] Document loaded, attempting to initialize game components...');
    await initializeComponents();
});