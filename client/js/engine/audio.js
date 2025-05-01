// client/js/engine/audio.js

/**
 * Manages loading and playing audio assets (sound effects and background music).
 * Handles mute states and user interaction requirements for playback.
 */
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.soundBuffers = {}; // Stores decoded audio buffers
        this.musicElement = document.getElementById('background-music');
        this.volumeToggleButton = document.getElementById('btn-toggle-volume');
        this.isMusicMuted = true; // Default to muted initially? Let's start unmuted based on testcodeissues.md
        this.canPlaySound = false; // Flag to track if AudioContext is unlocked

        // Define sound file paths relative to the client root
        // Using .mp3 based on previous troubleshooting, confirm file types
        this.sounds = {
            'fire': '/assets/sounds/fire.mp3',
            'hit': '/assets/sounds/hit.mp3',
            'explode': '/assets/sounds/explosion.mp3', // Generic explosion
            'robotDeath': '/assets/sounds/robotdeath.wav' // <<< ADDED NEW SOUND
            // Add more sounds here as needed
        };

        this._initialize();
        this._loadSounds(); // Start loading sounds defined above
        this._setupUIListeners();
    }

    /** Initialize the Audio Context after user interaction */
    _initialize() {
        // Check localStorage for persisted mute state
        const storedMutePref = localStorage.getItem('robotWarsMusicMuted');
        // Default to NOT muted if no preference is stored
        this.isMusicMuted = storedMutePref === 'true'; // Note: localStorage stores strings
        console.log(`[Audio] Initial music mute state from localStorage: ${this.isMusicMuted}`);

        // Update button state immediately based on loaded preference
        this._updateVolumeButtonState();

        // We don't create AudioContext here anymore, wait for user interaction
        console.log("[Audio] Waiting for user interaction to initialize AudioContext.");
    }

    /** Attempts to create and unlock the Audio Context */
    _unlockAudioContext() {
        if (this.audioContext && this.audioContext.state === 'running') {
             // console.log("[Audio] AudioContext already running."); // DEBUG: Optional logging
            this.canPlaySound = true;
            return true; // Already unlocked
        }

        if (!this.audioContext) {
            try {
                console.log("[Audio] Attempting to create AudioContext...");
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                console.log(`[Audio] AudioContext created. Initial state: ${this.audioContext.state}`);
            } catch (e) {
                console.error("[Audio] Error creating AudioContext:", e);
                alert("Audio Error: Could not initialize audio playback.");
                return false;
            }
        }

        // Check if we need to resume the context (required after user interaction)
        if (this.audioContext.state === 'suspended') {
             console.log("[Audio] AudioContext is suspended, attempting resume...");
             this.audioContext.resume().then(() => {
                console.log("[Audio] AudioContext resumed successfully.");
                this.canPlaySound = true;
                 // Try playing music again if it was requested while suspended
                 this._checkAndPlayMusic();
             }).catch(e => {
                console.error("[Audio] Error resuming AudioContext:", e);
             });
        } else if (this.audioContext.state === 'running') {
            console.log("[Audio] AudioContext already running.");
            this.canPlaySound = true;
        }

        return this.canPlaySound;
    }

    /** Load all defined sound effects */
    _loadSounds() {
        if (!this.sounds) return;

        console.log("[Audio] Loading sound effects...");
        Object.keys(this.sounds).forEach(key => {
            const path = this.sounds[key];
            // Use fetch API to load sound files
            fetch(path)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status} for ${path}`);
                    }
                    return response.arrayBuffer(); // Get audio data as ArrayBuffer
                })
                .then(arrayBuffer => {
                    // Decode audio data asynchronously
                    // We need the context first, so maybe defer decoding?
                    // OR, store the ArrayBuffer and decode on first play/unlock?
                    // Let's store the ArrayBuffer for now.
                    this.soundBuffers[key] = { buffer: arrayBuffer, decoded: null };
                    // console.log(`[Audio] Loaded ArrayBuffer for sound: ${key}`); // DEBUG: Optional logging
                })
                .catch(error => {
                    console.error(`[Audio] Error loading sound '${key}' from ${path}:`, error);
                    this.soundBuffers[key] = { error: error }; // Mark as errored
                });
        });
         console.log("[Audio] Sound effect loading initiated.");
    }

     /** Decode a stored ArrayBuffer on demand */
    _decodeSound(key) {
        return new Promise((resolve, reject) => {
            if (!this.audioContext) {
                return reject(new Error("AudioContext not available for decoding."));
            }
            if (!this.soundBuffers[key] || !this.soundBuffers[key].buffer || this.soundBuffers[key].decoded) {
                // Already decoded or no buffer exists
                return resolve(this.soundBuffers[key]?.decoded);
            }

            // console.log(`[Audio] Decoding sound buffer for: ${key}`); // DEBUG: Optional logging
            this.audioContext.decodeAudioData(this.soundBuffers[key].buffer.slice(0)) // Decode a copy
                .then(decodedBuffer => {
                    // console.log(`[Audio] Successfully decoded: ${key}`); // DEBUG: Optional logging
                    this.soundBuffers[key].decoded = decodedBuffer;
                    // Clear the original buffer to save memory? Optional.
                    // this.soundBuffers[key].buffer = null;
                    resolve(decodedBuffer);
                })
                .catch(error => {
                    console.error(`[Audio] Error decoding sound '${key}':`, error);
                    this.soundBuffers[key].error = error;
                    reject(error);
                });
        });
    }


    /** Play a loaded sound effect */
    async playSound(key) {
        // Ensure context is unlocked and sound exists
        if (!this.canPlaySound || !this.audioContext || !this.soundBuffers[key]) {
            // console.warn(`[Audio] Cannot play sound '${key}'. CanPlay: ${this.canPlaySound}, Context: ${!!this.audioContext}, Buffer Exists: ${!!this.soundBuffers[key]}`);
            return;
        }
        if (this.soundBuffers[key].error) {
            // console.warn(`[Audio] Cannot play sound '${key}' due to previous loading/decoding error.`);
            return;
        }

        try {
             // Ensure the buffer is decoded before playing
            let decodedBuffer = this.soundBuffers[key].decoded;
            if (!decodedBuffer) {
                decodedBuffer = await this._decodeSound(key);
            }

            if (!decodedBuffer) { // Check again after await
                console.warn(`[Audio] Failed to get decoded buffer for '${key}'. Cannot play.`);
                return;
            }

            // Create buffer source node
            const source = this.audioContext.createBufferSource();
            source.buffer = decodedBuffer;
            // Connect source to the destination (speakers)
            source.connect(this.audioContext.destination);
            // Play the sound
            source.start(0); // Play immediately

        } catch (error) {
            console.error(`[Audio] Error playing sound '${key}':`, error);
        }
    }


    /** Set up listeners for volume toggle */
    _setupUIListeners() {
        if (this.volumeToggleButton) {
            this.volumeToggleButton.addEventListener('click', () => {
                // Attempt to unlock audio context on first UI interaction with button
                if (!this.canPlaySound) {
                    console.log("[Audio] Volume button clicked, attempting to unlock AudioContext.");
                    this._unlockAudioContext();
                }

                this.toggleMusicMute();
            });
        } else {
            console.warn("[Audio] Volume toggle button not found.");
        }
    }

    /** Toggle music mute state and update UI/localStorage */
    toggleMusicMute() {
        this.isMusicMuted = !this.isMusicMuted;
        console.log(`[Audio] Music mute toggled to: ${this.isMusicMuted}`);
        localStorage.setItem('robotWarsMusicMuted', this.isMusicMuted.toString()); // Persist preference
        this._updateVolumeButtonState();
        this._checkAndPlayMusic(); // Apply mute/unmute to playback
    }

    /** Update the visual state of the volume button */
    _updateVolumeButtonState() {
        if (this.volumeToggleButton) {
            if (this.isMusicMuted) {
                this.volumeToggleButton.textContent = '🔇';
                this.volumeToggleButton.title = 'Unmute Music';
                this.volumeToggleButton.classList.add('muted');
            } else {
                this.volumeToggleButton.textContent = '🔊';
                this.volumeToggleButton.title = 'Mute Music';
                this.volumeToggleButton.classList.remove('muted');
            }
        }
    }

     /** Checks mute state and attempts to play or pause music */
     _checkAndPlayMusic() {
         if (!this.musicElement) return;

         try {
            if (this.isMusicMuted) {
                if (!this.musicElement.paused) {
                    this.musicElement.pause();
                     console.log("[Audio] Music paused due to mute state.");
                }
            } else {
                // Only try to play if context is unlocked (or attempt unlock)
                 if (!this.canPlaySound) {
                    console.log("[Audio] Trying to play music, but context not unlocked. Attempting unlock.");
                    this._unlockAudioContext(); // Attempt unlock again
                     // Play will be triggered by resume() callback if successful
                } else if (this.musicElement.paused) {
                    this.musicElement.play().then(() => {
                         console.log("[Audio] Background music playback started/resumed.");
                    }).catch(e => {
                        if (e.name === 'NotAllowedError') {
                            console.warn("[Audio] Music play() failed - likely needs more user interaction.");
                             // No need to alert here, will try again on next interaction
                        } else {
                            console.error("[Audio] Error playing music:", e);
                        }
                    });
                }
            }
         } catch (error) {
             console.error("[Audio] Error in _checkAndPlayMusic:", error);
         }
    }


    /** Public method called by other modules (like AuthHandler or LoadoutBuilder) */
    requestMusicStart() {
        console.log("[Audio] Music start requested.");
        // Attempt to unlock context (might be redundant, but safe)
        const unlocked = this._unlockAudioContext();
        // If unlocked or already running, attempt to play based on mute state
        if (unlocked) {
            this._checkAndPlayMusic();
        } else {
             console.log("[Audio] Music start requested, but context needs user interaction to unlock.");
             // Playback will be handled by context resume if successful later
        }
    }

} // End AudioManager Class