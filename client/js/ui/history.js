// client/js/ui/history.js

/**
 * Updates the game history log display on the page.
 * @param {Array<object>} historyArray - An array of completed game objects from the server,
 *                                      expected format: [{name, winnerName, players, endTime}, ...]
 *                                      (Assumed to be sorted newest first by the server)
 */
function updateGameHistory(historyArray) {
    const historyListElement = document.getElementById('game-history-list');

    if (!historyListElement) {
        console.warn("Game history list element '#game-history-list' not found.");
        return;
    }

    // Clear previous history entries
    historyListElement.innerHTML = '';

    if (!Array.isArray(historyArray) || historyArray.length === 0) {
        const noHistoryDiv = document.createElement('div');
        noHistoryDiv.textContent = 'No games finished yet.';
        historyListElement.appendChild(noHistoryDiv);
        return;
    }

    // Use a document fragment for potentially better performance
    const fragment = document.createDocumentFragment();

    historyArray.forEach(gameResult => {
        const entryDiv = document.createElement('div');
        // Format the output string
        const winnerText = gameResult.winnerName ? gameResult.winnerName : 'None';
        entryDiv.textContent = `Game '${gameResult.name || 'Unknown'}' finished. Winner: ${winnerText}`;
        // You could add more details here, like players involved, using gameResult.players

        fragment.appendChild(entryDiv);
    });

    // Append the populated fragment to the list element
    historyListElement.appendChild(fragment);
}

// Make the function globally accessible
window.updateGameHistory = updateGameHistory;

console.log("History UI functions initialized (history.js).");

// Initial clear or placeholder (optional, CSS handles initial state)
// document.addEventListener('DOMContentLoaded', () => {
//     updateGameHistory([]); // Clear on load
// });