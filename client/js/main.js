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

// Enhanced error handling and reporting
window.onerror = function(message, source, lineno, colno, error) {
    console.error(`[GLOBAL ERROR] ${message} at ${source}:${lineno}:${colno}`, error);
    // Log major errors but don't show alert - let the initialization error handler show UI errors
    return false; // Allow default error handling to continue
};

// Enhanced diagnostics for script loading
function performDiagnostics() {
    console.log('\n[DIAGNOSTICS] ===========================================');
    
    // Check script loader
    if (!window.scriptLoader) {
        console.error('[DIAGNOSTICS] Script loader not available. Critical failure.');
        return false;
    }
    
    // Log loaded scripts
    const loadedScripts = window.scriptLoader.listLoadedScripts();
    console.log(`[DIAGNOSTICS] Loaded scripts (${loadedScripts.length}): ${loadedScripts.join(', ')}`);
    
    // Check required constructor classes
    const requiredClasses = ['LoadoutBuilder', 'AudioManager', 'Game', 'Network', 'Controls', 'AuthHandler', 'PreferenceManager'];
    const missingClasses = [];
    
    requiredClasses.forEach(className => {
        const isAvailable = typeof window[className] === 'function';
        console.log(`[DIAGNOSTICS] Class '${className}' is ${isAvailable ? 'AVAILABLE ✓' : 'MISSING ✗'}`);
        if (!isAvailable) missingClasses.push(className);
    });
    
    // Check DOM elements needed by components
    const criticalElements = [
        { name: 'loadout-builder-overlay', element: document.getElementById('loadout-builder-overlay') },
        { name: 'arena', element: document.getElementById('arena') },
        { name: 'background-music', element: document.getElementById('background-music') }
    ];
    
    criticalElements.forEach(item => {
        console.log(`[DIAGNOSTICS] DOM element '${item.name}' is ${item.element ? 'FOUND ✓' : 'MISSING ✗'}`);
    });
    
    console.log('[DIAGNOSTICS] ===========================================\n');
    
    return missingClasses.length === 0;
}

// Enhanced initialization with retry mechanism
async function initializeComponents(retryCount = 0) {
    console.log(`[main.js] Initialization attempt ${retryCount + 1}...`);
    
    // Run full diagnostics on first attempt
    if (retryCount === 0) {
        performDiagnostics();
    }
    
    const MAX_RETRIES = 3;
    const RETRY_DELAY_MS = 800; // Longer delay between retries
    
    // Key classes we MUST have to function
    const requiredClasses = ['LoadoutBuilder', 'AudioManager', 'Game', 'Network', 'Controls'];
    const missingClasses = requiredClasses.filter(cls => typeof window[cls] !== 'function');
    
    // If missing critical classes, retry or fail
    if (missingClasses.length > 0) {
        if (retryCount < MAX_RETRIES) {
            console.warn(`[main.js] Missing required classes: ${missingClasses.join(', ')}. Retrying in ${RETRY_DELAY_MS}ms...`);
            
            // Force registration of missing classes if class-registration.js exists
            if (window.scriptLoader && window.scriptLoader.isScriptLoaded('class-registration.js')) {
                console.log('[main.js] Attempting to re-run class registration...');
                const script = document.createElement('script');
                script.src = 'js/engine/class-registration.js?nocache=' + new Date().getTime();
                document.head.appendChild(script);
            }
            
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
            return initializeComponents(retryCount + 1);
        } else {
            throw new Error(`[main.js] Failed to initialize after ${MAX_RETRIES} attempts. Missing classes: ${missingClasses.join(', ')}`);
        }
    }
    
    // Initialize components with enhanced error handling
    try {
        console.log("[main.js] All required classes found. Starting initialization...");
        
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
        console.log('[main.js] AuthHandler initialized successfully.');
        
        // Check login state after everything is initialized
        console.log('[main.js] Checking initial login state...');
        window.authHandler.checkLoginState();
        
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

// Enhanced script loading check
function waitForScriptsAndInitialize() {
    console.log('[main.js] Checking critical scripts availability...');
    
    if (!window.scriptLoader) {
        console.error('[main.js] Script loader not available. Attempting direct initialization after delay...');
        setTimeout(() => initializeComponents(), 1000);
        return;
    }
    
    // Check for critical scripts
    const criticalScripts = [
        'script-loader.js',
        'loadoutBuilder.js', 
        'audio.js',
        'game.js',
        'network.js',
        'class-registration.js'
    ];
    
    const checkResult = window.scriptLoader.areAllScriptsLoaded(criticalScripts);
    
    if (checkResult.loaded) {
        console.log("[main.js] All critical scripts loaded ✓ Proceeding with initialization");
        initializeComponents();
    } else {
        console.warn(`[main.js] Still waiting for scripts: ${checkResult.missing.join(', ')}`);
        
        // If class-registration.js is missing, that's especially problematic
        if (checkResult.missing.includes('class-registration.js')) {
            console.error('[main.js] Critical class-registration.js script is missing');
        }
        
        // Retry with a slightly longer delay
        setTimeout(waitForScriptsAndInitialize, 600);
    }
}

// Ensure the DOM is fully loaded before starting initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('[main.js] Document loaded, beginning initialization sequence');
    
    // Adding a longer delay before initialization to ensure all scripts have loaded
    // This is especially important for the class-registration.js which needs to run
    setTimeout(() => {
        waitForScriptsAndInitialize();
    }, 500);
});