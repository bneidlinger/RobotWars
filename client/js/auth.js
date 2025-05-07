// client/js/auth.js

// --- Global State (Kept for compatibility for now, but prefer authHandler.isLoggedIn) ---
let isLoggedIn = false;
window.currentUser = null; // { id, username }

// --- API Call Helper (Global Scope) ---
/**
 * Helper function to make API calls to the backend.
 * Includes credentials to handle session cookies.
 * @param {string} endpoint - The API endpoint path (e.g., '/api/auth/login').
 * @param {string} [method='GET'] - The HTTP method.
 * @param {object|null} [body=null] - The request body for POST/PUT requests.
 * @returns {Promise<object>} - A promise that resolves with the JSON response data.
 * @throws {Error} - Throws an error if the fetch fails or the response is not ok,
 *                   potentially including status and server message.
 */
async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {},
        credentials: 'include' // Send cookies automatically
    };
    if (body) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }

    try {
        // console.log(`[API Call] Sending ${method} request to ${endpoint}`); // Optional: Less verbose logging
        const response = await fetch(endpoint, options);
        let data;
        try {
             const contentType = response.headers.get("content-type");
             if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await response.json();
             } else {
                 const textResponse = await response.text();
                 if (response.ok && !textResponse) {
                     data = { message: 'Success (No Content)' };
                 } else if (!response.ok) {
                     console.error(`[API Call] Non-JSON Error Response (Status ${response.status}) for ${method} ${endpoint}:`, textResponse);
                     throw new Error(textResponse || `Server returned status ${response.status}`);
                 } else {
                     console.warn(`[API Call] Received non-JSON success response (Status ${response.status}) for ${method} ${endpoint}:`, textResponse);
                     data = { message: textResponse || 'Success (Non-JSON)' };
                 }
             }
        } catch (jsonError) {
             console.error(`[API Call] Error processing response for ${method} ${endpoint}:`, jsonError, "Response Status:", response.status);
             if (!response.ok) {
                 throw new Error(`Server returned status ${response.status}`);
             }
             throw jsonError;
        }

        if (!response.ok) {
            const errorMessage = data?.message || `HTTP error! status: ${response.status} ${response.statusText}`;
            const error = new Error(errorMessage);
            error.status = response.status;
            error.data = data;
            console.warn(`[API Call] Request failed for ${method} ${endpoint} (Status ${response.status}): ${errorMessage}`);
            throw error;
        }

        // console.log(`[API Call] Success for ${method} ${endpoint}`, data); // Optional: Less verbose logging
        return data;
    } catch (error) {
         if (!error.status) {
             console.error(`[API Call] Network or fetch error for ${method} ${endpoint}:`, error);
             error.message = `Network error: Could not reach server. (${error.message})`;
         }
        throw error;
    }
}
// --- End API Call Helper ---


/**
 * Manages the entire authentication flow, including UI modals,
 * API interactions, state updates, and triggering post-login/logout actions.
 * Should be instantiated and initialized by main.js after other core components.
 */
class AuthHandler {
    constructor() {
        // --- DOM Element References ---
        this.loginModal = document.getElementById('login-modal');
        this.registerModal = document.getElementById('register-modal');
        this.loginForm = document.getElementById('login-form');
        this.registerForm = document.getElementById('register-form');
        this.loginError = document.getElementById('login-error');
        this.registerError = document.getElementById('register-error');
        this.logoutButton = document.getElementById('btn-logout');
        this.playerNameDisplay = document.getElementById('player-name-display'); // Header account name
        this.iconDisplay = document.getElementById('player-icon-display'); // Header icon (reset color on auth change)
        this.mainContainer = document.querySelector('.container'); // Main game area container

        // --- Robust Element Check ---
        const requiredElements = {
            loginModal: this.loginModal, registerModal: this.registerModal,
            loginForm: this.loginForm, registerForm: this.registerForm,
            logoutButton: this.logoutButton, mainContainer: this.mainContainer,
            playerNameDisplay: this.playerNameDisplay
        };
        let missingElement = null;
        for (const key in requiredElements) { if (!requiredElements[key]) { missingElement = key; break; } }

        if (missingElement) {
            console.error(`[AuthHandler Constructor] FATAL: Required UI element not found: '${missingElement}'.`);
            throw new Error(`AuthHandler could not find required element: ${missingElement}`);
        }

        // --- Internal State ---
        this._loggedIn = false; // Add internal state flag

        console.log("AuthHandler constructor: Required elements found.");
    }

    // --- Add isLoggedIn getter ---
    get isLoggedIn() {
        return this._loggedIn;
    }

    // --- Modal Control ---
    _showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            const errorElement = modal.querySelector('.error-message');
            if (errorElement) errorElement.textContent = '';
            modal.style.display = 'flex';
        } else {
            console.error(`[AuthHandler] Modal with ID '${modalId}' not found.`);
        }
    }

    _closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        } else {
            console.error(`[AuthHandler] Modal with ID '${modalId}' not found.`);
        }
    }

    // --- Authentication Logic Handlers (Private) ---

    async _handleLogin(event) {
        event.preventDefault();
        if (!this.loginForm || !this.loginError) {
             console.error("[AuthHandler] Login form or error element missing in _handleLogin.");
             return;
        }
        this.loginError.textContent = '';
        const username = this.loginForm.username.value;
        const password = this.loginForm.password.value;

        try {
            const data = await apiCall('/api/auth/login', 'POST', { username, password });
            console.log('[AuthHandler] Login successful:', data);
            this._updateAuthState(true, data.user); // Update internal and global state
            this._closeModal('login-modal');
            this._onLoginSuccess(); // Call the updated success handler
        } catch (error) {
            console.error('[AuthHandler] Login failed:', error);
            this.loginError.textContent = error.message || 'Login failed. Please try again.';
        }
    }

    async _handleRegister(event) {
        event.preventDefault();
        if (!this.registerForm || !this.registerError) {
             console.error("[AuthHandler] Register form or error element missing in _handleRegister.");
            return;
        }
        this.registerError.textContent = '';
        const username = this.registerForm.username.value;
        const password = this.registerForm.password.value;
        const confirmPassword = this.registerForm.confirmPassword.value;

        // Client-side validation
        if (password !== confirmPassword) { this.registerError.textContent = 'Passwords do not match.'; return; }
        if (password.length < 4 || password.length > 10) { this.registerError.textContent = 'Password must be 4-10 chars.'; return; }
        if (!/^[a-zA-Z0-9]+$/.test(password)) { this.registerError.textContent = 'Password must be alphanumeric.'; return; }
        if (username.length < 3 || username.length > 20) { this.registerError.textContent = 'Username must be 3-20 chars.'; return; }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) { this.registerError.textContent = 'Username: alphanumeric or underscore.'; return; }

        try {
            const data = await apiCall('/api/auth/register', 'POST', { username, password });
            console.log('[AuthHandler] Registration successful:', data);
            this._updateAuthState(true, data.user); // Update internal and global state
            this._closeModal('register-modal');
            this._onLoginSuccess(); // Call the updated success handler
        } catch (error) {
            console.error('[AuthHandler] Registration failed:', error);
            this.registerError.textContent = error.message || 'Registration failed. Please try again.';
        }
    }

    async _handleLogout() {
        if (this.logoutButton) this.logoutButton.disabled = true;
        if (this.loginError) this.loginError.textContent = '';
        if (this.registerError) this.registerError.textContent = '';

        try {
            await apiCall('/api/auth/logout', 'POST');
            console.log('[AuthHandler] Logout successful');
            this._updateAuthState(false, null); // Update internal and global state
            this._onLogoutSuccess();
        } catch (error) {
            console.error('[AuthHandler] Logout failed:', error);
            alert('Logout failed. Please try again.');
            if (this.logoutButton) this.logoutButton.disabled = false;
        }
    }

    /** Updates the global auth state and relevant UI elements */
    _updateAuthState(loggedIn, user) {
        this._loggedIn = loggedIn; // Update internal state HERE

        // Update global state variables (keep for compatibility for now)
        window.isLoggedIn = loggedIn;
        window.currentUser = user;
        // Log internal state too for clarity during debugging
        console.log('[AuthHandler] State Updated:', { isLoggedIn: this._loggedIn, user: window.currentUser });

        // Update UI elements based on the new state
        if (this.logoutButton) {
            this.logoutButton.style.display = this._loggedIn ? 'inline-block' : 'none';
            this.logoutButton.disabled = !this._loggedIn; // Re-enable button if logged in, disable if not
        }

        if (this.playerNameDisplay) {
            const nameToShow = this._loggedIn ? (window.currentUser?.username || 'Logged In') : 'Not Logged In';
            this.playerNameDisplay.textContent = nameToShow;
            this.playerNameDisplay.title = this._loggedIn ? `Account: ${window.currentUser?.username}` : 'Not Logged In';
        }

        // Reset header icon color on auth state change
        if (this.iconDisplay) {
            this.iconDisplay.style.backgroundColor = this._loggedIn ? '#888' : '#555';
        }

        // Show/Hide the main game container
        if (this.mainContainer) {
            this.mainContainer.style.display = this._loggedIn ? 'flex' : 'none';
            console.log(`[AuthHandler] Main container display set to: ${this.mainContainer.style.display}`);
        } else {
             console.error("[AuthHandler] Main container element (.container) not found during state update!");
        }
    }

    /** Actions to perform after successful login/registration */
    _onLoginSuccess() {
        console.log("[AuthHandler] _onLoginSuccess Actions Triggered");

        // --- REMOVED Music Start Request ---
        // This is now handled by LoadoutBuilder action buttons or the main volume toggle.
        // console.log("[AuthHandler _onLoginSuccess] Music start request removed from here.");

        // Show Loadout Builder immediately - It handles its own auth check/delay now
        console.log("[AuthHandler] Attempting to show Loadout Builder (will self-verify auth)...");
        // Use global instance
        if (typeof window.loadoutBuilderInstance !== 'undefined' && window.loadoutBuilderInstance?.show) {
            window.loadoutBuilderInstance.show(); // Call show, it does the rest
        } else {
            console.error("[AuthHandler] LoadoutBuilder instance (window.loadoutBuilderInstance) not available!");
            alert("Critical Error: Failed to load Robot Builder UI.");
             if(this.mainContainer) this.mainContainer.style.display = 'flex'; // Ensure main area is visible even if builder fails
        }

        // Update header ICON via Controls
        // Use global instance
        if (typeof controls !== 'undefined' && controls?.updatePlayerHeaderDisplay) {
            controls.updatePlayerHeaderDisplay();
        } else {
             console.warn("[AuthHandler] Controls object or updatePlayerHeaderDisplay method not available yet for icon update.");
        }

        // Connect WebSocket
        // Use global instance
        if (typeof network !== 'undefined' && network.connect) {
             if (!network.socket || !network.socket.connected) {
                console.log("[AuthHandler] Connecting WebSocket...");
                network.connect();
             } else {
                console.log("[AuthHandler] WebSocket already connected.");
                 // Use global instance
                 if(typeof controls !== 'undefined') controls.setState('lobby');
             }
        } else {
             console.warn("[AuthHandler] Network object not available to connect.");
        }

        // --- START: Refresh Editor ---
        // Attempt to refresh the main editor to fix potential rendering issues
        // Do this after a very short delay to allow the flex container to render
        setTimeout(() => {
            // Use global instance
            if (typeof editor !== 'undefined' && editor?.refresh) {
                console.log("[AuthHandler _onLoginSuccess] Refreshing main editor...");
                try { editor.refresh(); } catch(e) { console.error("Error refreshing editor:", e); }
            }
        }, 50); // Short delay (50ms)
        // --- END: Refresh Editor ---

        // --- START: Populate Controls Snippet Dropdown ---
        // Needs to happen AFTER login state is confirmed and UI is potentially visible
        // Use global instance
        if (typeof controls !== 'undefined' && controls.populateCodeSnippetSelect) {
            console.log("[AuthHandler _onLoginSuccess] Populating main editor snippet dropdown...");
            // Using a small delay here too might be safer if controls initialization
            // relies on something async, though it shouldn't normally
            setTimeout(() => {
                 controls.populateCodeSnippetSelect(); // Call the population method again
            }, 100); // Slightly longer delay? Or try 0?
        } else {
            console.warn("[AuthHandler _onLoginSuccess] Controls object or populateCodeSnippetSelect not found for dropdown population.");
        }
        // --- END: Populate Controls Snippet Dropdown ---

    } // End _onLoginSuccess


    /** Actions to perform after logout */
    _onLogoutSuccess() {
        console.log("[AuthHandler] _onLogoutSuccess Actions Triggered");

        // Use global instances
        // Disconnect WebSocket
        if (typeof network !== 'undefined' && network.socket?.connected) {
            console.log("[AuthHandler] Disconnecting WebSocket on logout...");
            network.socket.disconnect();
        }
        // Stop game engine if running
        if (typeof game !== 'undefined' && game.isRunning) {
            console.log("[AuthHandler] Stopping game engine on logout...");
            game.stop();
        }

        // Clear UI data
        if (typeof window.dashboard !== 'undefined' && window.dashboard?.updateStats) window.dashboard.updateStats([], {});
        if (typeof window.updateGameHistory === 'function') window.updateGameHistory([]);
        if (typeof window.clearEventLog === 'function') window.clearEventLog();
        if (typeof window.clearRobotLog === 'function') window.clearRobotLog();
        if (typeof window.clearOpponentLog === 'function') window.clearOpponentLog();
        if (typeof editor !== 'undefined' && editor?.setValue) editor.setValue('// Logged out. Please log in.');

        // Hide main container AND builder overlay
        if (this.mainContainer) this.mainContainer.style.display = 'none';
        if (typeof window.loadoutBuilderInstance !== 'undefined' && window.loadoutBuilderInstance?.hide) {
             window.loadoutBuilderInstance.hide();
        }

        // Reset Controls UI state (disables buttons, etc.)
        if (typeof controls !== 'undefined') {
             controls.setState('lobby'); // This will trigger updateUIForState with loggedIn=false
             // Also clear the controls snippet dropdown
             if(controls.populateCodeSnippetSelect) {
                console.log("[AuthHandler _onLogoutSuccess] Clearing main editor snippet dropdown.");
                controls.populateCodeSnippetSelect(); // Will clear because loggedIn is false
             }
        }

        // Show the login modal
        this._showModal('login-modal');
    }

    // --- Public Initialization Method ---
    /**
     * Sets up event listeners and performs the initial authentication check.
     * Called by main.js after all other components are instantiated.
     */
    async initialize() {
        console.log("[AuthHandler] Initializing...");

        // 1. Setup Event Listeners for forms, buttons, modals
        if (this.loginForm) this.loginForm.addEventListener('submit', this._handleLogin.bind(this));
        if (this.registerForm) this.registerForm.addEventListener('submit', this._handleRegister.bind(this));
        if (this.logoutButton) this.logoutButton.addEventListener('click', this._handleLogout.bind(this));

        const loginCloseBtn = this.loginModal?.querySelector('.auth-close-btn');
        const registerCloseBtn = this.registerModal?.querySelector('.auth-close-btn');
        if(loginCloseBtn) loginCloseBtn.onclick = () => this._closeModal('login-modal');
        if(registerCloseBtn) registerCloseBtn.onclick = () => this._closeModal('register-modal');

        const registerLink = this.loginModal?.querySelector('.switch-modal-link a');
        const loginLink = this.registerModal?.querySelector('.switch-modal-link a');
        if (registerLink) registerLink.onclick = () => { this._showModal('register-modal'); this._closeModal('login-modal'); return false; };
        if (loginLink) loginLink.onclick = () => { this._showModal('login-modal'); this._closeModal('register-modal'); return false; };


        window.addEventListener('click', (event) => {
            const currentLoginModal = document.getElementById('login-modal');
            const currentRegisterModal = document.getElementById('register-modal');
            if (currentLoginModal && event.target == currentLoginModal) this._closeModal('login-modal');
            if (currentRegisterModal && event.target == currentRegisterModal) this._closeModal('register-modal');
        });
        console.log("[AuthHandler] Event listeners attached.");

        // 2. Check Initial Auth Status via API - do this through the checkLoginState method
        await this.checkLoginState();
    } // End initialize()
    
    /**
     * Checks the current login state by querying the server.
     * This is the method called by main.js to check login status.
     * It's also used internally by initialize().
     */
    async checkLoginState() {
        console.log("[AuthHandler] Checking login state via /api/auth/me...");
        try {
            const data = await apiCall('/api/auth/me');
            this._updateAuthState(data.isLoggedIn, data.user); // Update state first

            if (this._loggedIn) { // Use internal state check
                console.log("[AuthHandler] User is already logged in. Triggering post-login actions.");
                this._onLoginSuccess(); // Call the updated function
            } else {
                console.log("[AuthHandler] User is not logged in. Showing login modal.");
                this._showModal('login-modal');
            }
            return this._loggedIn; // Return current login state
        } catch (error) {
             console.error("[AuthHandler] Error checking login state:", error);
             if (error.message.includes('Network error')) {
                 alert("Could not connect to the server to check login status. Please ensure the server is running and refresh the page.");
                 document.body.innerHTML = `<h2 style='color: orange; text-align: center; margin-top: 50px;'>Error connecting to server. Please try again later.</h2>`;
             } else {
                 alert(`An error occurred checking login status: ${error.message}`);
                 this._updateAuthState(false, null);
                 this._showModal('login-modal');
             }
             return false; // Return false on error
        }
    }

} // End AuthHandler Class

// No instantiation or DOMContentLoaded listener here.
// main.js handles creating the instance and calling initialize().

// Expose AuthHandler class to the global window object
window.AuthHandler = AuthHandler;
// Ensure apiCall is also available globally
window.apiCall = apiCall;

console.log("AuthHandler class defined (auth.js). Global apiCall function available.");