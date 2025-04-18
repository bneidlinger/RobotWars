// client/js/ui/dashboard.js

/**
 * Dashboard UI handler for Robot Wars
 * Manages the stats panel display.
 */
class Dashboard {
    constructor() {
        this.statsPanel = document.getElementById('robot-stats');
        if (!this.statsPanel) {
            console.error("Dashboard stats panel element '#robot-stats' not found!");
        } else {
            console.log('Dashboard initialized');
        }
    }

    /**
     * Update robot stats display based on the provided robot data.
     * @param {Array<object>} robots - Array of robot data objects received from the server state.
     *                                  Each object should have id, name, damage, color, isAlive.
     */
    updateStats(robots) {
        // Guard against missing panel or invalid input
        if (!this.statsPanel || !Array.isArray(robots)) {
            // Optionally clear the panel if robots array is invalid/empty
            if (this.statsPanel) this.statsPanel.innerHTML = '<div>No robot data available.</div>';
            return;
        }

        let statsHTML = '';

        if (robots.length === 0) {
            statsHTML = '<div>Waiting for game to start...</div>';
        } else {
            robots.forEach(robot => {
                // Default values and checks for robustness
                const damageValue = (typeof robot.damage === 'number') ? robot.damage : 100; // Assume max damage if invalid
                const isAlive = robot.isAlive !== undefined ? robot.isAlive : (damageValue < 100); // Derive if needed

                const status = isAlive ? 'Active' : 'Destroyed';
                const statusColor = isAlive ? '#2ecc71' : '#e74c3c'; // Green for active, Red for destroyed

                // Safely get Robot Name or fallback to ID
                let robotIdDisplay = '????'; // Default if ID is missing/invalid
                if (robot.id && typeof robot.id === 'string') {
                    robotIdDisplay = robot.id.substring(0, 4); // Get first 4 chars of ID
                }
                const robotName = robot.name || `ID: ${robotIdDisplay}...`; // Use name or fallback ID display

                // Safely format damage percentage
                const damageDisplay = (typeof robot.damage === 'number') ? robot.damage.toFixed(0) : 'N/A';

                // Construct HTML for this robot's stats
                statsHTML += `
                    <div class="robot-stat" style="border-left: 3px solid ${robot.color || '#888'}; margin-bottom: 10px; padding: 5px;">
                        <div><strong>${robotName}</strong></div>
                        <div>Damage: ${damageDisplay}%</div>
                        <div>Status: <span style="color: ${statusColor}">${status}</span></div>
                    </div>
                `;
            });
        }

        // Update the panel content
        this.statsPanel.innerHTML = statsHTML;
    }
}

// Initialize dashboard when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Ensure the dashboard object is created and attached to window for global access
    window.dashboard = new Dashboard();
    // Clear stats initially or show a waiting message
    if(window.dashboard) {
         window.dashboard.updateStats([]); // Pass empty array to show initial message
    }
});