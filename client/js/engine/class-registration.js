// client/js/engine/class-registration.js
// This file registers all classes with the script loader to ensure they're properly tracked

// Wait for script loader to be available
(function() {
    function registerClasses() {
        if (!window.scriptLoader) {
            console.warn('[class-registration] Script loader not available, retrying in 100ms...');
            setTimeout(registerClasses, 100);
            return;
        }

        // Register all core classes with the script loader
        const engineClasses = [
            { file: 'audio.js', constructor: 'AudioManager' },
            { file: 'game.js', constructor: 'Game' },
            { file: 'arena.js', constructor: 'Arena' },
            { file: 'interpreter.js', constructor: 'Interpreter' },
            { file: 'collision.js', constructor: 'Collision' },
            { file: 'robot.js', constructor: 'Robot' },
            { file: 'particle-system.js', constructor: 'ParticleSystem' }
        ];

        const uiClasses = [
            { file: 'loadoutBuilder.js', constructor: 'LoadoutBuilder' },
            { file: 'controls.js', constructor: 'Controls' },
            { file: 'dashboard.js', constructor: 'Dashboard' },
            { file: 'editor.js', constructor: 'Editor' },
            { file: 'history.js', constructor: 'History' },
            { file: 'lobby.js', constructor: 'Lobby' },
            { file: 'testBotSelector.js', constructor: 'TestBotSelector' }
        ];

        const utilClasses = [
            { file: 'preferences.js', constructor: 'PreferenceManager' },
            { file: 'storage.js', constructor: 'StorageManager' }
        ];

        const otherClasses = [
            { file: 'network.js', constructor: 'Network' },
            { file: 'auth.js', constructor: 'AuthHandler' }
        ];

        // Register engine classes
        engineClasses.forEach(cls => {
            if (typeof window[cls.constructor] === 'function') {
                window.scriptLoader.scriptLoaded(cls.file);
                console.log(`[class-registration] Registered engine class: ${cls.constructor} (${cls.file})`);
            } else {
                console.warn(`[class-registration] Engine class not found: ${cls.constructor} (${cls.file})`);
            }
        });

        // Register UI classes
        uiClasses.forEach(cls => {
            if (typeof window[cls.constructor] === 'function') {
                window.scriptLoader.scriptLoaded(cls.file);
                console.log(`[class-registration] Registered UI class: ${cls.constructor} (${cls.file})`);
            } else {
                console.warn(`[class-registration] UI class not found: ${cls.constructor} (${cls.file})`);
            }
        });

        // Register utility classes
        utilClasses.forEach(cls => {
            if (typeof window[cls.constructor] === 'function') {
                window.scriptLoader.scriptLoaded(cls.file);
                console.log(`[class-registration] Registered utility class: ${cls.constructor} (${cls.file})`);
            } else {
                console.warn(`[class-registration] Utility class not found: ${cls.constructor} (${cls.file})`);
            }
        });

        // Register other classes
        otherClasses.forEach(cls => {
            if (typeof window[cls.constructor] === 'function') {
                window.scriptLoader.scriptLoaded(cls.file);
                console.log(`[class-registration] Registered other class: ${cls.constructor} (${cls.file})`);
            } else {
                console.warn(`[class-registration] Other class not found: ${cls.constructor} (${cls.file})`);
            }
        });

        console.log('[class-registration] All class registrations processed');
    }

    // Start registration process - delay slightly to ensure all scripts have a chance to load
    setTimeout(registerClasses, 200);
})();