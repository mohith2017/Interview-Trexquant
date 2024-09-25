'use client'
import React, { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import "./index.css";
import { createNode } from "@/app/lib/platform-api/ReactFlowClient";

const initialNodes = [
  {
    id: "87F0C113-97D6-4356-B874-44FD17BE713C",
    type: "input",
    data: { label: "A" },
    position: { x: 0, y: 50 },
  },
];



let nodeVal = 66;
const getId = () => uuidv4().toString();
const getNodeVal = () => nodeVal++;
const nodeOrigin: [number, number] = [0.5, 0];

const ReactFlowNode = () => {
  const reactFlowWrapper = useRef(null);

  const [userId, setUserId] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [editingNodeId, setEditingNodeId] = useState(null);
  const [nodeValue, setNodeValue] = useState('');
  const [edges, setEdges, onEdgesChange]:any[] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const onConnect = useCallback(
    (params:any) => setEdges((eds:any) => addEdge(params, eds)),
    []
  );

  const onNodeClick = (event:any, node:any) => {
    console.log("Node", node.id, "Clicked");
    setEditingNodeId(node.id);
    setNodeValue(node.data.label);
  }
  

  const handleInputChange = (event:any) => {
    setNodeValue(event.target.value);
  };

  const handleInputBlur = () => {
    if (editingNodeId) {
      handleUpdateClick(); 
    }
    setEditingNodeId(null);
     
  };

  const handleUpdateClick = async () => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === editingNodeId) {
          return { ...n, data: { ...n.data, label: nodeValue } };
        }
        return n;
      })
    );
    // const response = await editNode({ id: editingNodeId, newValue: nodeValue, userId});
    // console.log(response)
    setEditingNodeId(null);
    
  }

  const onConnectEnd = useCallback(
    async (event:any, connectionState:any) => {
      if (!connectionState.isValid) {
        const id = getId();
        const nodeVal = getNodeVal();
        const { clientX, clientY } =
          "changedTouches" in event ? event.changedTouches[0] : event;
        const newNode = {
          id,
          type:"default",
          position: screenToFlowPosition({
            x: clientX,
            y: clientY,
          }),
          data: { label: String.fromCharCode(nodeVal) },
          origin: [0.5, 0.0],
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds:any) =>
          eds.concat({ id, source: connectionState.fromNode.id, target: id })
        );
        console.log(userId);
        const response = await createNode({ node: newNode, userId: userId});
        console.log(response)
      }
    },
    [screenToFlowPosition, userId]
  );

  useEffect(() => {
      let userID = uuidv4().toString();
      setUserId(userID);
  },[]);

  useEffect(() => {
    const initializeNode = async () => {

      // const getUserId = document.cookie.split('; ').find(row => row.startsWith('userId='))?.split('=')[1];
      // // console.log(getUserId)

      // if(!getUserId)
      // {
          try {
              document.cookie = `userId=${userId}; path=/; max-age=86400`;
              
              console.log(userId)
              const success = await createNode({ node: initialNodes[0], userId: userId});
              console.log(success)
              
            } catch (error) {
              console.error('Failed to create initial node:', error);
            }
    //  }
    
    }
    initializeNode();
  },[userId]);

  return (
    <>
    <div className="text-bold text-white text-md">Drag and drop to create new versions</div>
    <div className="wrapper" ref={reactFlowWrapper} style={{color:'black', width: '100vw', height: '100vh'}}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        fitView
        fitViewOptions={{ padding: 2 }}
        nodeOrigin={nodeOrigin}
      >
        {nodes.map((node) => {
          const isEditing = editingNodeId === node.id;
          return (
            <div key={node.id} style={{ 
              position: 'absolute', 
              right: node.position.x,
              bottom: node.position.y,
              }}>
              {isEditing ? (
                <div className="flex flex-col mt-2">
                <input
                  value={nodeValue}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  autoFocus
                  className="border border-gray-300 rounded p-1"
                />
                <button className="bg-blue-500 text-white mt-1 rounded p-1" onClick={handleUpdateClick} >Update Value</button>
                </div>
              ) : (
                <div>{node.data.label}</div>
              )}
            </div>
          );
        })}
      </ReactFlow>
    </div>
    </>
  );
};

export default () => (
  <ReactFlowProvider>
    <ReactFlowNode />
  </ReactFlowProvider>
);
