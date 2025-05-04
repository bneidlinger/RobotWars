// client/js/ui/testBotSelector.js

/**
 * Test Bot Selector Module
 * Handles displaying and managing the test bot selection modal
 * for players to choose an AI opponent before starting a test game.
 */
class TestBotSelector {
    constructor(network) {
        this.network = network;
        this.selectedProfile = 'standard'; // Default profile
        this.modal = document.getElementById('test-bot-modal');
        this.cards = document.querySelectorAll('.test-bot-card');
        this.startButton = document.getElementById('btn-start-test');
        this.cancelButton = document.getElementById('btn-cancel-test');
        this.selectedLoadout = null; // Will store the player's loadout data
        this.resolvePromise = null; // For promise resolution

        this.initEventListeners();
    }

    /**
     * Set up event listeners for the modal
     */
    initEventListeners() {
        // Card selection
        this.cards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove selected class from all cards
                this.cards.forEach(c => c.classList.remove('selected'));
                // Add selected class to clicked card
                card.classList.add('selected');
                // Update selected profile
                this.selectedProfile = card.dataset.profile;
            });
        });

        // Start button
        if (this.startButton) {
            this.startButton.addEventListener('click', () => {
                this.hide();
                if (this.resolvePromise) {
                    this.resolvePromise({
                        confirmed: true,
                        profile: this.selectedProfile,
                        loadoutData: this.selectedLoadout
                    });
                    this.resolvePromise = null;
                }
            });
        }

        // Cancel button
        if (this.cancelButton) {
            this.cancelButton.addEventListener('click', () => {
                this.hide();
                if (this.resolvePromise) {
                    this.resolvePromise({
                        confirmed: false
                    });
                    this.resolvePromise = null;
                }
            });
        }

        // Close when clicking outside
        this.modal.addEventListener('click', (e) => {
            // Only close if clicking the backdrop (not the content)
            if (e.target === this.modal) {
                this.hide();
                if (this.resolvePromise) {
                    this.resolvePromise({
                        confirmed: false
                    });
                    this.resolvePromise = null;
                }
            }
        });
    }

    /**
     * Pre-select a profile card
     * @param {string} profile - Profile ID to select
     */
    selectProfile(profile) {
        // Default to standard if invalid profile
        const validProfile = ['standard', 'aggressive', 'defensive', 'sniper', 'erratic', 'stationary'].includes(profile) 
            ? profile 
            : 'standard';
        
        // Update internal state
        this.selectedProfile = validProfile;
        
        // Update UI
        this.cards.forEach(card => {
            if (card.dataset.profile === validProfile) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    }

    /**
     * Show the bot selection modal with promise-based result
     * @param {Object} loadoutData - Player's current loadout data
     * @returns {Promise} Resolves with selection result
     */
    show(loadoutData) {
        if (!this.modal) {
            console.error('TestBotSelector: Modal element not found');
            return Promise.reject(new Error('Modal element not found'));
        }

        // Store the loadout data
        this.selectedLoadout = loadoutData;

        // Ensure a default selection
        this.selectProfile(this.selectedProfile || 'standard');

        // Display the modal
        this.modal.style.display = 'flex';

        // Return a promise that will resolve when the user confirms or cancels
        return new Promise(resolve => {
            this.resolvePromise = resolve;
        });
    }

    /**
     * Hide the bot selection modal
     */
    hide() {
        if (this.modal) {
            this.modal.style.display = 'none';
        }
    }
}

// Export as global in window object
window.TestBotSelector = TestBotSelector;