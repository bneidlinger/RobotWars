/**
 * arena-particle-patch.js
 * 
 * This file patches the Arena.draw method to incorporate the new particle system.
 * It uses monkey patching to add functionality without modifying the original file.
 */

// Wait for both Arena class and particleSystem to be available
document.addEventListener('DOMContentLoaded', function() {
    // Check every 100ms until the necessary objects are available
    const checkInterval = setInterval(function() {
        if (window.arena && window.particleSystem) {
            applyArenaPatch();
            clearInterval(checkInterval);
        }
    }, 100);
    
    // Also try once when window loads (fallback)
    window.addEventListener('load', function() {
        if (window.arena && window.particleSystem) {
            applyArenaPatch();
        }
    });
});

/**
 * Apply monkey patch to Arena.draw method
 */
function applyArenaPatch() {
    console.log('[Particle System] Patching Arena.draw method...');
    
    // Store reference to the original draw method
    const originalDraw = Arena.prototype.draw;
    
    // Replace with our enhanced version
    Arena.prototype.draw = function(...args) {
        // Call the original draw method with all arguments
        originalDraw.apply(this, args);
        
        // Now render the particle system on top
        if (window.particleSystem) {
            try {
                // Save context state
                this.ctx.save();
                
                // Render particle effects
                window.particleSystem.render(this.ctx);
                
                // Restore context state
                this.ctx.restore();
            } catch (e) {
                console.error('[Particle System] Error rendering particle effects:', e);
            }
        }
    };
    
    console.log('[Particle System] Arena.draw method successfully patched');
    
    // Also patch the instance if it exists
    if (window.arena && window.arena.draw) {
        window.arena.draw = Arena.prototype.draw;
    }
}