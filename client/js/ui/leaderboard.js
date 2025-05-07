// client/js/ui/leaderboard.js

/**
 * Leaderboard UI handler for Robot Wars
 * Displays global player statistics and rankings.
 */
class Leaderboard {
    constructor() {
        this.leaderboardContainer = document.getElementById('leaderboard-container');
        this.pvpLeaderboardElement = null;
        this.botLeaderboardElement = null;
        this.codeLeaderboardElement = null;
        
        if (!this.leaderboardContainer) {
            console.error("Leaderboard container element '#leaderboard-container' not found!");
        } else {
            this.createLeaderboardElements();
            console.log('Leaderboard initialized');
        }
    }

    /** Create the structure for the different leaderboard sections */
    createLeaderboardElements() {
        if (!this.leaderboardContainer) return;

        // PvP Leaderboard
        this.pvpLeaderboardElement = document.createElement('div');
        this.pvpLeaderboardElement.id = 'pvp-leaderboard';
        this.pvpLeaderboardElement.className = 'leaderboard-section';
        
        const pvpTitle = document.createElement('h5');
        pvpTitle.textContent = 'PvP Rankings';
        pvpTitle.className = 'leaderboard-title';
        
        this.pvpLeaderboardElement.appendChild(pvpTitle);
        this.pvpLeaderboardElement.appendChild(document.createElement('div'));
        this.leaderboardContainer.appendChild(this.pvpLeaderboardElement);

        // Test Bot Leaderboard
        this.botLeaderboardElement = document.createElement('div');
        this.botLeaderboardElement.id = 'bot-leaderboard';
        this.botLeaderboardElement.className = 'leaderboard-section';
        
        const botTitle = document.createElement('h5');
        botTitle.textContent = 'Test Bot Rankings';
        botTitle.className = 'leaderboard-title';
        
        this.botLeaderboardElement.appendChild(botTitle);
        this.botLeaderboardElement.appendChild(document.createElement('div'));
        this.leaderboardContainer.appendChild(this.botLeaderboardElement);

        // Code Efficiency Leaderboard
        this.codeLeaderboardElement = document.createElement('div');
        this.codeLeaderboardElement.id = 'code-leaderboard';
        this.codeLeaderboardElement.className = 'leaderboard-section';
        
        const codeTitle = document.createElement('h5');
        codeTitle.textContent = 'Code Efficiency';
        codeTitle.className = 'leaderboard-title';
        
        this.codeLeaderboardElement.appendChild(codeTitle);
        this.codeLeaderboardElement.appendChild(document.createElement('div'));
        this.leaderboardContainer.appendChild(this.codeLeaderboardElement);
    }

    /**
     * Updates the PvP leaderboard with player vs player statistics
     * @param {Array<object>} stats - Array of player stats sorted by rank
     */
    updatePvPLeaderboard(stats) {
        if (!this.pvpLeaderboardElement) return;
        
        const tableContainer = this.pvpLeaderboardElement.querySelector('div');
        tableContainer.innerHTML = '';
        
        if (!Array.isArray(stats) || stats.length === 0) {
            tableContainer.textContent = 'No PvP stats available yet.';
            return;
        }
        
        const table = document.createElement('table');
        table.className = 'leaderboard-table';
        
        // Create header row
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['Rank', 'Player', 'W/L', 'K/D', 'Games'];
        
        headers.forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Create body with player stats
        const tbody = document.createElement('tbody');
        
        stats.forEach((player, index) => {
            const row = document.createElement('tr');
            
            // Rank cell
            const rankCell = document.createElement('td');
            rankCell.textContent = (index + 1);
            rankCell.className = 'rank-cell';
            if (index < 3) rankCell.classList.add(`rank-${index + 1}`);
            
            // Player name cell
            const nameCell = document.createElement('td');
            nameCell.textContent = player.username;
            
            // Win/Loss cell
            const wlCell = document.createElement('td');
            wlCell.textContent = `${player.wins}/${player.losses}`;
            
            // K/D cell
            const kdCell = document.createElement('td');
            kdCell.textContent = player.kd_ratio.toFixed(2);
            
            // Games cell
            const gamesCell = document.createElement('td');
            gamesCell.textContent = player.total_games;
            
            row.appendChild(rankCell);
            row.appendChild(nameCell);
            row.appendChild(wlCell);
            row.appendChild(kdCell);
            row.appendChild(gamesCell);
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        tableContainer.appendChild(table);
    }
    
    /**
     * Updates the Bot leaderboard with player vs test bot statistics
     * @param {Array<object>} stats - Array of bot stats sorted by rank
     */
    updateBotLeaderboard(stats) {
        if (!this.botLeaderboardElement) return;
        
        const tableContainer = this.botLeaderboardElement.querySelector('div');
        tableContainer.innerHTML = '';
        
        if (!Array.isArray(stats) || stats.length === 0) {
            tableContainer.textContent = 'No bot challenge stats available yet.';
            return;
        }
        
        const table = document.createElement('table');
        table.className = 'leaderboard-table';
        
        // Create header row
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['Rank', 'Player', 'Wins', 'Bot'];
        
        headers.forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Create body with player stats
        const tbody = document.createElement('tbody');
        
        stats.forEach((player, index) => {
            const row = document.createElement('tr');
            
            // Rank cell
            const rankCell = document.createElement('td');
            rankCell.textContent = (index + 1);
            rankCell.className = 'rank-cell';
            if (index < 3) rankCell.classList.add(`rank-${index + 1}`);
            
            // Player name cell
            const nameCell = document.createElement('td');
            nameCell.textContent = player.username;
            
            // Wins cell
            const winsCell = document.createElement('td');
            winsCell.textContent = player.bot_wins;
            
            // Bot type cell
            const botCell = document.createElement('td');
            botCell.textContent = player.preferred_bot || 'Various';
            
            row.appendChild(rankCell);
            row.appendChild(nameCell);
            row.appendChild(winsCell);
            row.appendChild(botCell);
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        tableContainer.appendChild(table);
    }
    
    /**
     * Updates the Code Efficiency leaderboard with code length stats
     * @param {Array<object>} stats - Array of code stats sorted by rank
     */
    updateCodeLeaderboard(stats) {
        if (!this.codeLeaderboardElement) return;
        
        const tableContainer = this.codeLeaderboardElement.querySelector('div');
        tableContainer.innerHTML = '';
        
        if (!Array.isArray(stats) || stats.length === 0) {
            tableContainer.textContent = 'No code efficiency stats available yet.';
            return;
        }
        
        const table = document.createElement('table');
        table.className = 'leaderboard-table';
        
        // Create header row
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['Rank', 'Player', 'Lines', 'Wins'];
        
        headers.forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Create body with player stats
        const tbody = document.createElement('tbody');
        
        stats.forEach((player, index) => {
            const row = document.createElement('tr');
            
            // Rank cell
            const rankCell = document.createElement('td');
            rankCell.textContent = (index + 1);
            rankCell.className = 'rank-cell';
            if (index < 3) rankCell.classList.add(`rank-${index + 1}`);
            
            // Player name cell
            const nameCell = document.createElement('td');
            nameCell.textContent = player.username;
            
            // Lines cell
            const linesCell = document.createElement('td');
            linesCell.textContent = player.code_lines;
            
            // Wins cell
            const winsCell = document.createElement('td');
            winsCell.textContent = player.wins;
            
            row.appendChild(rankCell);
            row.appendChild(nameCell);
            row.appendChild(linesCell);
            row.appendChild(winsCell);
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        tableContainer.appendChild(table);
    }

    /**
     * Updates all leaderboard sections with the latest data from the server
     * @param {object} leaderboardData - Object containing all leaderboard data arrays
     */
    updateAllLeaderboards(leaderboardData) {
        if (leaderboardData.pvpStats) {
            this.updatePvPLeaderboard(leaderboardData.pvpStats);
        }
        
        if (leaderboardData.botStats) {
            this.updateBotLeaderboard(leaderboardData.botStats);
        }
        
        if (leaderboardData.codeStats) {
            this.updateCodeLeaderboard(leaderboardData.codeStats);
        }
    }
}

// Expose the Leaderboard class to the global window object
window.Leaderboard = Leaderboard;

// Initialize leaderboard when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Ensure the leaderboard object is created and attached to window for global access
    window.leaderboard = new Leaderboard();
});