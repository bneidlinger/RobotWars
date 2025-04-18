/**
 * Dashboard UI handler for Robot Wars
 * Manages the stats panel and other UI elements
 */
class Dashboard {
    constructor() {
        this.statsPanel = document.getElementById('robot-stats');
        console.log('Dashboard initialized');
    }

    /**
     * Update robot stats display
     * @param {Array} robots - Array of robot objects
     */
    updateStats(robots) {
        let statsHTML = '';

        robots.forEach(robot => {
            const status = robot.damage >= 100 ? 'Destroyed' : 'Active';
            const statusColor = robot.damage >= 100 ? '#e74c3c' : '#2ecc71';

            statsHTML += `
                <div class="robot-stat" style="border-left: 3px solid ${robot.color}; margin-bottom: 10px; padding: 5px;">
                    <div>Robot ${robot.id}</div>
                    <div>Damage: ${robot.damage.toFixed(0)}%</div>
                    <div>Status: <span style="color: ${statusColor}">${status}</span></div>
                </div>
            `;
        });

        this.statsPanel.innerHTML = statsHTML;
    }
}

// Initialize dashboard when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});