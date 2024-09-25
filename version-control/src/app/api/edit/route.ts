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
    const { id, newValue, userId } = await req.json();
    console.log("ID", id, "New Value", newValue, "USER ID:", userId);
    

    const userNodeRef = db.collection('users').doc(userId).collection('nodes').doc(id);

    await userNodeRef.update({
     'data.comments': newValue
    })

    return NextResponse.json({ status: 201 });
  } catch (error) {
    console.error('Error updating node:', error);
    return NextResponse.json({ error: 'Failed to update node' }, { status: 500 });
  }
}
