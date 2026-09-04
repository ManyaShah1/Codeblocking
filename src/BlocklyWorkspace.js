import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useBlockly } from './BlocklyContext'; // Using context hook
import { useTheme } from './App'; // IMPORTED useTheme
import * as Blockly from 'blockly';
// import { Xml } from 'blockly/core'; // <-- This import is correctly removed
import { pythonGenerator } from 'blockly/python';
import 'blockly/blocks';
import 'blockly/javascript';
import 'blockly/python';
import './BlocklyWorkspace.css';

// --- DEFINE & REGISTER A DARK THEME FOR BLOCKLY ---
const darkTheme = Blockly.Theme.defineTheme('darkTheme', {
  'base': Blockly.Themes.Zelos, // Start from a modern theme
  'componentStyles': {
    'workspaceBackgroundColour': '#282c34', // Dark page background
    'toolboxBackgroundColour': '#2d2d30',   // Dark panel background
    'toolboxForegroundColour': '#f0f0f0',   // Light text
    'flyoutBackgroundColour': '#333940',    // Dark console background
    'flyoutForegroundColour': '#f0f0f0',    // Light text
    'scrollbarColour': '#4b5155',           // Dark scrollbar
    'scrollbarOpacity': 0.7,
  },
  'blockStyles': {
    // Make blocks a bit more vibrant on the dark background
    'logic_blocks': {
      'colourPrimary': '#87CEEB', // Sky Blue
      'colourSecondary': '#6a9bd6',
      'colourTertiary': '#6a9bd6'
    },
    'loop_blocks': {
      'colourPrimary': '#98FB98', // Mint
      'colourSecondary': '#7ceb7c',
      'colourTertiary': '#7ceb7c'
    },
    'math_blocks': {
      'colourPrimary': '#9966FF', // Lavender
      'colourSecondary': '#7d4dcf',
      'colourTertiary': '#7d4dcf'
    },
    'text_blocks': {
      'colourPrimary': '#FFC0CB', // Pink
      'colourSecondary': '#e5a9b3',
      'colourTertiary': '#e5a9b3'
    },
    'list_blocks': {
      'colourPrimary': '#FF7F50', // Coral
      'colourSecondary': '#e56b40',
      'colourTertiary': '#e56b40'
    },
    'variable_blocks': {
      'colourPrimary': '#FFAB19', // Amber
      'colourSecondary': '#d18a00',
      'colourTertiary': '#d18a00'
    },
  },
  'fontStyle': {
    'family': "'Montserrat', sans-serif",
  }
});
// ----------------------------------------------------


// Define global constants
const WORKSPACE_STORAGE_KEY = 'codeblocking_workspace';

// --- START: RAPIDAPI CONFIGURATION ---
const RAPIDAPI_KEY = process.env.REACT_APP_RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.REACT_APP_RAPIDAPI_HOST;
const RAPIDAPI_ENDPOINT = process.env.REACT_APP_RAPIDAPI_ENDPOINT;
// --- END: RAPIDAPI CONFIGURATION ---


// Define all standard Blockly blocks and custom generators
const defineAllBlocks = () => {
  // ... (defineAllBlocks function remains exactly the same) ...
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

  const { xmlToLoad, setXmlToLoad } = useBlockly();
  const { isDarkMode } = useTheme(); // GET DARK MODE STATE

  // Toolbox configuration...
  const toolboxCategories = {
    // ... (Toolbox content remains exactly the same) ...
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
        pythonGenerator.definitions_ = {};
        let code = pythonGenerator.workspaceToCode(workspace.current);
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
  }, []);

  const saveWorkspace = useCallback(() => {
    if (workspace.current) {
      try {
        // --- FIX: Use Blockly.Xml ---
        const dom = Blockly.Xml.workspaceToDom(workspace.current); 
        const xmlText = Blockly.Xml.domToText(dom);              
        localStorage.setItem(WORKSPACE_STORAGE_KEY, xmlText);
      } catch (error) {
        console.error('Error saving workspace:', error);
      }
    }
  }, []); 

  const loadWorkspaceFromXml = useCallback((xmlText) => {
    if (xmlText && workspace.current) {
      try {
        // --- FIX: Use Blockly.Xml ---
        const dom = Blockly.Xml.textToDom(xmlText);
        workspace.current.clear(); 
        Blockly.Xml.domToWorkspace(dom, workspace.current); 
        generateCode();
        saveWorkspace();
        if (typeof workspace.current.scrollCenter === 'function') {
          workspace.current.scrollCenter();
        }
        setOutput('Sample loaded.');
        console.log('Loaded workspace from provided XML.');
      } catch (e) {
        console.error('Error loading workspace from XML:', e);
        setOutput('Error loading sample.');
      }
    }
  }, [generateCode, saveWorkspace]); 

  const loadWorkspaceFromStorage = useCallback(() => {
    const xmlText = localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (xmlText && workspace.current) {
      try {
        // --- FIX: Use Blockly.Xml ---
        const dom = Blockly.Xml.textToDom(xmlText);              
        workspace.current.clear(); 
        Blockly.Xml.domToWorkspace(dom, workspace.current); 
      } catch (e) {
        console.error('Error loading workspace from local storage:', e);
      }
    }
  }, []);

  const runCode = async () => {
    // ... (This function remains unchanged) ...
    if (!RAPIDAPI_KEY || !RAPIDAPI_HOST || !RAPIDAPI_ENDPOINT) {
        setOutput('Error: API credentials are not configured. Please check environment variables.');
        console.error('API credentials missing. Ensure REACT_APP_RAPIDAPI_KEY, REACT_APP_RAPIDAPI_HOST, and REACT_APP_RAPIDAPI_ENDPOINT are set.');
        return;
    }
    if (isLoading) return;
    const code = generateCode();
    setIsLoading(true);
    setOutput('Executing code via RapidAPI...');
    const requestBody = {
      language: 'python',
      stdin: '', 
      files: [ { name: 'index.py', content: code } ]
    };
    try {
      const response = await fetch(RAPIDAPI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-key': RAPIDAPI_KEY,  
          'x-rapidapi-host': RAPIDAPI_HOST,
        },
        body: JSON.stringify(requestBody), 
      });
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API error: ${response.status} ${response.statusText}. Details: ${errorBody}`);
      }
      const result = await response.json();
      console.log('RapidAPI Result:', result);
      if (result.stdout) {
        setOutput(result.stdout);
      } else if (result.stderr) {
        setOutput(`Error:\n${result.stderr}`);
      } else if (result.exception) { 
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

  const clearWorkspace = () => {
    // ... (This function remains unchanged) ...
    if (workspace.current) {
      workspace.current.clear();
      setTimeout(() => {
        generateCode(); 
        saveWorkspace(); 
        setOutput('Workspace cleared.');
      }, 0);
    }
  };

  const exportCode = () => {
    // ... (This function remains unchanged) ...
    const code = generateCode(); 
    if (!code || code.trim() === '' || code.startsWith('//')) {
      alert('No code to export.');
      return;
    }
    const blob = new Blob([code], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'codeblocking_code.py'; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const safeDispose = useCallback(() => {
    // ... (This function remains unchanged) ...
     if (workspace.current) {
      try {
        workspace.current.dispose();
        workspace.current = null; 
      } catch (error) {
        console.warn('Error during workspace disposal:', error);
        workspace.current = null; 
      }
    }
  }, []);

  // --- This useEffect now ONLY handles initialization ---
  useEffect(() => {
    let primaryWorkspace; 

    if (!workspace.current && blocklyDiv.current) {
      try {
        primaryWorkspace = Blockly.inject(blocklyDiv.current, {
          toolbox: toolboxCategories,
          grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
          zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2 },
          move: { scrollbars: true, drag: true, wheel: false },
          trashcan: true,
          renderer: 'zelos', 
          // --- THEME IS NOW DYNAMIC BASED ON isDarkMode ---
          theme: isDarkMode ? darkTheme : Blockly.Themes.Zelos 
        });
        workspace.current = primaryWorkspace; 

        // On initial load, load sample from xmlToLoad if present, else from storage
        if (xmlToLoad) {
          loadWorkspaceFromXml(xmlToLoad);
          setXmlToLoad(null);
        } else {
          loadWorkspaceFromStorage();
          generateCode(); 
        }

        // Add change listener for auto-update and save
        const changeListener = (event) => {
          if (event.isUiEvent || event.type === Blockly.Events.FINISHED_LOADING) {
            return;
          }
          generateCode();
          saveWorkspace();
        };
        primaryWorkspace.addChangeListener(changeListener);

      } catch (error) {
        console.error('Error initializing Blockly:', error);
      }
    }

    // Cleanup function
    return () => {
      safeDispose(); 
    };
  }, [loadWorkspaceFromStorage, loadWorkspaceFromXml, xmlToLoad, setXmlToLoad, generateCode, saveWorkspace, safeDispose]);


  // --- This useEffect ONLY reacts to sample loads from context when already mounted ---
  useEffect(() => {
    if (xmlToLoad && workspace.current) {
      loadWorkspaceFromXml(xmlToLoad);
      setXmlToLoad(null); 
    }
  }, [xmlToLoad, loadWorkspaceFromXml, setXmlToLoad]);


  // --- UPDATE THEME: This effect updates the theme if isDarkMode changes ---
  useEffect(() => {
    if (workspace.current) {
      workspace.current.setTheme(isDarkMode ? darkTheme : Blockly.Themes.Zelos);
    }
  }, [isDarkMode]); // <-- This hook correctly handles *updating* the theme


  // JSX structure
  return (
    <div className="workspace-container" style={{ 
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 60px)', 
      fontFamily: "'Montserrat', sans-serif"
    }}>
      {/* Header with Controls */}
      <div className="workspace-controls" style={{ 
        padding: '10px',
        borderBottom: '1px solid var(--border-color)', 
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        backgroundColor: 'var(--console-bg)' 
      }}>
        <button
          onClick={runCode}
          disabled={isLoading}
          className="btn btn-run" 
        >
          {isLoading ? 'Running...' : 'Run Code'}
        </button>

        <button onClick={clearWorkspace} className="btn btn-clear">
          Clear
        </button>

        <button onClick={exportCode} className="btn btn-export">
          Export Python
        </button>
        
        {/* "Get XML" Button was removed */}

        <div style={{ marginLeft: 'auto', fontSize: '14px', color: 'var(--console-text)' }}> 
          Blockly Playground
        </div>
      </div>

      {/* Main Content Area */}
      <div className="workspace-main-area">
        {/* Blockly Workspace Area */}
        <div className="blockly-editor-area">
          <div
            ref={blocklyDiv}
            className="blockly-editor" 
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
        </div>

        {/* Side Panel */}
        <div className="side-panel">
          <div className="code-preview-panel" style={{
            flex: 1, padding: '15px', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', minHeight: 0 
          }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--code-color)', flexShrink: 0 }}> 
              Generated Python Code
            </h4>
            <pre className="code-output" style={{ 
              flexGrow: 1, margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '12px', backgroundColor: 'var(--code-bg)', color: 'var(--code-color)', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', overflow: 'auto' 
            }}>
              {pythonCode}
            </pre>
          </div>
          <div className="console-panel" style={{
             flex: 1, padding: '15px', display: 'flex', flexDirection: 'column', minHeight: 0
          }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--console-text)', flexShrink: 0 }}> 
              Console Output
            </h4>
            <pre className="console-output" style={{ 
              flexGrow: 1, margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '12px', backgroundColor: 'var(--console-output-bg)', color: 'var(--console-text)', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', overflow: 'auto' 
            }}>
              {output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}