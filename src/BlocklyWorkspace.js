import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom'; // <-- 1. IMPORTED
import * as Blockly from 'blockly';
import { Xml } from 'blockly/core'; // <--- CORRECT IMPORT ADDED
import { pythonGenerator } from 'blockly/python';
import 'blockly/blocks';
import 'blockly/javascript';
import 'blockly/python';
import './BlocklyWorkspace.css';

// Define global constants
const WORKSPACE_STORAGE_KEY = 'codeblocking_workspace';

// --- START: RAPIDAPI CONFIGURATION ---
// Read values from environment variables
// Ensure your .env file has REACT_APP_RAPIDAPI_KEY, REACT_APP_RAPIDAPI_HOST, and REACT_APP_RAPIDAPI_ENDPOINT defined
const RAPIDAPI_KEY = process.env.REACT_APP_RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.REACT_APP_RAPIDAPI_HOST;
const RAPIDAPI_ENDPOINT = process.env.REACT_APP_RAPIDAPI_ENDPOINT;
// --- END: RAPIDAPI CONFIGURATION ---


// Define all standard Blockly blocks and custom generators
const defineAllBlocks = () => {
  // Custom Input Block
  Blockly.Blocks['python_input'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('input')
        .appendField(new Blockly.FieldTextInput('Enter text'), 'PROMPT');
      this.setOutput(true, 'String');
      this.setColour(160);
      this.setTooltip('Get user input from console');
    }
  };

  pythonGenerator['python_input'] = function(block) {
    const prompt = block.getFieldValue('PROMPT');
    return [`input(${JSON.stringify(prompt)})`, pythonGenerator.ORDER_ATOMIC];
  };

  // Custom Print Block
  Blockly.Blocks['text_print'] = {
    init: function() {
      this.appendValueInput('TEXT')
        .setCheck(null)
        .appendField('print');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip('Print text to console');
    }
  };

  pythonGenerator['text_print'] = function(block) {
    const text = pythonGenerator.valueToCode(block, 'TEXT', pythonGenerator.ORDER_NONE) || "''";
    return `print(${text})\n`;
  };

  // Custom HTTP Request Block
  Blockly.Blocks['python_http_request'] = {
    init: function() {
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([['GET', 'get'], ['POST', 'post']]), 'METHOD')
        .appendField('request URL');
      this.appendValueInput('URL').setCheck('String');
      this.setOutput(true, null);
      this.setColour(230);
      this.setTooltip('Makes an HTTP request');
    }
  };

  pythonGenerator['python_http_request'] = function(block) {
    // Ensure 'requests' import is added when this block is used
    pythonGenerator.definitions_['import_requests'] = 'import requests\n';
    const method = block.getFieldValue('METHOD');
    const url = pythonGenerator.valueToCode(block, 'URL', pythonGenerator.ORDER_ATOMIC) || "''";
    // Assuming JSON response for simplicity
    return [`requests.${method}(${url}).json()`, pythonGenerator.ORDER_ATOMIC];
  };

  // Custom File Read Block
  Blockly.Blocks['python_file_read'] = {
    init: function() {
      this.appendValueInput('FILENAME').setCheck('String').appendField('read file');
      this.setOutput(true, 'String');
      this.setColour(160);
      this.setTooltip('Read contents from a file');
    }
  };

  pythonGenerator['python_file_read'] = function(block) {
    const filename = pythonGenerator.valueToCode(block, 'FILENAME', pythonGenerator.ORDER_ATOMIC) || "''";
    // Using 'with' for safer file handling
    // return [`with open(${filename}, 'r') as f:\n  content = f.read()\n`, pythonGenerator.ORDER_ATOMIC];
    // Note: This generates a statement block; you might need to adjust how it fits if used as an output
    // A simpler, less safe version for direct output:
    return [`open(${filename}, 'r').read()`, pythonGenerator.ORDER_ATOMIC];
  };

  // Custom File Write Block
  Blockly.Blocks['python_file_write'] = {
    init: function() {
      this.appendValueInput('FILENAME').setCheck('String').appendField('write to file');
      this.appendValueInput('CONTENT').setCheck('String').appendField('content');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip('Write content to a file');
    }
  };

  pythonGenerator['python_file_write'] = function(block) {
    const filename = pythonGenerator.valueToCode(block, 'FILENAME', pythonGenerator.ORDER_ATOMIC) || "''";
    const content = pythonGenerator.valueToCode(block, 'CONTENT', pythonGenerator.ORDER_ATOMIC) || "''";
    // Using 'with' for safer file handling
    return `with open(${filename}, 'w') as f:\n  f.write(${content})\n`;
  };
};

// Initialize blocks when module loads
defineAllBlocks();

export default function BlocklyWorkspace() {
  const blocklyDiv = useRef();
  const workspace = useRef();
  const [output, setOutput] = useState('No output yet.');
  const [pythonCode, setPythonCode] = useState('// Code will appear here as you build with blocks');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation(); // <-- 2. GET LOCATION OBJECT

  // Toolbox configuration matching Blockly demo
  const toolboxCategories = {
    kind: 'categoryToolbox',
    contents: [
      {
        kind: 'category',
        name: 'Logic',
        colour: '%{BKY_LOGIC_HUE}',
        contents: [
          { kind: 'block', type: 'controls_if' },
          { kind: 'block', type: 'logic_compare' },
          { kind: 'block', type: 'logic_operation' },
          { kind: 'block', type: 'logic_negate' },
          { kind: 'block', type: 'logic_boolean' },
          { kind: 'block', type: 'logic_ternary' }
        ]
      },
      {
        kind: 'category',
        name: 'Loops',
        colour: '%{BKY_LOOPS_HUE}',
        contents: [
          { kind: 'block', type: 'controls_repeat_ext' },
          { kind: 'block', type: 'controls_whileUntil' },
          { kind: 'block', type: 'controls_for' },
          { kind: 'block', type: 'controls_flow_statements' }
        ]
      },
      {
        kind: 'category',
        name: 'Math',
        colour: '%{BKY_MATH_HUE}',
        contents: [
          { kind: 'block', type: 'math_number' },
          { kind: 'block', type: 'math_arithmetic' },
          { kind: 'block', type: 'math_single' },
          { kind: 'block', type: 'math_round' },
          { kind: 'block', type: 'math_modulo' },
          { kind: 'block', type: 'math_random_int' }
        ]
      },
      {
        kind: 'category',
        name: 'Text',
        colour: '%{BKY_TEXTS_HUE}',
        contents: [
          { kind: 'block', type: 'text' },
          { kind: 'block', type: 'text_join' },
          { kind: 'block', type: 'text_append' },
          { kind: 'block', type: 'text_length' },
          { kind: 'block', type: 'text_isEmpty' },
          { kind: 'block', type: 'text_print' } // Using custom print
        ]
      },
      {
        kind: 'category',
        name: 'Lists',
        colour: '%{BKY_LISTS_HUE}',
        contents: [
          { kind: 'block', type: 'lists_create_with' },
          { kind: 'block', type: 'lists_repeat' },
          { kind: 'block', type: 'lists_length' },
          { kind: 'block', type: 'lists_isEmpty' }
        ]
      },
      {
        kind: 'category',
        name: 'Variables',
        colour: '%{BKY_VARIABLES_HUE}',
        custom: 'VARIABLE'
      },
      {
        kind: 'category',
        name: 'Functions',
        colour: '%{BKY_PROCEDURES_HUE}',
        custom: 'PROCEDURE'
      },
      {
        kind: 'category',
        name: 'Advanced',
        colour: '%{BKY_MATH_HUE}', // Consider a different color
        contents: [
          { kind: 'block', type: 'python_input' },
          { kind: 'block', type: 'python_http_request' },
          { kind: 'block', type: 'python_file_read' },
          { kind: 'block', type: 'python_file_write' }
        ]
      }
    ]
  };

  const generateCode = useCallback(() => {
    if (workspace.current) {
      try {
        // Clear previous definitions to avoid duplication
        pythonGenerator.definitions_ = {};
        let code = pythonGenerator.workspaceToCode(workspace.current);

        // Prepend necessary imports gathered during code generation
        const imports = Object.values(pythonGenerator.definitions_).join('');
        code = imports + code;

        setPythonCode(code || '// Code will appear here as you build with blocks');
        return code;
      } catch (error) {
        console.error('Error generating code:', error);
        setPythonCode('// Error generating code');
        return '';
      }
    }
    return '';
  }, []); // Dependencies: ensure pythonGenerator is stable or included if needed

  const saveWorkspace = useCallback(() => {
    if (workspace.current) {
      try {
        const dom = Xml.workspaceToDom(workspace.current); // Use imported Xml
        const xmlText = Xml.domToText(dom);              // Use imported Xml
        localStorage.setItem(WORKSPACE_STORAGE_KEY, xmlText);
      } catch (error) {
        console.error('Error saving workspace:', error);
      }
    }
  }, []); // Dependencies: workspace ref

  // --- 3. ADDED: Function to load XML specifically ---
  const loadWorkspaceFromXml = useCallback((xmlText) => {
    if (xmlText && workspace.current) {
      try {
        const dom = Xml.textToDom(xmlText);
        workspace.current.clear(); // Clear existing blocks
        Xml.domToWorkspace(dom, workspace.current); // Load the new XML
        console.log('Loaded workspace from provided XML.');
      } catch (e) {
        console.error('Error loading workspace from XML:', e);
        setOutput('Error loading sample.');
      }
    }
  }, []); // workspace.current is stable

  // --- 4. RENAMED Your existing loadWorkspace function ---
  const loadWorkspaceFromStorage = useCallback(() => {
    const xmlText = localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (xmlText && workspace.current) {
      try {
        const dom = Xml.textToDom(xmlText);              // Use imported Xml
        workspace.current.clear(); // Clear existing blocks first
        Xml.domToWorkspace(dom, workspace.current); // Use imported Xml
      } catch (e) {
        console.error('Error loading workspace from local storage:', e);
        // localStorage.removeItem(WORKSPACE_STORAGE_KEY);
      }
    }
  }, []);

  // =================================================================
  // === MODIFIED runCode FUNCTION TO USE RAPIDAPI ===
  // =================================================================
  const runCode = async () => {
    // Check if API keys are configured
    if (!RAPIDAPI_KEY || !RAPIDAPI_HOST || !RAPIDAPI_ENDPOINT) {
        setOutput('Error: API credentials are not configured. Please check environment variables.');
        console.error('API credentials missing. Ensure REACT_APP_RAPIDAPI_KEY, REACT_APP_RAPIDAPI_HOST, and REACT_APP_RAPIDAPI_ENDPOINT are set.');
        return;
    }

    if (isLoading) return;

    const code = generateCode();
    setIsLoading(true);
    setOutput('Executing code via RapidAPI...');

    // This is the specific "request body" that onecompiler-apis expects.
    // We replace the hard-coded content with our user's code.
    const requestBody = {
      language: 'python',
      stdin: '', // The 'python_input' block won't work with this API yet.
      files: [
        {
          name: 'index.py',
          content: code // This is the code from your Blockly blocks
        }
      ]
    };

    try {
      const response = await fetch(RAPIDAPI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-key': RAPIDAPI_KEY,   // Read from process.env
          'x-rapidapi-host': RAPIDAPI_HOST, // Read from process.env
        },
        body: JSON.stringify(requestBody), // Send the correct object
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API error: ${response.status} ${response.statusText}. Details: ${errorBody}`);
      }

      const result = await response.json();

      // Log the result to your browser console to see its structure
      console.log('RapidAPI Result:', result);

      // This logic checks for the 'stdout' and 'stderr' fields,
      // which is what onecompiler-apis returns.
      if (result.stdout) {
        setOutput(result.stdout);
      } else if (result.stderr) {
        setOutput(`Error:\n${result.stderr}`);
      } else if (result.exception) { // This API also returns an 'exception' field
         setOutput(`Exception:\n${result.exception}`);
      } else {
        setOutput('Code ran, but the output format is not recognized. Check the browser console.');
      }

    } catch (e) {
      console.error("Execution failed:", e);
      setOutput(`Execution failed: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  // =================================================================
  // === END OF MODIFIED FUNCTION ===
  // =================================================================

  // TEMPORARY code inside BlocklyWorkspace.js to get XML
  const getWorkspaceXml = useCallback(() => {
    if (workspace.current) {
      try {
        const dom = Xml.workspaceToDom(workspace.current);
        const xmlText = Xml.domToText(dom);
        console.log("Current Workspace XML:\n", xmlText); // Log to console
        // You could also add a button to copy this to the clipboard
        navigator.clipboard.writeText(xmlText).then(() => {
           alert('Workspace XML copied to clipboard!');
        });
      } catch (error) {
        console.error('Error getting workspace XML:', error);
      }
    }
  }, []); // Empty dependency array


  const clearWorkspace = () => {
    if (workspace.current) {
      // Optional: Add a confirmation dialog
      // if (window.confirm('Are you sure you want to clear the workspace?')) {
      workspace.current.clear();
      // Wait for the clear event to process before generating code
      setTimeout(() => {
        generateCode(); // Update the code preview
        saveWorkspace(); // Save the empty state
        setOutput('Workspace cleared.');
      }, 0);
      // }
    }
  };

  const exportCode = () => {
    const code = generateCode(); // Ensure the latest code is generated
    if (!code || code.trim() === '' || code.startsWith('//')) {
      alert('No code to export.');
      return;
    }
    const blob = new Blob([code], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'codeblocking_code.py'; // More specific filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Safe workspace disposal
  const safeDispose = useCallback(() => {
    if (workspace.current) {
      try {
        // Manually remove listeners if addChangeListener was used
        // workspace.current.removeChangeListener(...); // Need the specific listener function reference if added manually

        workspace.current.dispose();
        workspace.current = null; // Clear the ref
      } catch (error) {
        console.warn('Error during workspace disposal:', error);
        workspace.current = null; // Ensure ref is cleared even on error
      }
    }
  }, []);

  // --- 5. REPLACED useEffect HOOK ---
  useEffect(() => {
    let primaryWorkspace; // Use a local variable for the instance

    if (!workspace.current && blocklyDiv.current) {
      try {
        primaryWorkspace = Blockly.inject(blocklyDiv.current, {
          toolbox: toolboxCategories,
          grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
          zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2 },
          move: { scrollbars: true, drag: true, wheel: false },
          trashcan: true,
          renderer: 'zelos', // Using a modern renderer
          theme: Blockly.Themes.Zelos // Example theme
        });
        workspace.current = primaryWorkspace; // Assign to ref after successful injection

        // --- NEW LOADING LOGIC ---
        const tutorialXmlToLoad = location.state?.loadXml;
        if (tutorialXmlToLoad) {
          // If we were navigated here from the tutorials page...
          loadWorkspaceFromXml(tutorialXmlToLoad);
          // Clear the state so refreshing the page reloads from local storage
          window.history.replaceState({}, document.title);
        } else {
          // Otherwise, load from local storage as usual
          loadWorkspaceFromStorage();
        }
        // --- END OF NEW LOGIC ---

        generateCode(); // Generate initial code based on loaded state

        // Add change listener for auto-update and save
        const changeListener = (event) => {
          // Ignore UI events like dragging blocks or opening the toolbox
          if (event.isUiEvent || event.type === Blockly.Events.FINISHED_LOADING) {
            return;
          }
          // Debounce or throttle these calls if performance becomes an issue
          generateCode();
          saveWorkspace();
        };
        primaryWorkspace.addChangeListener(changeListener);

      } catch (error) {
        console.error('Error initializing Blockly:', error);
        // Handle initialization error (e.g., show an error message to the user)
      }
    }

    // Cleanup function
    return () => {
      safeDispose(); // Use the safe disposal function
    };
  }, [loadWorkspaceFromStorage, loadWorkspaceFromXml, generateCode, saveWorkspace, safeDispose, location.state]); // Added all dependencies


  // JSX structure remains largely the same, ensure classNames match CSS
  return (
    <div className="workspace-container" style={{ // Use className for main container styling
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 60px)', // Adjust based on actual Navbar height
      fontFamily: "'Montserrat', sans-serif" // Apply consistent font
    }}>
      {/* Header with Controls */}
      <div className="workspace-controls" style={{ /* Keep inline styles or move to CSS */
        padding: '10px',
        borderBottom: '1px solid var(--border-color)', // Use CSS variable
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        backgroundColor: 'var(--console-bg)' // Use CSS variable
      }}>
        <button
          onClick={runCode}
          disabled={isLoading}
          className="btn btn-run" // Use classes for styling
        >
          {isLoading ? 'Running...' : 'Run Code'}
        </button>

        <button onClick={clearWorkspace} className="btn btn-clear">
          Clear
        </button>

        <button onClick={exportCode} className="btn btn-export">
          Export Python
        </button>

        {/* --- 6. ADDED THE TEMPORARY BUTTON --- */}
        <button onClick={getWorkspaceXml} className="btn btn-export" style={{ backgroundColor: '#FFAB19', color: 'white', marginLeft: '10px' }}>
          Get XML (Dev Only)
        </button>
        {/* --- END TEMPORARY BUTTON --- */}

        <div style={{ marginLeft: 'auto', fontSize: '14px', color: 'var(--console-text)' }}> {/* Use CSS variable */}
          Blockly Playground
        </div>
      </div>

      {/* Main Content Area */}
      {/* --- MODIFIED: INLINE STYLE REMOVED, USES CSS --- */}
      <div className="workspace-main-area">
        {/* Blockly Workspace Area */}
        {/* --- MODIFIED: INLINE STYLE REMOVED, USES CSS --- */}
        <div className="blockly-editor-area">
          <div
            ref={blocklyDiv}
            className="blockly-editor" // Add class for potential CSS targeting
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
        </div>

        {/* Side Panel */}
        {/* --- MODIFIED: INLINE STYLE REMOVED, USES CSS --- */}
        <div className="side-panel">
          {/* Python Code Preview */}
          <div className="code-preview-panel" style={{
            flex: 1, padding: '15px', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', minHeight: 0 // Use CSS variable
          }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--code-color)', flexShrink: 0 }}> {/* Use CSS variable */}
              Generated Python Code
            </h4>
            <pre className="code-output" style={{ /* Keep inline styles or move to CSS */
              flexGrow: 1, margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '12px', backgroundColor: 'var(--code-bg)', color: 'var(--code-color)', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', overflow: 'auto' // Use CSS variables
            }}>
              {pythonCode}
            </pre>
          </div>

          {/* Console Output */}
          <div className="console-panel" style={{
             flex: 1, padding: '15px', display: 'flex', flexDirection: 'column', minHeight: 0
          }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--console-text)', flexShrink: 0 }}> {/* Use CSS variable */}
              Console Output
            </h4>
            <pre className="console-output" style={{ /* Keep inline styles or move to CSS */
              flexGrow: 1, margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '12px', backgroundColor: 'var(--console-output-bg)', color: 'var(--console-text)', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', overflow: 'auto' // Use CSS variables
            }}>
              {output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}