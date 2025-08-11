import React, { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import 'blockly/blocks';

export default function BlocklyWorkspace() {
  const blocklyDiv = useRef();
  const workspace = useRef();
  const [spriteState, setSpriteState] = useState({
    x: 125,
    y: 125,
    direction: 90,
    size: 50,
    visible: true,
    costume: 'blue',
    message: ''
  });

  // Define the toolbox configuration with categories
  const toolboxCategories = {
    kind: 'categoryToolbox',
    contents: [
      {
        kind: 'category',
        name: 'Logic',
        colour: '#5b80a5',
        contents: [
          { kind: 'block', type: 'controls_if' },
          { kind: 'block', type: 'logic_compare' },
          { kind: 'block', type: 'logic_operation' },
          { kind: 'block', type: 'logic_boolean' }
        ]
      },
      {
        kind: 'category',
        name: 'Loops',
        colour: '#5ba55b',
        contents: [
          { kind: 'block', type: 'controls_repeat_ext' },
          { kind: 'block', type: 'controls_whileUntil' },
          { kind: 'block', type: 'controls_for' }
        ]
      },
      {
        kind: 'category',
        name: 'Math',
        colour: '#a55b80',
        contents: [
          { kind: 'block', type: 'math_number' },
          { kind: 'block', type: 'math_arithmetic' },
          { kind: 'block', type: 'math_single' }
        ]
      },
      {
        kind: 'category',
        name: 'Text',
        colour: '#a58b5b',
        contents: [
          { kind: 'block', type: 'text' },
          { kind: 'block', type: 'text_print' },
          { kind: 'block', type: 'text_join' }
        ]
      }
    ]
  };

  useEffect(() => {
    if (!workspace.current) {
      workspace.current = Blockly.inject(blocklyDiv.current, {
        toolbox: toolboxCategories,  // Use the categorized toolbox here
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

      // Define any custom blocks here
      defineCustomBlocks();
    }

    return () => {
      // Cleanup if needed
      if (workspace.current) {
        workspace.current.dispose();
        workspace.current = null;
      }
    };
  }, []);

  const defineCustomBlocks = () => {
    // Define your custom blocks here
    // Example:
    Blockly.Blocks['motion_movesteps'] = {
      init: function() {
        this.appendValueInput("STEPS")
            .setCheck("Number")
            .appendField("move");
        this.appendDummyInput()
            .appendField("steps");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#4A6CD4");
        this.setTooltip("Move sprite by specified number of steps");
      }
    };

    javascriptGenerator['motion_movesteps'] = function(block) {
      const steps = javascriptGenerator.valueToCode(
        block, 'STEPS', javascriptGenerator.ORDER_ATOMIC) || '0';
      return `moveSteps(${steps});\n`;
    };
  };

  const moveSteps = (steps) => {
    const angle = spriteState.direction * Math.PI / 180;
    setSpriteState(prev => ({
      ...prev,
      x: prev.x + steps * Math.cos(angle),
      y: prev.y - steps * Math.sin(angle)
    }));
  };

  const runCode = () => {
    const code = javascriptGenerator.workspaceToCode(workspace.current);
    try {
      const sandbox = {
        moveSteps,
        console: {
          log: (...args) => console.log(...args)
        }
      };
      
      const func = new Function(
        ...Object.keys(sandbox),
        `"use strict"; ${code}`
      );
      
      func(...Object.values(sandbox));
    } catch (e) {
      console.error("Error executing code:", e);
      setSpriteState(prev => ({ ...prev, message: `Error: ${e.message}` }));
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Blockly Workspace */}
      <div style={{ flex: 1 }}>
        <div 
          ref={blocklyDiv} 
          style={{ 
            height: '100%', 
            width: '100%',
            border: '2px solid #ddd'
          }}
        />
        
        <div style={{ padding: '10px' }}>
          <button onClick={runCode} style={{ padding: '10px' }}>
            Run Code ▶️
          </button>
        </div>
      </div>
      
      {/* Preview Area */}
      <div style={{ 
        width: '300px', 
        borderLeft: '1px solid #ccc',
        padding: '10px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <h3>Preview</h3>
        <div 
          style={{ 
            position: 'absolute',
            left: `${spriteState.x}px`,
            top: `${spriteState.y}px`,
            width: `${spriteState.size}px`,
            height: `${spriteState.size}px`,
            backgroundColor: spriteState.costume,
            borderRadius: spriteState.costume === 'blue' ? '25px' : '0',
            display: spriteState.visible ? 'block' : 'none',
            transform: `rotate(${spriteState.direction - 90}deg)`,
            transition: 'all 0.3s ease'
          }}
        />
        <div style={{ marginTop: '300px' }}>
          <h4>Output:</h4>
          <p>{spriteState.message}</p>
        </div>
      </div>
    </div>
  );
}