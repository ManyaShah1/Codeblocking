import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as Blockly from 'blockly';
import { pythonGenerator } from 'blockly/python';
import 'blockly/blocks';
import 'blockly/javascript';
import 'blockly/python';
import './BlocklyWorkspace.css';

// Define global constants
const WORKSPACE_STORAGE_KEY = 'codeblocking_workspace';
const MOCK_API_LATENCY = 1500;

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
    const method = block.getFieldValue('METHOD');
    const url = pythonGenerator.valueToCode(block, 'URL', pythonGenerator.ORDER_ATOMIC) || "''";
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
    return `open(${filename}, 'w').write(${content})\n`;
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
          { kind: 'block', type: 'text_print' }
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
        colour: '%{BKY_MATH_HUE}',
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

        // Add imports if needed
        if (pythonGenerator.definitions_) {
          const imports = Object.values(pythonGenerator.definitions_).join('');
          code = imports + code;
        }

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
        const xml = Blockly.Xml.workspaceToDom(workspace.current);
        const xmlText = Blockly.Xml.domToText(xml);
        localStorage.setItem(WORKSPACE_STORAGE_KEY, xmlText);
      } catch (error) {
        console.error('Error saving workspace:', error);
      }
    }
  }, []);

  const loadWorkspace = useCallback(() => {
    const xmlText = localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (xmlText && workspace.current) {
      try {
        const xml = Blockly.Xml.textToDom(xmlText);
        workspace.current.clear();
        Blockly.Xml.domToWorkspace(xml, workspace.current);
      } catch (e) {
        console.error('Error loading workspace from local storage:', e);
      }
    }
  }, []);

  const runCode = async () => {
    if (isLoading) return;

    const code = generateCode();
    setIsLoading(true);
    setOutput('Running code securely on server...');

    try {
      await new Promise(resolve => setTimeout(resolve, MOCK_API_LATENCY));

      let mockOutput = '';

      // Simple simulation logic
      if (code.includes('requests.')) {
        mockOutput = 'Status: 200 - Data Fetched Successfully. (Simulated API Call)\n';
        mockOutput += 'Response: {"data": "example", "status": "success"}';
      } else if (code.includes('print(')) {
        mockOutput = 'Console Output:\nHello from Python!\nCode executed successfully.';
      } else if (code.includes('input(')) {
        mockOutput = 'User input simulation: "test input"\nCode executed with simulated user input.';
      } else {
        mockOutput = 'Code ran successfully with no visible output.\nAll operations completed.';
      }

      setOutput(mockOutput);

    } catch (e) {
      setOutput(`Error: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearWorkspace = () => {
    if (workspace.current) {
      workspace.current.clear();
      generateCode();
      setOutput('Workspace cleared.');
    }
  };

  const exportCode = () => {
    const code = generateCode();
    const blob = new Blob([code], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blockly_code.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Safe workspace disposal
  const safeDispose = useCallback(() => {
    if (workspace.current) {
      try {
        // Clear all event listeners first
        workspace.current.removeChangeListener();
        
        // Dispose safely
        workspace.current.dispose();
        workspace.current = null;
      } catch (error) {
        console.warn('Error during workspace disposal:', error);
        workspace.current = null;
      }
    }
  }, []);

  useEffect(() => {
    // Initialize workspace only if not already initialized
    if (!workspace.current && blocklyDiv.current) {
      try {
        workspace.current = Blockly.inject(blocklyDiv.current, {
          toolbox: toolboxCategories,
          grid: {
            spacing: 20,
            length: 3,
            colour: '#ccc',
            snap: true
          },
          zoom: {
            controls: true,
            wheel: true,
            startScale: 1.0,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2
          },
          move: {
            scrollbars: true,
            drag: true,
            wheel: false
          },
          trashcan: true,
          renderer: 'zelos',
          theme: Blockly.Themes.Zelos
        });

        // Load saved workspace after a short delay
        setTimeout(() => {
          loadWorkspace();
          generateCode();
        }, 100);

        // Add change listener with error handling
        const changeListener = (event) => {
          if (!event.isUiEvent) {
            setTimeout(() => {
              try {
                generateCode();
                saveWorkspace();
              } catch (error) {
                console.warn('Error in change listener:', error);
              }
            }, 100);
          }
        };

        workspace.current.addChangeListener(changeListener);

      } catch (error) {
        console.error('Error initializing Blockly:', error);
      }
    }

    return () => {
      // Cleanup on unmount
      safeDispose();
    };
  }, [loadWorkspace, generateCode, saveWorkspace, safeDispose]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header with Controls */}
      <div style={{
        padding: '10px',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
      }}>
        <button
          onClick={runCode}
          disabled={isLoading}
          style={{
            padding: '8px 16px',
            backgroundColor: isLoading ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Running...' : 'Run Code'}
        </button>
        
        <button
          onClick={clearWorkspace}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear
        </button>
        
        <button
          onClick={exportCode}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Export Python
        </button>
        
        <div style={{ marginLeft: 'auto', fontSize: '14px', color: '#666' }}>
          Blockly Playground
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Blockly Workspace - Full Width */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div
            ref={blocklyDiv}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
          />
        </div>

        {/* Side Panel */}
        <div style={{
          width: '400px',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid #ddd'
        }}>
          {/* Python Code Preview */}
          <div style={{
            flex: 1,
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #ddd'
          }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#333' }}>
              Generated Python Code
            </h4>
            <pre style={{
              margin: 0,
              whiteSpace: 'pre-wrap',
              fontFamily: 'Monaco, Consolas, monospace',
              fontSize: '12px',
              backgroundColor: '#fff',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #e1e1e1',
              maxHeight: '300px',
              overflow: 'auto'
            }}>
              {pythonCode}
            </pre>
          </div>

          {/* Console Output */}
          <div style={{
            flex: 1,
            padding: '15px',
            backgroundColor: '#fff'
          }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#333' }}>
              Console Output
            </h4>
            <pre style={{
              margin: 0,
              whiteSpace: 'pre-wrap',
              fontFamily: 'Monaco, Consolas, monospace',
              fontSize: '12px',
              backgroundColor: '#f8f9fa',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #e1e1e1',
              maxHeight: '200px',
              overflow: 'auto',
              minHeight: '150px'
            }}>
              {output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}