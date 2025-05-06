/**
 * particle-system-integration.js
 * 
 * This file provides integration between the new ParticleSystem class and the existing
 * game and arena rendering systems.
 */

/**
 * Initialize the integration with the particle system
 * @param {Arena} arena - The arena instance
 * @param {Game} game - The game instance
 */
function initializeParticleSystemIntegration(arena, game) {
    if (!window.particleSystem) {
        console.warn('ParticleSystem not found, particle effects will use legacy system');
        return;
    }
    
    console.log('Initializing ParticleSystem integration');
    
    // Add render method to Arena if not already patched
    if (!arena.renderParticleSystem) {
        arena.renderParticleSystem = function(ctx) {
            // Set canvas dimensions in particle system for boundary checks
            window.particleSystem.width = this.width;
            window.particleSystem.height = this.height;
            
            // Render all particle effects
            window.particleSystem.render(ctx);
        };
        
        // Patch the main draw method to include particle system rendering
        const originalDraw = arena.draw;
        arena.draw = function(...args) {
            // Call the original draw method with all arguments
            originalDraw.apply(this, args);
            
            // Render particle system on top
            this.renderParticleSystem(this.ctx);
        };
        
        console.log('Arena.draw successfully patched to include particle system rendering');
    }
    
    // Add methods to Game to create specific particle effects
    if (!game.createExplosionEffect) {
        game.createExplosionEffect = function(x, y, size = 1.0) {
            if (window.particleSystem) {
                window.particleSystem.createExplosion(x, y, size);
            } else {
                // Fallback to old particle system
                const particleEffect = this.createParticleExplosion(x, y);
                this.activeParticleEffects.push(particleEffect);
            }
        };
        
        console.log('Game.createExplosionEffect added');
    }
    
    if (!game.createMissileTrailEffect) {
        game.createMissileTrailEffect = function(missile) {
            if (window.particleSystem && missile) {
                window.particleSystem.createMissileTrail(missile, missile.type || 'standard');
            }
        };
        
        console.log('Game.createMissileTrailEffect added');
    }
    
    if (!game.createImpactEffect) {
        game.createImpactEffect = function(x, y, size = 0.5) {
            if (window.particleSystem) {
                // Create a smaller explosion with different parameters for impacts
                window.particleSystem.createEffect('impact', x, y, 15, {
                    size: { min: 3 * size, max: 7 * size },
                    lifetime: { min: 300, max: 500 },
                    speed: { min: 1, max: 3 }
                });
                
                // Add a few sparks
                window.particleSystem.createEffect('spark', x, y, 10, {
                    size: { min: 1, max: 3 },
                    lifetime: { min: 200, max: 400 },
                    speed: { min: 2, max: 4 }
                });
            }
        };
        
        console.log('Game.createImpactEffect added');
    }
    
    console.log('ParticleSystem integration completed successfully');
}

// Automatically initialize when both window.arena and window.game are available
function checkAndInitialize() {
    if (window.arena && window.game && window.particleSystem) {
        initializeParticleSystemIntegration(window.arena, window.game);
    }
}

// Try to initialize on script load
setTimeout(checkAndInitialize, 500); // Short delay to ensure dependencies are loaded

// Also initialize when window loads (as a fallback)
window.addEventListener('load', function() {
    setTimeout(checkAndInitialize, 1000);
});