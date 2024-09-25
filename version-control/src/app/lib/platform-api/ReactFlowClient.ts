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

interface CreateNodeParams {
  node: Node,
  userId: string,
}

interface EditNodeParams {
  id: string,
  newValue: string,
  userId: string,
}

export async function createNode({ node, userId }: CreateNodeParams) {
  const response = await fetch('/api/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: node.id,
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
