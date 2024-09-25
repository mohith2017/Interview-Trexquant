import axios from 'axios';

interface NodeData {
  label: string;
  comments: string | null,
}

interface Position {
  x: number;
  y: number;
}

interface Node {
  id: string;
  type: string;
  data: NodeData;
  position: Position,
}

interface Edge {
  id: string | null;
  source: string | null,
  target:string | null, 
}

interface CreateNodeParams {
  node: Node,
  edges: Edge,
  userId: string,
}

interface EditNodeParams {
  id: string,
  newValue: string,
  userId: string,
}

export async function createNode({ node, edges, userId }: CreateNodeParams) {
  const response = await fetch('/api/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: node.id,
      edges: edges,
      type: node.type,
      data: { label: node.data.label, comments: node.data.comments },
      position: node.position,
      userId: userId,
    }),
  });


  if (!response.ok) {
    throw new Error('Failed to create node');
  }

  return response.json();
}

export async function getNode(userId: string | "") {
  const response = await fetch(`/api/create?userId=${encodeURIComponent(userId)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch nodes');
  }

  return response.json();
}

export async function editNode({ id, newValue, userId }: EditNodeParams) {
  const response = await fetch('/api/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: id,
      newValue: newValue,
      userId: userId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create node');
  }

  return response.json();
}
