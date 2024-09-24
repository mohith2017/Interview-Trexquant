'use client'
import { ReactFlow, useNodesState } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useRef, useState } from 'react';
import '@xyflow/react/dist/style.css';
import { createNode } from '@/app/lib/platform-api/ReactFlowClient';
  

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
      
    const [userId, setUserId] = useState<string | null>(null);
    const reactFlowWrapper = useRef(null);
    const proOptions = { hideAttribution: true };
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

    // useEffect(() => {
    //   const initializeSession = async () => {
    //     const id = await getUserId();
    //     setUserId(id);
    //   };
    //   initializeSession();
    // },[]);

    
  
    useEffect(() => {
      const initializeNode = async () => {

        // const getUserId = document.cookie.split('; ').find(row => row.startsWith('userId='))?.split('=')[1];
        // // console.log(getUserId)

        // if(!getUserId)
        // {
            try {
                const userId = uuidv4();
                console.log("Came here")
                document.cookie = `userId=${userId}; path=/; max-age=86400`;
                setUserId(userId);
                const newNode = await createNode({ label: 'A', position: { x: 0, y: 50 }, userId: userId});
                setNodes((prevNodes) => [...prevNodes, newNode]);
              } catch (error) {
                console.error('Failed to create initial node:', error);
              }
      //  }
       
      
    };
      

      initializeNode();
    }, []);


    return (
      <div className="wrapper" ref={reactFlowWrapper} style={{ color: 'black', width: '100vw', height: '100vh' }}>
        <ReactFlow 
        nodes={nodes} 
        proOptions={proOptions}
        nodesDraggable
        />
      </div>
    );
  };
