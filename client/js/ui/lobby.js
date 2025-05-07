// client/js/ui/lobby.js

const MAX_LOG_MESSAGES = 50; // Keep the event log from getting too long
const MAX_ROBOT_LOG_MESSAGES = 100; // Allow more player robot messages
const MAX_OPPONENT_LOG_MESSAGES = 100; // Separate limit for opponent log

/**
 * Updates the text content of the lobby status display.
 * @param {string} statusText - The text to display.
 */
function updateLobbyStatus(statusText) {
    const statusElement = document.getElementById('lobby-status');
    if (statusElement) {
        statusElement.textContent = statusText;
    } else {
        console.warn("Lobby status element '#lobby-status' not found.");
    }
}

/**
 * Adds a message to the event log display. Handles scrolling.
 * @param {string} message - The message text to add.
 * @param {string} [type='info'] - The type of message ('info', 'chat', 'event', 'error'). Used for potential styling.
 */
function addEventLogMessage(message, type = 'info') {
    const logElement = document.getElementById('event-log');
    if (!logElement) {
        console.warn("Event log element '#event-log' not found.");
        return;
    }

    const wasScrolledToBottom = logElement.scrollHeight - logElement.clientHeight <= logElement.scrollTop + 1;

    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;

    // Add styling based on type (optional)
    messageDiv.style.marginBottom = '3px';
    messageDiv.style.wordWrap = 'break-word'; // Prevent long messages overflowing
    switch (type) {
        case 'chat':
            messageDiv.style.color = '#FFF'; // White for chat
            break;
        case 'event':
            messageDiv.style.color = '#87CEEB'; // Sky blue for events
            break;
        case 'error':
            messageDiv.style.color = '#FF6347'; // Tomato red for errors
            break;
        case 'info':
        default:
            messageDiv.style.color = '#90EE90'; // Light green for general info
            break;
    }

    logElement.appendChild(messageDiv);

    // Remove old messages if log is too long
    while (logElement.childNodes.length > MAX_LOG_MESSAGES) {
        logElement.removeChild(logElement.firstChild);
    }

    // Auto-scroll to bottom if already scrolled to bottom
    if (wasScrolledToBottom) {
        logElement.scrollTop = logElement.scrollHeight;
    }
}

/**
 * Clears all messages from the event log.
 */
function clearEventLog() {
     const logElement = document.getElementById('event-log');
     if (logElement) {
         logElement.innerHTML = ''; // Clear content
         addEventLogMessage("Event Log cleared.", "info");
     }
}


// --- START: Player Robot Console Log ---
/**
 * Adds a message to the player's console log display. Handles scrolling.
 * @param {string} message - The message text from the player's robot console.log.
 */
function addRobotLogMessage(message) {
    const logElement = document.getElementById('robot-log-messages'); // Target player element
    if (!logElement) {
        console.warn("Robot log messages element '#robot-log-messages' not found.");
        return;
    }
    // Scroll check
    const wasScrolledToBottom = logElement.scrollHeight - logElement.clientHeight <= logElement.scrollTop + 1;

    // Create and style message div
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.marginBottom = '2px'; // Tighter spacing

    logElement.appendChild(messageDiv);

    // Remove old messages
    while (logElement.childNodes.length > MAX_ROBOT_LOG_MESSAGES) {
        logElement.removeChild(logElement.firstChild);
    }
    // Auto-scroll
    if (wasScrolledToBottom) {
        logElement.scrollTop = logElement.scrollHeight;
    }
}

/** Clears the player's robot console log */
function clearRobotLog() {
     const logElement = document.getElementById('robot-log-messages');
     if (logElement) {
         logElement.innerHTML = '';
         // Add thematic cleared message
         addRobotLogMessage("--- R.O.S. V1.3 REINITIALIZED ---");
     }
}
// --- END: Player Robot Console Log ---


// --- START: Opponent Robot Console Log ---
/**
 * Adds a message to the opponent's console log display. Handles scrolling.
 * @param {string} message - The message text from the opponent's robot console.log.
 */
function addOpponentLogMessage(message) {
    const logElement = document.getElementById('opponent-log-messages'); // Target opponent element
    if (!logElement) {
        console.warn("Opponent log messages element '#opponent-log-messages' not found.");
        return;
    }
    // Scroll check
    const wasScrolledToBottom = logElement.scrollHeight - logElement.clientHeight <= logElement.scrollTop + 1;

    // Create and style message div
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.marginBottom = '2px'; // Match player log spacing

    logElement.appendChild(messageDiv);

    // Remove old messages
    while (logElement.childNodes.length > MAX_OPPONENT_LOG_MESSAGES) { // Use separate limit
        logElement.removeChild(logElement.firstChild);
    }
    // Auto-scroll
    if (wasScrolledToBottom) {
        logElement.scrollTop = logElement.scrollHeight;
    }
}

/** Clears the opponent's robot console log */
function clearOpponentLog() {
     const logElement = document.getElementById('opponent-log-messages');
     if (logElement) {
         logElement.innerHTML = '';
         // Add thematic cleared message
         addOpponentLogMessage("--- OPPONENT SIGNAL LOST ---");
     }
}
// --- END: Opponent Robot Console Log ---


// --- Make functions globally accessible ---
window.updateLobbyStatus = updateLobbyStatus;
window.addEventLogMessage = addEventLogMessage;
window.clearEventLog = clearEventLog;
window.addRobotLogMessage = addRobotLogMessage; // Player log
window.clearRobotLog = clearRobotLog;           // Player log clear
window.addOpponentLogMessage = addOpponentLogMessage; // Opponent log ADDED
window.clearOpponentLog = clearOpponentLog;           // Opponent log clear ADDED


// --- Initialize Chat Input/Button Listeners & Clear Placeholders ---
document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-chat');

    if (chatInput && sendButton) {
         sendButton.addEventListener('click', sendChatMessageFromInput);
         chatInput.addEventListener('keypress', (event) => {
             if (event.key === 'Enter') {
                 event.preventDefault(); // Prevent default form submission (if any)
                 sendChatMessageFromInput();
             }
         });
    } else {
        console.warn("Chat input or send button not found.");
    }

    function sendChatMessageFromInput() {
        const messageText = chatInput.value;
        // Ensure network object exists and has the method before calling
        if (messageText.trim() && typeof network !== 'undefined' && network.sendChatMessage) {
            network.sendChatMessage(messageText); // Assumes global 'network' object exists
            chatInput.value = ''; // Clear input field after sending
        } else if (typeof network === 'undefined' || !network.sendChatMessage) {
             console.error("Network object or sendChatMessage method not available.");
             // Optionally inform user via event log
             // addEventLogMessage("Error: Cannot send chat message.", "error");
        }
         chatInput.focus(); // Keep focus on input
    }


    // --- Clear placeholder text on initial load for ALL logs ---
    const eventLogElement = document.getElementById('event-log');
    // Check for the specific placeholder text before clearing
    if(eventLogElement && eventLogElement.textContent.trim() === 'Event Log Loading...') {
         eventLogElement.innerHTML = ''; // Clear content directly
         addEventLogMessage("Welcome! Connect to chat and wait for players...", "info");
    }

    const robotLogElement = document.getElementById('robot-log-messages');
     // Check for the specific placeholder text before clearing
    if (robotLogElement && robotLogElement.textContent.trim() === 'Waiting for robot messages...') {
        robotLogElement.innerHTML = ''; // Clear placeholder
        // --- START: Add Thematic Message ---
        addRobotLogMessage("ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL");
        addRobotLogMessage("ENTER PASSWORD NOW");
        addRobotLogMessage(" "); // Blank line
        addRobotLogMessage("> R.O.S. V1.3 INITIALIZING...");
        // --- END: Add Thematic Message ---
    }

    // ADDED: Clear opponent log placeholder
    const opponentLogElement = document.getElementById('opponent-log-messages');
    if (opponentLogElement && opponentLogElement.textContent.trim() === 'Waiting for opponent messages...') {
        opponentLogElement.innerHTML = ''; // Clear placeholder
        addOpponentLogMessage("SCANNING FOR HOSTILE TRANSMISSIONS...");
        addOpponentLogMessage("...");
        addOpponentLogMessage("...");
        addOpponentLogMessage("> STANDING BY");
    }
    // --- End Placeholder Clearing ---
});

// Expose lobby functions to the global window object
window.updateLobbyStatus = updateLobbyStatus;
window.addEventLogMessage = addEventLogMessage;
window.addRobotLogMessage = addRobotLogMessage; 
window.addOpponentLogMessage = addOpponentLogMessage;
window.clearRobotLog = clearRobotLog;
window.clearOpponentLog = clearOpponentLog;

console.log("Lobby UI functions initialized (lobby.js). Includes Player AND Opponent Log handlers.");