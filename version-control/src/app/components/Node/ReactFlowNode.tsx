'use client'
import { ReactFlow, useNodesState } from '@xyflow/react';
import { useRef } from 'react';
import '@xyflow/react/dist/style.css';

  

export default function ReactFlowNode() {


const initialNodes = 
    [
      {
        "id": "87F0C113-97D6-4356-B874-44FD17BE713C",
        "type": "input",
        "data": { label: 'a' },
        "position": { x: 0, y: 50 }
        ,
      },
    ];
      
    const reactFlowWrapper = useRef(null);
    const proOptions = { hideAttribution: true };
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  
    return (
      <div className="wrapper" ref={reactFlowWrapper} style={{ color: 'black', width: '100vw', height: '100vh' }}>
        <ReactFlow 
        nodes={initialNodes} 
        proOptions={proOptions}
        nodesDraggable
        />
      </div>
    );
  };
