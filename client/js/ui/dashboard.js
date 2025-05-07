// client/js/ui/dashboard.js

/**
 * Dashboard UI handler for Robot Wars
 * Manages the stats panel display.
 */
class Dashboard {
    constructor() {
        this.statsPanel = document.getElementById('robot-stats');
        this.gameTitleElement = null; // Element to display game name (optional)
        this.statsContainer = null; // Container for the actual robot stats divs

        // Try to find/create a title element and stats container within the panel
        this.createLayoutElements();

        if (!this.statsPanel) {
            console.error("Dashboard stats panel element '#robot-stats' not found!");
        } else {
            console.log('Dashboard initialized');
        }
    }

    /** Create or find the elements for title and stats list */
    createLayoutElements() {
        if (!this.statsPanel) return;

        // Title Element
        this.gameTitleElement = document.getElementById('dashboard-game-title');
        if (!this.gameTitleElement) {
            this.gameTitleElement = document.createElement('div');
            this.gameTitleElement.id = 'dashboard-game-title';
            // Style the title element (adjust as needed)
            this.gameTitleElement.style.fontWeight = 'bold';
            this.gameTitleElement.style.marginBottom = '10px';
            this.gameTitleElement.style.paddingBottom = '5px';
            this.gameTitleElement.style.borderBottom = '1px solid #555';
            this.gameTitleElement.style.color = '#4CAF50'; // Match theme accent
            this.gameTitleElement.style.fontFamily = "'VT323', monospace"; // Use retro font
            this.gameTitleElement.style.fontSize = '18px'; // Adjust size
            this.gameTitleElement.style.display = 'none'; // Hidden initially
            // Prepend it to the stats panel
            this.statsPanel.insertBefore(this.gameTitleElement, this.statsPanel.firstChild);
        }

        // Stats Container Element
        this.statsContainer = document.getElementById('robot-stats-list');
        if (!this.statsContainer) {
            this.statsContainer = document.createElement('div');
            this.statsContainer.id = 'robot-stats-list';
            // Append it after the title (or as the only child if title failed)
            this.statsPanel.appendChild(this.statsContainer);
        }
    }

    /**
     * Update robot stats display based on the provided robot data.
     * @param {Array<object>} robots - Array of robot data objects received from the server state.
     *                                  Each object should have id, name, damage, color, isAlive.
     * @param {object} [context={}] - Optional context object (e.g., { gameName }).
     */
    updateStats(robots, context = {}) {
        // Ensure container exists
        if (!this.statsContainer) {
            console.warn("Stats container not found in dashboard.");
            return;
        }

        // Update Game Title display
        if (this.gameTitleElement) {
            const showTitle = context.gameName && robots && robots.length > 0;
            this.gameTitleElement.textContent = showTitle ? `Stats for: ${context.gameName}` : '';
            this.gameTitleElement.style.display = showTitle ? '' : 'none';
        }

        // Clear previous stats from the container
        this.statsContainer.innerHTML = ''; // Simple way to clear children

        // Guard against invalid input
        if (!Array.isArray(robots)) {
            const noDataDiv = document.createElement('div');
            noDataDiv.textContent = 'Invalid robot data received.';
            this.statsContainer.appendChild(noDataDiv);
            return;
        }

        // --- Efficient DOM Update ---
        // Use a fragment to minimize reflows when adding multiple stats
        const fragment = document.createDocumentFragment();

        if (robots.length === 0) {
            const waitingDiv = document.createElement('div');
            waitingDiv.textContent = context.gameName ? 'Game ended or no robots active.' : 'Waiting for game to start...';
            fragment.appendChild(waitingDiv);
        } else {
            robots.forEach(robot => {
                // Default values and checks for robustness
                const damageValue = (typeof robot.damage === 'number') ? robot.damage : 100;
                const isAlive = robot.isAlive !== undefined ? robot.isAlive : (damageValue < 100);

                const status = isAlive ? 'Active' : 'Destroyed';
                const statusColor = isAlive ? '#2ecc71' : '#e74c3c';

                let robotIdDisplay = '????';
                if (robot.id && typeof robot.id === 'string') {
                    robotIdDisplay = robot.id.substring(0, 4);
                }
                const robotName = robot.name || `ID: ${robotIdDisplay}...`;

                const damageDisplay = (typeof robot.damage === 'number') ? robot.damage.toFixed(0) : 'N/A';

                // Create elements for this robot's stats
                const statDiv = document.createElement('div');
                statDiv.className = 'robot-stat'; // Add class for potential CSS styling
                statDiv.style.borderLeft = `3px solid ${robot.color || '#888'}`;
                statDiv.style.marginBottom = '10px';
                statDiv.style.padding = '5px';
                // Ensure consistent font for stats
                statDiv.style.fontFamily = "'VT323', monospace";
                statDiv.style.fontSize = '16px'; // Adjust as needed

                const nameDiv = document.createElement('div');
                const nameStrong = document.createElement('strong');
                nameStrong.textContent = robotName;
                nameDiv.appendChild(nameStrong);

                const damageDiv = document.createElement('div');
                damageDiv.textContent = `Damage: ${damageDisplay}%`;

                const statusDiv = document.createElement('div');
                const statusSpan = document.createElement('span');
                statusSpan.style.color = statusColor;
                statusSpan.textContent = status;
                statusDiv.appendChild(document.createTextNode('Status: '));
                statusDiv.appendChild(statusSpan);

                statDiv.appendChild(nameDiv);
                statDiv.appendChild(damageDiv);
                statDiv.appendChild(statusDiv);

                fragment.appendChild(statDiv);
            });
        }

        // Append the fragment containing new stats to the dedicated container
        this.statsContainer.appendChild(fragment);
    }
}

// Expose the Dashboard class to the global window object
window.Dashboard = Dashboard;

// Initialize dashboard when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Ensure the dashboard object is created and attached to window for global access
    window.dashboard = new Dashboard();
    // Clear stats initially or show a waiting message
    if(window.dashboard) {
         window.dashboard.updateStats([], {}); // Pass empty array and context
    }
});