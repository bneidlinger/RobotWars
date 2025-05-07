// client/js/engine/class-registration.js
// This script registers all class definitions with the script loader

console.log('[class-registration.js] Starting class registration...');

// Register this script with the script loader
if (window.scriptLoader) {
    window.scriptLoader.scriptLoaded('class-registration.js');
}

// Define lists of classes to check and register
const engineClasses = [
    { file: 'audio.js', className: 'AudioManager' },
    { file: 'game.js', className: 'Game' },
    { file: 'arena.js', className: 'Arena' },
    { file: 'interpreter.js', className: 'Interpreter' },
    { file: 'collision.js', className: 'Collision' },
    { file: 'robot.js', className: 'Robot' },
    { file: 'particle-system.js', className: 'ParticleSystem' }
];

const uiClasses = [
    { file: 'loadoutBuilder.js', className: 'LoadoutBuilder' },
    { file: 'controls.js', className: 'Controls' },
    { file: 'dashboard.js', className: 'Dashboard' },
    { file: 'editor.js', className: 'Editor' },
    { file: 'history.js', className: 'History' },
    { file: 'lobby.js', className: 'Lobby' },
    { file: 'testBotSelector.js', className: 'TestBotSelector' }
];

const utilClasses = [
    { file: 'preferences.js', className: 'PreferenceManager' },
    { file: 'storage.js', className: 'StorageManager' }
];

const otherClasses = [
    { file: 'network.js', className: 'Network' },
    { file: 'auth.js', className: 'AuthHandler' }
];

// Register all classes
function registerClasses() {
    // Make sure scriptLoader is available
    if (!window.scriptLoader) {
        console.warn('[class-registration.js] Script loader not available');
        return;
    }

    console.log('[class-registration.js] Registering engine classes...');
    engineClasses.forEach(cls => {
        if (typeof window[cls.className] === 'function') {
            window.scriptLoader.scriptLoaded(cls.file);
            console.log(`[class-registration.js] ✓ Registered engine class: ${cls.className}`);
        } else {
            console.warn(`[class-registration.js] ✗ Engine class not found: ${cls.className}`);
        }
    });

    console.log('[class-registration.js] Registering UI classes...');
    uiClasses.forEach(cls => {
        if (typeof window[cls.className] === 'function') {
            window.scriptLoader.scriptLoaded(cls.file);
            console.log(`[class-registration.js] ✓ Registered UI class: ${cls.className}`);
        } else {
            console.warn(`[class-registration.js] ✗ UI class not found: ${cls.className}`);
        }
    });

    console.log('[class-registration.js] Registering utility classes...');
    utilClasses.forEach(cls => {
        if (typeof window[cls.className] === 'function') {
            window.scriptLoader.scriptLoaded(cls.file);
            console.log(`[class-registration.js] ✓ Registered utility class: ${cls.className}`);
        } else {
            console.warn(`[class-registration.js] ✗ Utility class not found: ${cls.className}`);
        }
    });

    console.log('[class-registration.js] Registering other classes...');
    otherClasses.forEach(cls => {
        if (typeof window[cls.className] === 'function') {
            window.scriptLoader.scriptLoaded(cls.file);
            console.log(`[class-registration.js] ✓ Registered other class: ${cls.className}`);
        } else {
            console.warn(`[class-registration.js] ✗ Other class not found: ${cls.className}`);
        }
    });

    console.log('[class-registration.js] Class registration completed');
}

// Register all critical classes after a short delay to ensure they're loaded
setTimeout(registerClasses, 50);

// Force registration of core classes that must exist
if (window.scriptLoader) {
    window.scriptLoader.scriptLoaded('script-loader.js');
    console.log('[class-registration.js] ✓ Registered script-loader.js');
}