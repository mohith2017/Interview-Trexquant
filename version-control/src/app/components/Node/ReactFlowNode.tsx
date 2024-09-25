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
import { createNode, editNode, getNode } from "@/app/lib/platform-api/ReactFlowClient";

interface Node {
  id: string; 
  type:string;
  data: {label: string, comments: string};
  position: { x: number; y: number };  
}




const initialNodes = [
  {
    id: "87F0C113-97D6-4356-B874-44FD17BE713C",
    type: "default",
    data: { label: "A" , comments: ''},
    position: { x: 0, y: 50 },
  },
];

type Props = { userName: string | ""; email: string | null};




let nodeVal = 66;
const getId = () => uuidv4().toString();
const getNodeVal = () => nodeVal++;
const nodeOrigin: [number, number] = [0.5, 0];

export default function ReactFlowNode({ userName, email }: Props ) {
  const reactFlowWrapper = useRef(null);

  const [userId, setUserId] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [nodeValue, setNodeValue] = useState('');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [edges, setEdges, onEdgesChange]:any[] = useEdgesState([]);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<Array<string>>([]);
  const { screenToFlowPosition } = useReactFlow();
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const onConnect = useCallback(
    (params:any) => setEdges((eds:any) => addEdge(params, eds)),
    []
  );


  const onNodeClick = () => {
    
    if (selectedNode) {
      setEditingNodeId(selectedNode.id);
    }
    closeContextMenu()
  }


  const onNodeRightClick = (event:any, node:any) => {
    event.preventDefault();
    setSelectedNode(node); // Store the clicked node for future actions
    setContextMenuVisible(true);
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
  };

  

  // Close the context menu when clicking outside
  const closeContextMenu = () => {
    setContextMenuVisible(false);
    setSelectedNode(null);
  };

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
          return { ...n, data: { ...n.data, comments: nodeValue } };
        }
        return n;
      })
    );
    let response;
    if (editingNodeId) {
       response = await editNode({ id: editingNodeId, newValue: nodeValue, userId: userId});
    }
    console.log(response)
    closeContextMenu();
    
  }

  const handleFindPathToRoot = () => {
    const findPath = (currentNodeId:any, visited = new Set()) => {
      if (visited.has(currentNodeId)) return [];
      visited.add(currentNodeId);

      // Find edges connected to this node
      const parentEdges = edges.filter((edge:any) => edge.target === currentNodeId);
      if (parentEdges.length === 0) {
        return [currentNodeId]; // Return this node if it's a root
      }

      // Recursively trace the path to the root node
      return parentEdges.flatMap((edge:any) => findPath(edge.source, visited)).concat(currentNodeId);
    };

    if (selectedNode) {
      const path = findPath(selectedNode.id);
      console.log("Path to Root: ", path);
      setHighlightedNodeIds(path)
    }
    
    closeContextMenu();
  };

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
          data: { label: String.fromCharCode(nodeVal) , comments: ''},
          origin: [0.5, 0.0],
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds:any) =>
          eds.concat({ id, source: connectionState.fromNode.id, target: id })
        );
        // console.log(userId);
        const response = await createNode({ node: newNode, edges:{ id, source: connectionState.fromNode.id, target: id }, userId: userName});
        console.log(response)
      }
    },
    [screenToFlowPosition, userId]
  );



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {

      if (contextMenuRef.current && !(event.target as HTMLElement).closest('.context-menu')) {
        closeContextMenu(); 
      }
    };

    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
  
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu]);

  useEffect(() => {
    const initializeNode = async () => {
      console.log(userName)

      // const username = document.cookie.split('; ').find(row => row.startsWith('userId='))?.split('=')[1] || "";
      // // console.log(getUserId)

      // if(!getUserId)
      // {
      const response = await getNode(userName);
      // console.log(response.nodes);
      if (!response.nodes)
      {
          try {
              // document.cookie = `userId=${userName}; path=/; max-age=86400`;
              
              // console.log(userId)
              const response = await createNode({ node: initialNodes[0], edges: {id: null, source: null, target:null}, userId: userName});
              console.log(response)

              // setNodes(initialNodes);
              // setEdges(response.edges);
              
            } catch (error) {
              console.error('Failed to create initial node:', error);
            }
       }
       else{
          setNodes(response.nodes);
          setEdges(response.edges);
       }
    
    }
    initializeNode();
  },[userName]);

  
 

  return (
    <>
    <div className="text-bold text-white text-md">Drag and drop to create new versions</div>
    <div className="wrapper" ref={reactFlowWrapper} style={{color:'black', width: '100vw', height: '100vh'}}>
      <ReactFlow
        nodes={nodes.map(node => ({
          ...node,
          style: {
            border: highlightedNodeIds.includes(node.id) ? '2px solid orange' : 'none',
          },
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        // onNodeClick={onNodeClick}
        onNodeContextMenu={onNodeRightClick}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        fitView
        fitViewOptions={{ padding: 2 }}
        nodeOrigin={nodeOrigin}
      >
        {nodes.map((node) => {
          const isEditing = editingNodeId === node.id;
          // const isHighlighted = highlightedNodeIds.includes(node.id);

          return (
            <div key={node.id} style={{ 
              position: 'absolute', 
              right: node.position.x,
              bottom: node.position.y,
              // border: isHighlighted ? '2px solid orange' : 'none',
              
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center'
              }}>

                {/* <div className="bg-gray-200 p-1 rounded mt-1" >
                  {node.data.comments}
                </div> */}
              {isEditing ? (
                <div className="flex flex-col mt-2">
                <input
                  value={nodeValue}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  autoFocus
                  className="border border-gray-300 rounded p-1"
                />
                <button className="bg-blue-500 text-white mt-1 rounded p-1" onClick={handleUpdateClick} >Add comment</button>
                </div>
              ) : (
                // <div>{node.data.label}</div>
               <></>)}


              
            </div>



            
          );
          
        })}

      </ReactFlow>
      
      
       <div style={{
            position: 'absolute',
            top: '10px', // Adjust top position as needed
            right: '10px', // Adjust right position as needed
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start', // Align comments to the start of the column
          }}>
            <span className="text-white">Comments</span>
            {nodes.map((node) => (
              (
                node.data.comments ?
              (<div key={node.id} className="bg-gray-200 p-1 rounded mb-1" style={{ 
                width: '200px', // Adjust width as needed
              }}>
                {node.data.label}: {node.data.comments}
              </div>
            ): null )))}
              </div>
          
          {/* Custom Context Menu */}
      {contextMenuVisible && (
        <div
          style={{
            position: 'absolute',
            top: `${contextMenuPosition.y}px`,
            left: `${contextMenuPosition.x}px`,
            background: 'white',
            boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
            borderRadius: '4px',
            zIndex: 10,
          }}
        >
          <ul className="flex flex-col mt-2 px-2 py-2 text-blue-400">
            <li><button onClick={onNodeClick}>Add Comment</button></li>
            -------------------------
            <li><button onClick={handleFindPathToRoot}>Find Path to Root</button></li>
          </ul>
        </div>
      )}
      
    </div>
    </>
  );
};
