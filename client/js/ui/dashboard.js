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
    updateStats(robots) { // robots array now includes 'name'
    let statsHTML = '';
    if (!this.statsPanel) return; // Guard if panel not found

    robots.forEach(robot => {
        const status = robot.damage >= 100 ? 'Destroyed' : 'Active';
        const statusColor = robot.damage >= 100 ? '#e74c3c' : '#2ecc71';
        const robotName = robot.name || `ID: ${robot.id.substring(0,4)}...`; // Use name, fallback to partial ID

        statsHTML += `
            <div class="robot-stat" style="border-left: 3px solid ${robot.color || '#888'}; margin-bottom: 10px; padding: 5px;">
                <div><strong>${robotName}</strong></div> {/* Display name */}
                <div>Damage: ${robot.damage !== undefined ? robot.damage.toFixed(0) : 'N/A'}%</div>
                <div>Status: <span style="color: ${statusColor}">${status}</span></div>
            </div>
        `;
    });
    this.statsPanel.innerHTML = statsHTML;
}

// Initialize dashboard when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});