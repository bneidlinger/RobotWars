// client/js/ui/editor.js

let editor;

document.addEventListener('DOMContentLoaded', () => {
    // --- START: Define Default Code Directly ---
    const defaultCode = `// Simple Tank Bot (using state object)
// Moves in a straight line until hit, then changes direction

// Initialize state ONCE
if (typeof state.currentDirection === 'undefined') {
    state.currentDirection = 0;
    state.lastDamage = 0; // Track damage from previous tick
    console.log('Simple Tank Initialized');
}

// Check if damage increased since last tick
if (robot.damage() > state.lastDamage) {
    console.log('Tank hit! Changing direction.');
    state.currentDirection = (state.currentDirection + 90 + Math.random() * 90) % 360;
}
state.lastDamage = robot.damage(); // Update damage tracking

// Move forward
robot.drive(state.currentDirection, 3);

// Scan for enemies - use 'let' for temporary variable
let scanResult = robot.scan(state.currentDirection, 45);

// Fire if enemy detected
if (scanResult) {
    robot.fire(scanResult.direction, 2);
}`;
    // --- END: Define Default Code Directly ---


    // Initialize CodeMirror editor
    try {
        editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
            mode: 'javascript',
            theme: 'monokai',
            lineNumbers: true,
            indentUnit: 4,
            autoCloseBrackets: true,
            matchBrackets: true,
            viewportMargin: Infinity, // Ensures CodeMirror renders all content even when not visible
            scrollbarStyle: 'native' // Ensures native scrollbars are used
        });

        // Set the default code defined above
        editor.setValue(defaultCode);
        console.log(`Editor initialized with built-in default code.`);


    } catch(editorError) {
        console.error("FATAL: Failed to initialize CodeMirror editor:", editorError);
        alert("Error initializing the code editor. Please check the console.");
        const editorControls = document.querySelector('.editor-controls');
        if (editorControls) {
            Array.from(editorControls.children).forEach(el => el.disabled = true);
        }
    }

}); // End DOMContentLoaded


// Sample code loading can be removed or kept if you define samples differently later
// function loadSampleCode(sampleName) { ... } // Keep or remove as needed