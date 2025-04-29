// client/js/engine/audio.js

/**
 * Manages loading and playback of sound effects and background music.
 * Handles user mute preferences via localStorage.
 * Initiates background music playback upon user interaction trigger.
 */
class AudioManager {
    constructor() {
        this.sounds = {}; // Cache for loaded sound effects
        this.soundPath = '/assets/sounds/'; // <<< CONFIRMED CORRECT PATH
        this.soundEnabled = true; // Basic toggle (can be expanded)

        // --- Background Music Elements ---
        this.musicElement = document.getElementById('background-music');
        this.volumeButton = document.getElementById('btn-toggle-volume');
        this.isMusicMuted = false; // <<< Default to UNMUTED
        this._musicPlaybackAttempted = false; // Flag to prevent multiple start attempts
        this._musicActuallyPlaying = false; // Flag to track if play() succeeded

        // Basic check for music elements
        if (!this.musicElement) {
            console.error("AudioManager: Background music element '#background-music' not found!");
        }
        if (!this.volumeButton) {
             console.error("AudioManager: Volume toggle button '#btn-toggle-volume' not found!");
        }

        this._loadMutePreference();
        this._setupVolumeButton();

        console.log(`AudioManager initialized. Music default state: ${this.isMusicMuted ? 'Muted' : 'Unmuted'}`);
    }

    /** Loads mute preference from localStorage */
    _loadMutePreference() {
        try {
            const storedMutePref = localStorage.getItem('robotWarsMusicMuted');
            if (storedMutePref !== null) {
                this.isMusicMuted = storedMutePref === 'true';
                console.log(`AudioManager: Loaded mute preference from localStorage: ${this.isMusicMuted}`);
            }
            // Apply initial state to element and button
            if (this.musicElement) {
                 this.musicElement.muted = this.isMusicMuted;
            }
             this._updateVolumeButtonIcon();

        } catch (e) {
            console.error("AudioManager: Error reading mute preference from localStorage:", e);
        }
    }

    /** Saves mute preference to localStorage */
    _saveMutePreference() {
        try {
            localStorage.setItem('robotWarsMusicMuted', this.isMusicMuted);
             // console.log(`AudioManager: Saved mute preference to localStorage: ${this.isMusicMuted}`);
        } catch (e) {
            console.error("AudioManager: Error saving mute preference to localStorage:", e);
        }
    }

    /** Sets up the volume toggle button listener */
    _setupVolumeButton() {
        if (!this.volumeButton) return;
        this.volumeButton.addEventListener('click', () => {
            this.toggleMusic();
        });
        this._updateVolumeButtonIcon(); // Set initial icon
    }

    /** Updates the visual state of the volume button */
    _updateVolumeButtonIcon() {
        if (!this.volumeButton) return;
        if (this.isMusicMuted) {
            this.volumeButton.textContent = '🔇'; // Muted icon
            this.volumeButton.classList.add('muted');
            this.volumeButton.title = "Unmute Music";
        } else {
            this.volumeButton.textContent = '🔊'; // Unmuted icon
            this.volumeButton.classList.remove('muted');
            this.volumeButton.title = "Mute Music";
        }
    }

    /** Toggles background music mute state */
    toggleMusic() {
        if (!this.musicElement) return;

        this.isMusicMuted = !this.isMusicMuted;
        this.musicElement.muted = this.isMusicMuted;
        this._saveMutePreference();
        this._updateVolumeButtonIcon();
        console.log(`AudioManager: Music ${this.isMusicMuted ? 'muted' : 'unmuted'}.`);

        // --- START: Attempt playback if unmuting for the first time ---
        // If we are unmuting AND music hasn't been successfully started/attempted yet, try now.
        if (!this.isMusicMuted && !this._musicPlaybackAttempted) {
             console.log("AudioManager: Attempting music start via volume toggle (first unmute).");
             this.requestMusicStart();
        }
        // --- END ---
    }

    /**
     * Attempts to start background music playback.
     * Should be called from a user interaction context (e.g., button click).
     * Will only attempt to play once. Respects the current mute state.
     */
    async requestMusicStart() {
        if (!this.musicElement) {
            console.error("AudioManager: Cannot start music, element not found.");
            return;
        }
        // Prevent multiple attempts and don't try if muted
        if (this._musicPlaybackAttempted) {
             // console.log("AudioManager: Music playback already attempted/started."); // Optional: Less verbose log
             return;
        }
        if (this.isMusicMuted) {
             console.log("AudioManager: Music start requested, but currently muted by preference.");
             this._musicPlaybackAttempted = true; // Mark as attempted even if muted
             return;
        }

        this._musicPlaybackAttempted = true; // Mark that we are trying now

        try {
            // Ensure the element is explicitly unmuted before playing
            this.musicElement.muted = false;
            await this.musicElement.play();
            this._musicActuallyPlaying = true; // Flag that play() succeeded
            console.log("AudioManager: Background music playback initiated successfully.");
        } catch (error) {
            this._musicActuallyPlaying = false; // Playback failed
            if (error.name === 'NotAllowedError') {
                console.warn("AudioManager: Background music playback failed (likely requires user interaction). Error:", error.message);
                // Don't reset _musicPlaybackAttempted here, the attempt *was* made.
                // The user might need to click the volume toggle again if this initial attempt failed.
            } else {
                console.error("AudioManager: Error attempting to play background music:", error);
            }
        }
    }

    /**
     * Loads a sound effect into the cache.
     * @param {string} soundName - The name of the sound (e.g., 'fire', 'hit').
     * @param {function} [callback] - Optional callback function when loading finishes.
     */
    loadSound(soundName, callback) {
        if (this.sounds[soundName]) { // Already loaded or loading
            if (this.sounds[soundName] instanceof Audio) {
                if (callback) callback(null, this.sounds[soundName]); // Already loaded
            } else {
                // Still loading, add callback to queue (if implementing queue)
            }
            return;
        }

        // Mark as loading (can use a placeholder object or boolean)
        this.sounds[soundName] = true; // Simple loading flag

        const sound = new Audio();
        sound.addEventListener('canplaythrough', () => {
            this.sounds[soundName] = sound; // Replace flag with loaded Audio object
            console.log(`AudioManager: Sound '${soundName}' loaded successfully.`);
            if (callback) callback(null, sound);
        }, { once: true }); // Use 'once' to prevent multiple calls if event fires again

        sound.addEventListener('error', (e) => {
            console.error(`AudioManager: Error loading sound '${soundName}' from ${sound.src}:`, e);
            delete this.sounds[soundName]; // Remove loading flag on error
            if (callback) callback(new Error(`Failed to load sound: ${soundName}`), null);
        });

        // Construct the full path
        sound.src = `${this.soundPath}${soundName}.mp3`; // Use mp3 extension
        sound.preload = 'auto'; // Suggest browser to load
        sound.load(); // Explicitly call load
    }

    /**
     * Plays a preloaded sound effect.
     * @param {string} soundName - The name of the sound to play.
     * @param {number} [volume=0.5] - Volume level (0.0 to 1.0).
     */
    playSound(soundName, volume = 0.5) {
        if (!this.soundEnabled) return; // Check if sound effects are globally enabled

        const sound = this.sounds[soundName];
        if (sound instanceof Audio) {
            // Create a new audio element for concurrent playback if needed
            // Or reset the current one if overlap is okay
            try {
                 // Simple approach: reset and play
                 sound.currentTime = 0;
                 sound.volume = Math.max(0, Math.min(1, volume)); // Clamp volume
                 sound.play().catch(e => {
                     // NotAllowedError can sometimes happen here too if the *very first* sound
                     // effect play isn't tied to interaction. Usually less strict than background music.
                     if (e.name !== 'NotAllowedError') {
                         console.error(`AudioManager: Error playing sound '${soundName}':`, e);
                     } else {
                         // console.warn(`AudioManager: Sound effect '${soundName}' blocked by autoplay policy.`);
                     }
                 });
            } catch (error) {
                 console.error(`AudioManager: Exception playing sound '${soundName}':`, error);
            }
        } else if (sound === true) {
            console.warn(`AudioManager: Sound '${soundName}' is still loading. Cannot play yet.`);
            // Optionally queue the sound play request
        } else {
            console.warn(`AudioManager: Sound '${soundName}' not loaded. Attempting to load now.`);
            // Attempt to load on the fly (might have delay)
            this.loadSound(soundName, (err, loadedSound) => {
                if (!err && loadedSound) {
                    this.playSound(soundName, volume); // Retry playing after load
                }
            });
        }
    }

} // End AudioManager Class