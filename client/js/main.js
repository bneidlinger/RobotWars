// main.js - Core application initialization
console.log('[main.js] Script execution started');

// Declare globals for potential access by other modules or console
window.loadoutBuilderInstance = null;
window.audioManager = null;
window.game = null;
window.network = null;
window.controls = null;
window.authHandler = null;
window.preferenceManager = null;

// Simple error handling
window.onerror = function(message, source, lineno, colno, error) {
    console.error(`Error: ${message} at ${source}:${lineno}`, error);
    return false; // Allow default error handling to continue
};

// Basic diagnostics function
function logAvailableClasses() {
    const classes = ['LoadoutBuilder', 'AudioManager', 'Game', 'Network', 'Controls', 'AuthHandler', 'PreferenceManager'];
    classes.forEach(className => {
        console.log(`Class ${className} is ${typeof window[className] === 'function' ? 'available' : 'NOT available'}`);
    });
}

// Simple initialization with retry mechanism
async function initializeComponents(retryCount = 0) {
    console.log(`[main.js] Initialization attempt ${retryCount + 1}...`);
    
    // Log available classes on first attempt
    if (retryCount === 0) {
        logAvailableClasses();
    }
    
    const MAX_RETRIES = 3;
    const RETRY_DELAY_MS = 500;
    
    // Key classes we MUST have to function
    const requiredClasses = ['LoadoutBuilder', 'AudioManager', 'Game', 'Network', 'Controls'];
    const missingClasses = requiredClasses.filter(cls => typeof window[cls] !== 'function');
    
    // If missing critical classes, retry or fail
    if (missingClasses.length > 0) {
        if (retryCount < MAX_RETRIES) {
            console.warn(`[main.js] Missing required classes: ${missingClasses.join(', ')}. Retrying in ${RETRY_DELAY_MS}ms...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
            return initializeComponents(retryCount + 1);
        } else {
            throw new Error(`[main.js] Failed to initialize after ${MAX_RETRIES} attempts. Missing classes: ${missingClasses.join(', ')}`);
        }
    }
    
    // Initialize components with enhanced error handling
    try {
        console.log("[main.js] All required classes found. Starting initialization...");
        
        // Extra assertions to ensure all required classes are available
        if (typeof LoadoutBuilder !== 'function') throw new Error("LoadoutBuilder class not found");
        if (typeof AudioManager !== 'function') throw new Error("AudioManager class not found");
        if (typeof Game !== 'function') throw new Error("Game class not found");
        if (typeof Network !== 'function') throw new Error("Network class not found");
        if (typeof Controls !== 'function') throw new Error("Controls class not found");
        if (typeof AuthHandler !== 'function') throw new Error("AuthHandler class not found");
        
        // 1. Create PreferenceManager instance if available
        if (typeof PreferenceManager === 'function') {
            try {
                window.preferenceManager = new PreferenceManager();
                console.log('[main.js] PreferenceManager instance created.');
            } catch (prefError) {
                console.warn('[main.js] Error creating PreferenceManager:', prefError);
                // Continue without preferences
            }
        }
        
        // 2. Instantiate LoadoutBuilder - validate it worked
        console.log('[main.js] Creating LoadoutBuilder instance...');
        window.loadoutBuilderInstance = new LoadoutBuilder();
        if (!window.loadoutBuilderInstance.overlayElement) {
            throw new Error("LoadoutBuilder instantiation failed (missing overlayElement). DOM may not be fully loaded.");
        }
        console.log('[main.js] LoadoutBuilder instance created successfully.');

        // 3. Initialize AudioManager - validate it worked
        console.log('[main.js] Creating AudioManager instance...');
        window.audioManager = new AudioManager();
        if (!window.audioManager.musicElement) {
            console.warn('[main.js] AudioManager created but music element reference is missing.');
        }
        console.log('[main.js] AudioManager initialized successfully.');

        // 4. Initialize Game - validate it worked
        console.log('[main.js] Creating Game instance...');
        
        // Make sure 'arena' canvas exists before creating Game
        const arenaCanvas = document.getElementById('arena');
        if (!arenaCanvas) {
            throw new Error("Arena canvas element not found. DOM may not be fully loaded.");
        }
        console.log('[main.js] Arena canvas element found. Creating Game instance...');
        
        window.game = new Game('arena');
        if (!window.game.canvas) {
            throw new Error("Game initialization failed (missing canvas reference).");
        }
        console.log('[main.js] Game instance created successfully.');

        // 5. Initialize Network - validate it worked
        console.log('[main.js] Creating Network instance...');
        window.network = new Network(window.game);
        console.log('[main.js] Network instance created successfully.');
        
        // 6. Initialize Controls - validate it worked
        console.log('[main.js] Creating Controls instance...');
        window.controls = new Controls(window.game, window.network);
        console.log('[main.js] Controls initialized successfully.');
        
        // 7. Initialize AuthHandler LAST (depends on other modules)
        console.log('[main.js] Creating AuthHandler instance...');
        window.authHandler = new AuthHandler();
        if (!window.authHandler) {
            throw new Error("AuthHandler instantiation failed.");
        }
        console.log('[main.js] AuthHandler instance created.');
        
        // Initialize the auth handler and check login state
        try {
            console.log('[main.js] Initializing AuthHandler and checking login state...');
            if (typeof window.authHandler.initialize !== 'function') {
                throw new Error("AuthHandler.initialize is not a function");
            }
            await window.authHandler.initialize(); // This will call checkLoginState internally
            console.log('[main.js] AuthHandler initialized successfully.');
        } catch (authError) {
            console.error('[main.js] AuthHandler initialization failed:', authError);
            // Continue with application initialization even if auth fails
        }
        
        console.log('[main.js] Initialization completed successfully ✓');
        return true;
    } catch (error) {
        console.error('[main.js] CRITICAL ERROR during initialization:', error);
        
        // Show user-friendly error with detailed diagnostic information
        document.body.innerHTML = `
            <div style="padding: 20px; background-color: #1a1a1a; color: #f8d7da; margin: 20px; border-radius: 5px; max-width: 800px; margin: 50px auto; font-family: Arial, sans-serif; border: 1px solid #721c24;">
                <h2 style="color: #dc3545;">Critical Error During Application Initialization</h2>
                <p>The RobotWars application could not start correctly due to a technical issue.</p>
                <p><strong>Error:</strong> ${error.message}</p>
                
                <div style="background-color: #2a2a2a; padding: 15px; border-radius: 5px; margin: 15px 0; font-family: monospace; white-space: pre-wrap;">
                ${error.stack ? error.stack.replace(/\n/g, '<br>') : 'No stack trace available'}
                </div>
                
                <h3 style="color: #dc3545;">Diagnostic Information</h3>
                <p><strong>Missing Classes:</strong> ${requiredClasses.filter(cls => typeof window[cls] !== 'function').join(', ') || 'None'}</p>
                <p><strong>Browser:</strong> ${navigator.userAgent}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                
                <hr style="border-color: #721c24; margin: 20px 0;">
                <div style="display: flex; gap: 10px; justify-content: space-between;">
                    <button onclick="location.reload()" style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer;">Reload Application</button>
                    <button onclick="window.location.href='diagnostic.html'" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">Run Diagnostics</button>
                </div>
            </div>
        `;
        return false;
    }
}

// Debug function to log the availability of important classes and objects
function debugClassAvailability() {
    console.log("=== DEBUG: Class Availability Check ===");
    const classes = [
        'LoadoutBuilder', 'AudioManager', 'Game', 'Network', 'Controls', 
        'AuthHandler', 'Arena', 'Dashboard', 'PreferenceManager'
    ];
    
    classes.forEach(className => {
        console.log(`${className}: ${typeof window[className] === 'function' ? 'AVAILABLE ✓' : 'MISSING ✗'}`);
    });
    
    // Check for canvas element
    const canvas = document.getElementById('arena');
    console.log(`Arena Canvas: ${canvas ? 'FOUND ✓' : 'MISSING ✗'}`);
    
    console.log("=======================================");
}

// Simple initialization with diagnostic checks
document.addEventListener('DOMContentLoaded', () => {
    console.log('[main.js] Document loaded, initializing application');
    
    // Run initial diagnostic check
    debugClassAvailability();
    
    // Add a significant delay to ensure all scripts are fully loaded
    setTimeout(() => {
        // Run another diagnostic right before initialization
        debugClassAvailability();
        
        // Initialize the application
        console.log('[main.js] Starting component initialization...');
        initializeComponents().catch(error => {
            console.error("[main.js] Fatal error during initialization:", error);
            alert("Fatal initialization error: " + error.message);
        });
    }, 1000); // Significantly increased delay for better script loading
});