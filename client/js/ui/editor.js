// client/js/ui/editor.js

let editor;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize CodeMirror editor
    try {
        editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
            mode: 'javascript',
            theme: 'monokai',
            lineNumbers: true,
            indentUnit: 4,
            autoCloseBrackets: true,
            matchBrackets: true
        });

        // --- START: Improved Default Code Loading ---
        const defaultSnippetName = 'Simple Tank';
        let defaultCode = `// Default code if snippet/storage fails\nconsole.log("Default Code Active");\nrobot.drive(0,0);`; // Basic Fallback

        // Attempt to load the default snippet directly from LocalStorageManager defaults
        if (typeof LocalStorageManager !== 'undefined') {
            try {
                 const storageManager = new LocalStorageManager(); // Instance to access defaults
                 // Access the defaultSnippets property directly
                 if (storageManager.defaultSnippets && storageManager.defaultSnippets[defaultSnippetName]) {
                     defaultCode = storageManager.defaultSnippets[defaultSnippetName];
                     console.log(`Editor initialized with default snippet: ${defaultSnippetName}`);
                 } else {
                     // This case means the default wasn't defined in storage.js, which is a code issue
                     console.error(`Default snippet "${defaultSnippetName}" NOT DEFINED in LocalStorageManager. Using basic default.`);
                 }
            } catch (storageError) {
                 console.error("Error creating storage manager for default code:", storageError);
            }
        } else {
            console.warn("LocalStorageManager not available for default code loading.");
        }

        editor.setValue(defaultCode);
        // --- END: Improved Default Code Loading ---

    } catch(editorError) {
        console.error("FATAL: Failed to initialize CodeMirror editor:", editorError);
        alert("Error initializing the code editor. Please check the console.");
        const editorControls = document.querySelector('.editor-controls');
        if (editorControls) {
            Array.from(editorControls.children).forEach(el => el.disabled = true);
        }
    }

    // Removed event listener for #sample-code

}); // End DOMContentLoaded


// Function remains, uses storageManager defaults if available
function loadSampleCode(sampleName) {
    if (!editor) {
        console.error("Cannot load sample code: Editor not initialized.");
        return;
    }
    let code = '';
    let snippetsToUse = {};

    if (typeof LocalStorageManager !== 'undefined') {
        try {
            const storageManager = new LocalStorageManager();
            // Use the defined defaults property
            snippetsToUse = storageManager.defaultSnippets || {};
        } catch(e) {
            console.error("Error getting default snippets from storage manager", e);
        }
    } else {
         console.warn("LocalStorageManager not available to load sample code definitions.");
    }

    if (snippetsToUse[sampleName]) {
        code = snippetsToUse[sampleName];
    } else {
        console.warn(`Sample code definition for '${sampleName}' not found.`);
        code = `// Sample code '${sampleName}' not found.\nrobot.drive(0,0);`; // Provide fallback
    }

    if (code) {
        editor.setValue(code);
        if (window.addEventLogMessage) window.addEventLogMessage(`Loaded sample code: ${sampleName}`, 'info');
    }
}