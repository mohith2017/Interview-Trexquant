import { NextResponse } from 'next/server';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const admin = require("firebase-admin");

if (!getApps().length) {
  
  initializeApp({
    credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
  });
}

const db = getFirestore();

export async function POST(req: Request) {
  try {
    const { id, edges, type, data, position, userId } = await req.json();
    console.log("ID", id, "Edges:", edges, "TYPE:", type, "DATA: ", data, position, "USER ID:", userId);
    


    const docRef = await db.collection('users').doc(userId).collection('nodes').doc(id).set({
      id,
      type,
      data,
      position,
    });


    const docEdgesRef = await db.collection('users').doc(userId).collection('edges').doc(id).set({
      id: edges.id,
      source: edges.source,
      target: edges.target,
    });

    const newNode = {
      id: id,
      type,
      data,
      position,
    };

    const newEdge = {
      id: edges.id,
      source: edges.source,
      target: edges.target,
    };

    return NextResponse.json({newNode, newEdge }, {status: 201 });
  } catch (error) {
    console.error('Error creating node:', error);
    return NextResponse.json({ error: 'Failed to create node' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    console.log("Fetching nodes for USER ID:", userId);

    const nodesSnapshot = await db.collection('users').doc(userId).collection('nodes').get();
    const edgesSnapshot = await db.collection('users').doc(userId).collection('edges').get();

    const nodes = nodesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const edges = edgesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({nodes:nodes, edges:edges} , { status: 200 });
  } catch (error) {
    console.error('Error fetching nodes:', error);
    return NextResponse.json({ error: 'Failed to fetch nodes' }, { status: 500 });
  }
}
