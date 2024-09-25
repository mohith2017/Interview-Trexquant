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
  node: Node,
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
      data: { label: node.data.label },
      position: node.position,
      userId: userId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create node');
  }

  return response.json();
}
