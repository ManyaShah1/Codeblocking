import React, { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import 'blockly/python'; 
import { pythonGenerator } from 'blockly/python';
import 'blockly/blocks';
import 'blockly/javascript';
import 'blockly/python';


export default function PythonBlocklyWorkspace() {
  const blocklyDiv = useRef();
  const workspace = useRef();
  const [output, setOutput] = useState('');
  const [variables, setVariables] = useState({});

  // Toolbox configuration with all Python-focused categories
  const toolboxCategories = {
    kind: 'categoryToolbox',
    contents: [
      {
        kind: 'category',
        name: 'Variables',
        colour: '#FF8C1A',
        custom: 'VARIABLE'
      },
      {
        kind: 'category',
        name: 'Data Types',
        colour: '#5BA55B',
        contents: [
          { kind: 'block', type: 'lists_create_with' },
          { kind: 'block', type: 'python_list_append' },
          { kind: 'block', type: 'python_list_length' },
          { kind: 'block', type: 'text' },
          { kind: 'block', type: 'math_number' }
        ]
      },
      {
        kind: 'category',
        name: 'Operators',
        colour: '#5B80A5',
        contents: [
          { kind: 'block', type: 'math_arithmetic' },
          { kind: 'block', type: 'logic_compare' },
          { kind: 'block', type: 'logic_operation' }
        ]
      },
      {
        kind: 'category',
        name: 'Loops',
        colour: '#FFAB19',
        contents: [
          { kind: 'block', type: 'controls_repeat_ext' },
          { kind: 'block', type: 'controls_whileUntil' }
        ]
      },
      {
        kind: 'category',
        name: 'Conditionals',
        colour: '#9966FF',
        contents: [
          { kind: 'block', type: 'controls_if' },
          { kind: 'block', type: 'controls_if_else' }
        ]
      },
      {
        kind: 'category',
        name: 'Functions',
        colour: '#FF6680',
        custom: 'PROCEDURE'
      },
      {
        kind: 'category',
        name: 'Input/Output',
        colour: '#59C059',
        contents: [
          { kind: 'block', type: 'text_print' },
          { kind: 'block', type: 'python_input' }
        ]
      }
    ]
  };

  useEffect(() => {
    if (!workspace.current && blocklyDiv.current) {
      // Initialize Blockly with all required block definitions
      workspace.current = Blockly.inject(blocklyDiv.current, {
        toolbox: toolboxCategories,
        grid: {
          spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true
        },
        trashcan: true,
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2
        }
      });

      defineAllBlocks();
    }

    return () => {
      if (workspace.current) {
        workspace.current.dispose();
        workspace.current = null;
      }
    };
  }, []);

  const defineAllBlocks = () => {
    // Custom List Append Block
    Blockly.Blocks['python_list_append'] = {
      init: function() {
        this.appendValueInput('LIST')
            .setCheck('Array')
            .appendField('append to list');
        this.appendValueInput('ITEM')
            .setCheck(null)
            .appendField('item');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#5BA55B');
        this.setTooltip('Append an item to a list');
      }
    };

    pythonGenerator['python_list_append'] = function(block) {
      const list = pythonGenerator.valueToCode(block, 'LIST', pythonGenerator.ORDER_ATOMIC) || '[]';
      const item = pythonGenerator.valueToCode(block, 'ITEM', pythonGenerator.ORDER_ATOMIC) || 'None';
      return `${list}.append(${item})\n`;
    };

    // Custom List Length Block
    Blockly.Blocks['python_list_length'] = {
      init: function() {
        this.appendValueInput('LIST')
            .setCheck('Array')
            .appendField('length of list');
        this.setOutput(true, 'Number');
        this.setColour('#5BA55B');
        this.setTooltip('Get the length of a list');
      }
    };

    pythonGenerator['python_list_length'] = function(block) {
      const list = pythonGenerator.valueToCode(block, 'LIST', pythonGenerator.ORDER_ATOMIC) || '[]';
      return [`len(${list})`, pythonGenerator.ORDER_ATOMIC];
    };

    // Custom Input Block
    Blockly.Blocks['python_input'] = {
      init: function() {
        this.appendDummyInput()
            .appendField('input')
            .appendField(new Blockly.FieldTextInput('Enter text'), 'PROMPT');
        this.setOutput(true, 'String');
        this.setColour('#59C059');
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
        this.setColour('#59C059');
        this.setTooltip('Print text to console');
      }
    };

    pythonGenerator['text_print'] = function(block) {
      const text = pythonGenerator.valueToCode(block, 'TEXT', pythonGenerator.ORDER_NONE) || "''";
      return `print(${text})\n`;
    };

    // Custom Variable Set Block
    Blockly.Blocks['variables_set'] = {
      init: function() {
        this.appendValueInput('VALUE')
            .setCheck(null)
            .appendField('set')
            .appendField(new Blockly.FieldVariable('item'), 'VAR')
            .appendField('to');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#FF8C1A');
        this.setTooltip('Set a variable to a value');
      }
    };

    pythonGenerator['variables_set'] = function(block) {
      const variable = block.getField('VAR').getText();
      const value = pythonGenerator.valueToCode(block, 'VALUE', pythonGenerator.ORDER_NONE) || 'None';
      return `${variable} = ${value}\n`;
    };
  };
const runCode = () => {
  if (!workspace.current) return;

  try {
    const code = pythonGenerator.workspaceToCode(workspace.current);
    console.log('Generated Python code:', code); // For debugging

    const sandbox = {
      print: (...args) => setOutput(prev => prev + args.join(' ') + '\n'),
      input: (prompt = '') => window.prompt(prompt) || ''
    };

    setOutput(''); // Clear previous output

    // Execute the generated Python code
    const func = new Function(
      ...Object.keys(sandbox),
      `"use strict";\n${code}`
    );

    func(...Object.values(sandbox));
  } catch (e) {
    setOutput(`Error: ${e.message}`);
    console.error('Execution error:', e);
  }
};
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Blockly Workspace */}
      <div style={{ flex: 1, position: 'relative' }}>
        <div 
          ref={blocklyDiv} 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: '1px solid #ddd'
          }}
        />
      </div>
      
      {/* Controls and Output */}
      <div style={{ 
        borderTop: '1px solid #ddd',
        padding: '10px',
        backgroundColor: '#f5f5f5'
      }}>
        <button 
          onClick={runCode}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Run Code
        </button>
        
        <div style={{ 
          marginTop: '10px',
          border: '1px solid #ddd',
          padding: '10px',
          backgroundColor: 'white',
          maxHeight: '150px',
          overflowY: 'auto'
        }}>
          <h4 style={{ margin: '0 0 8px 0' }}>Output:</h4>
          <pre style={{ 
            margin: 0,
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace'
          }}>{output || 'No output yet'}</pre>
        </div>
      </div>
    </div>
  );
}