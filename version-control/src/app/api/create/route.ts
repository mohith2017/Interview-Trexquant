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
    const { id, type, data, position, userId } = await req.json();
    console.log("ID", id, "TYPE:", type, "DATA: ", data, position, "USER ID:", userId);
    


    const docRef = await db.collection('users').doc(userId).collection('nodes').add({
      id,
      type,
      data,
      position,
    });

    const newNode = {
      id: docRef.id,
      type,
      data,
      position,
    };

    return NextResponse.json(newNode, { status: 201 });
  } catch (error) {
    console.error('Error creating node:', error);
    return NextResponse.json({ error: 'Failed to create node' }, { status: 500 });
  }
}
