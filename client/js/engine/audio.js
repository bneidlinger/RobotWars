// client/js/engine/audio.js

/**
 * Simple Audio Manager for loading and playing sound effects.
 */
class AudioManager {
    constructor() {
        console.log("AudioManager: CONSTRUCTOR called.");
        this.sounds = {}; // Stores { soundName: AudioObject }
        this.soundSources = {
            // --- Define sound names and their file paths ---
            // --- IMPORTANT: Replace with your actual filenames ---
            'fire': 'assets/sounds/fire.mp3',
            'hit': 'assets/sounds/hit.mp3',
            'explode': 'assets/sounds/explode.mp3',
            // Add more sounds here as needed
        };
        this.loadSounds();
    }

    /**
     * Preloads all defined sound effects.
     */
    loadSounds() {
        console.log("AudioManager: loadSounds() method ENTERED.");
        console.log("AudioManager: Loading sounds...");
        let soundsLoaded = 0;
        let soundsErrored = 0;
        const totalSounds = Object.keys(this.soundSources).length;

        if (totalSounds === 0) {
            console.log("AudioManager: No sound sources defined.");
            return;
        }

        for (const soundName in this.soundSources) {
            const src = this.soundSources[soundName];
            this.sounds[soundName] = new Audio();

            // Event listener for successful loading
            this.sounds[soundName].addEventListener('canplaythrough', () => {
                soundsLoaded++;
                // console.log(`AudioManager: Sound '${soundName}' loaded.`); // Optional log per sound
                if (soundsLoaded + soundsErrored === totalSounds) {
                    console.log(`AudioManager: Loading complete (${soundsLoaded} loaded, ${soundsErrored} errors).`);
                }
            }, { once: true }); // Use 'once' to avoid multiple logs if event fires again

            // Event listener for errors
            this.sounds[soundName].addEventListener('error', (e) => {
                soundsErrored++;
                console.error(`AudioManager: Error loading sound '${soundName}' from ${src}:`, e);
                delete this.sounds[soundName]; // Remove broken sound
                if (soundsLoaded + soundsErrored === totalSounds) {
                    console.log(`AudioManager: Loading complete (${soundsLoaded} loaded, ${soundsErrored} errors).`);
                }
            }, { once: true });

            this.sounds[soundName].src = src;
            this.sounds[soundName].load(); // Start loading
        }
    }

    /**
     * Plays a preloaded sound effect.
     * @param {string} soundName - The name of the sound to play (must match keys in soundSources).
     */
    playSound(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            // Reset playback to the start in case it's already playing (allows overlapping sounds)
            sound.currentTime = 0;
            sound.play().catch(error => {
                // Autoplay restrictions might prevent playing without user interaction first.
                // This usually resolves after the first click anywhere on the page.
                if (error.name === 'NotAllowedError') {
                    console.warn(`AudioManager: Playback of '${soundName}' prevented by browser policy. Needs user interaction first.`);
                } else {
                    console.error(`AudioManager: Error playing sound '${soundName}':`, error);
                }
            });
        } else {
            console.warn(`AudioManager: Sound '${soundName}' not found or not loaded.`);
        }
    }
}

// Note: Instantiation happens in main.js after DOMContentLoaded