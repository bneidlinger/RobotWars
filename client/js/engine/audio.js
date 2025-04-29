// client/js/engine/audio.js

/**
 * Manages audio playback for sound effects and background music.
 * Includes volume control specifically for background music.
 */
class AudioManager {
    constructor() {
        console.log("AudioManager: CONSTRUCTOR called.");
        this.sounds = {};
        this.soundEffectsMuted = false; // For sound effects only
        this.soundEffectFiles = {
            fire: '/assets/sounds/fire.mp3',
            explosion: '/assets/sounds/explode.mp3',
            hit: '/assets/sounds/hit.mp3'
        };

        // --- NEW: Background Music Elements & State ---
        this.backgroundMusicElement = document.getElementById('background-music');
        this.volumeToggleButton = document.getElementById('btn-toggle-volume');
        this.isMusicMuted = false; // start playing by default
        this.musicStarted = false; // Flag to prevent multiple start attempts
        this.musicVolumeKey = 'robotWarsMusicMuted'; // localStorage key

        if (!this.backgroundMusicElement) {
            console.error("AudioManager: Background music element '#background-music' not found!");
        }
        if (!this.volumeToggleButton) {
            console.warn("AudioManager: Volume toggle button '#btn-toggle-volume' not found!");
        }
        // --- END NEW ---

        this.loadSounds();

        // --- Load music mute preference and apply initial state ---
        this.loadMusicMutePreference();
        this.applyMusicState(); // Apply loaded state to element and button
        this._setupVolumeButtonListener(); // Setup listener for the button
        // --- End ---
    }

    loadSounds() {
        console.log("AudioManager: loadSounds() method ENTERED.");
        console.log("AudioManager: Loading sounds...");
        let soundsLoaded = 0;
        let soundsErrored = 0;
        const totalSounds = Object.keys(this.soundEffectFiles).length;

        if (totalSounds === 0) {
            console.log("AudioManager: No sound effect files defined.");
            return;
        }

        Object.entries(this.soundEffectFiles).forEach(([name, src]) => {
            const audio = new Audio();
            audio.oncanplaythrough = () => {
                soundsLoaded++;
                console.log(`AudioManager: Sound '${name}' loaded successfully.`);
                if (soundsLoaded + soundsErrored === totalSounds) {
                    console.log(`AudioManager: Loading complete (${soundsLoaded} loaded, ${soundsErrored} errors).`);
                }
            };
            audio.onerror = () => {
                soundsErrored++;
                console.error(`AudioManager: Error loading sound '${name}' from ${src}`);
                if (soundsLoaded + soundsErrored === totalSounds) {
                    console.log(`AudioManager: Loading complete (${soundsLoaded} loaded, ${soundsErrored} errors).`);
                }
            };
            audio.src = src;
            this.sounds[name] = audio;
        });
    }

    playSound(name) {
        if (this.soundEffectsMuted) return; // Only check effect mute status

        if (this.sounds[name]) {
            // Attempt to play, handle potential interruption errors
            this.sounds[name].currentTime = 0; // Rewind before playing
            this.sounds[name].play().catch(error => {
                // Common error: Play request interrupted by another play request
                if (error.name !== 'AbortError') {
                    console.warn(`AudioManager: Error playing sound '${name}':`, error);
                }
            });
        } else {
            console.warn(`AudioManager: Sound effect '${name}' not found.`);
        }
    }

    // Renamed to clarify it only mutes effects now
    toggleEffectsMute() {
        this.soundEffectsMuted = !this.soundEffectsMuted;
        console.log(`AudioManager: Sound effects ${this.soundEffectsMuted ? 'muted' : 'unmuted'}.`);
        // Optionally, update a different UI element if you add a separate effects mute button
    }

    // --- START: New Background Music Methods ---

    /** Sets up the event listener for the volume toggle button */
    _setupVolumeButtonListener() {
        if (this.volumeToggleButton) {
            this.volumeToggleButton.addEventListener('click', () => {
                this.toggleMusicMute();
            });
        }
    }

    /** Attempts to start background music playback (needs user interaction context) */
    requestMusicStart() {
        if (!this.backgroundMusicElement || this.musicStarted) {
            return; // Don't try if element missing or already started
        }

        console.log("AudioManager: Attempting to start background music...");
        // Play must be initiated by user action. Browsers block automatic playback.
        this.backgroundMusicElement.play()
            .then(() => {
                console.log("AudioManager: Background music playback started successfully.");
                this.musicStarted = true; // Mark as started
                // Ensure initial mute state is applied correctly AFTER play starts
                this.applyMusicState();
            })
            .catch(error => {
                console.warn("AudioManager: Background music playback failed (likely requires user interaction). Error:", error);
                // Don't set musicStarted = true if it failed
            });
    }

    /** Toggles the mute state for background music ONLY */
    toggleMusicMute() {
        if (!this.backgroundMusicElement) return;
        this.isMusicMuted = !this.isMusicMuted;
        console.log(`AudioManager: Background music ${this.isMusicMuted ? 'muted' : 'unmuted'}.`);
        this.applyMusicState();
        this.saveMusicMutePreference();
    }

    /** Applies the current mute state to the audio element and button */
    applyMusicState() {
        if (this.backgroundMusicElement) {
            this.backgroundMusicElement.muted = this.isMusicMuted;
        }
        if (this.volumeToggleButton) {
            this.volumeToggleButton.textContent = this.isMusicMuted ? '🔇' : '🔊'; // Update icon
            this.volumeToggleButton.title = this.isMusicMuted ? 'Unmute Music' : 'Mute Music';
            if (this.isMusicMuted) {
                 this.volumeToggleButton.classList.add('muted');
            } else {
                 this.volumeToggleButton.classList.remove('muted');
            }
        }
    }

    /** Saves the music mute preference to localStorage */
    saveMusicMutePreference() {
        try {
            localStorage.setItem(this.musicVolumeKey, this.isMusicMuted.toString());
        } catch (e) {
            console.warn("AudioManager: Could not save music mute preference to localStorage.", e);
        }
    }

    /** Loads the music mute preference from localStorage */
    loadMusicMutePreference() {
        try {
            const storedValue = localStorage.getItem(this.musicVolumeKey);
            // Default to muted (true) if not found or invalid
            this.isMusicMuted = storedValue !== 'false';
            console.log(`AudioManager: Loaded music mute preference: ${this.isMusicMuted}`);
        } catch (e) {
            console.warn("AudioManager: Could not load music mute preference from localStorage.", e);
            this.isMusicMuted = true; // Default to muted on error
        }
    }

    // --- END: New Background Music Methods ---

} // End AudioManager Class

// Assign to window in main.js as before
// window.audioManager = new AudioManager();