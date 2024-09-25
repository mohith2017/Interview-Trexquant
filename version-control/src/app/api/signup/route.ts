import { NextRequest } from "next/server";
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
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

function getRandomColorCode(): string {
    const colorCodes: string[] = [
        'FF0000', // Red
        '00FF00', // Green
        '0000FF', // Blue
        'FFFF00', // Yellow
        '00FFFF', // Cyan
        'FF00FF', // Magenta
        '800080', // Purple
        '008080', // Teal
        '808080', // Gray
        '008000', // Dark Green
        '800000', // Maroon
        '000080', // Navy
        '808000', // Olive
        '800080', // Indigo
        '008080'  // Turquoise
      ];
    return colorCodes[Math.floor(Math.random() * colorCodes.length)];
  }
  

export async function POST(request: Request )  {

    try{
    const { firstName, lastName, email, password } = await request.json();

    console.log(firstName);
    const randomColor = getRandomColorCode();
    const userId = uuidv4().toString();

    const docRef = await db.collection('users').doc(userId).set({firstName:firstName,  lastName: lastName, username: email, password: password});

    console.log('User document created:', docRef);
    return NextResponse.json({ message: 'User document created successfully' });
    
    }
    catch (error) {
      console.error('Username already exists or Wrong password!', error);
      NextResponse.json({ message: 'Signup not successful' });
    }
}
