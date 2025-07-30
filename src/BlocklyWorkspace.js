import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import 'blockly/blocks';

export default function BlocklyWorkspace() {
  const blocklyDiv = useRef();
  const toolbox = useRef();
  const workspace = useRef();

  useEffect(() => {
    workspace.current = Blockly.inject(blocklyDiv.current, {
      toolbox: toolbox.current,
    });
  }, []);

  const runCode = () => {
    const code = javascriptGenerator.workspaceToCode(workspace.current);
    console.log(code); // Or execute it in a sandbox
  };

 

  return (
    <div>
      {/* Toolbox (left panel) */}
      <div ref={toolbox} style={{ display: 'none' }}>
        <block type="controls_if"></block>
        <block type="logic_compare"></block>
        <block type="math_number"></block>
        <block type="text_print"></block>
      </div>

      {/* Workspace (center) */}
      <div 
        ref={blocklyDiv} 
        style={{ 
          height: '500px', 
          width: '800px',
          border: '2px solid #ddd'
        }}
      />
      <button onClick={runCode} style={{ padding: '10px', margin: '10px' }}>
        Run Code ▶️
      </button>
    </div>
  );
}