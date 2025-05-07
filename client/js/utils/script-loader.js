// Script loader and debugger utility

// Class to manage and debug script loading
class ScriptLoader {
    constructor() {
        this.loadedScripts = {};
    }

    // Register that a script has been loaded
    scriptLoaded(scriptName) {
        this.loadedScripts[scriptName] = true;
        console.log(`[ScriptLoader] Script loaded: ${scriptName}`);
    }

    // Check if a script has been loaded
    isScriptLoaded(scriptName) {
        return !!this.loadedScripts[scriptName];
    }

    // List all loaded scripts
    listLoadedScripts() {
        return Object.keys(this.loadedScripts);
    }

    // Check if all required scripts are loaded
    areAllScriptsLoaded(requiredScripts) {
        const missing = [];
        for (const script of requiredScripts) {
            if (!this.isScriptLoaded(script)) {
                missing.push(script);
            }
        }
        return {
            loaded: missing.length === 0,
            missing
        };
    }

    // Load a script dynamically
    loadScript(src, scriptName) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                this.scriptLoaded(scriptName);
                resolve();
            };
            script.onerror = (err) => {
                console.error(`[ScriptLoader] Failed to load ${scriptName} from ${src}`, err);
                reject(err);
            };
            document.head.appendChild(script);
        });
    }
}

// Create and expose the script loader instance
window.scriptLoader = new ScriptLoader();

// Register that this script itself has loaded
window.scriptLoader.scriptLoaded('script-loader.js');

// Log that we're ready
console.log('[ScriptLoader] Script loader utility initialized');