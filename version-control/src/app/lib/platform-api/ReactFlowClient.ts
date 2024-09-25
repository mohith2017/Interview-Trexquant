import axios from 'axios';

interface NodeData {
  label: string;
}

interface Position {
  x: number;
  y: number;
}

interface Node {
  id: string;
  type: string;
  data: NodeData;
  position: Position;
}

interface CreateNodeParams {
  label: string;
  position: Position;
  userId: string;
  type?: string;
}

export async function createNode({ label, position, userId }: CreateNodeParams) {
  const response = await fetch('/api/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'default',
      data: { label },
      position,
      userId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create node');
  }

  return response.json();
}
