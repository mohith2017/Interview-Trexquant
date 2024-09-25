import NextAuth, { User, NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
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

interface Credentials {
  username: string;
  password: string;
}

export const BASE_PATH = "/api/auth";

const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        //Authenticate with DB adapter
      
        const users = [
          {
            id: "test-user-1",
            userName: "test1",
            name: "Test 1",
            password: "pass",
            email: "test1@donotreply.com",
          },
          {
            id: "test-user-2",
            userName: "test2",
            name: "Test 2",
            password: "pass",
            email: "test2@donotreply.com",
          },
        ];
        const user = users.find(
          (user) =>
            user.userName === credentials.username &&
            user.password === credentials.password
        );
        return user
          ? { id: user.id, name: user.name, email: user.email }
          : null;
        // const { username , password } = credentials;

        // const generateSessionToken = (): string => {
        //   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        //   let token = '';
        //   const tokenLength = 32; // Adjust the length as needed
        
        //   for (let i = 0; i < tokenLength; i++) {
        //     token += characters.charAt(Math.floor(Math.random() * characters.length));
        //   }
        
        //   return token;
        // };
        
        // const sessionToken = generateSessionToken();
        // console.log(sessionToken); // Example output: 'Xt7Zq9Lm2Ej8Rb5Wy3Kf0Gn1Ov4Pu6Qr'
        
        
        // const docRef = await db.collection('users').doc(username).get();

        // if (!docRef.exists) {
        //   console.error('No such document!');
        
        // } else {
        //   const userData = docRef.data();
        //   console.log('User data:', userData);
        // }
        

        // console.log(user);

        // if (error) {
        //   console.error('Error fetching user:', error);
        //   return null;
        // }

        // // Compare the fetched password with the provided password
        // // This is a simplified example and not recommended for production due to security concerns
        // if (user && user.password === password) {
        //   // Passwords match, return user details
        //   console.log("Successful");


        //   const { data, error } = await supabase
        //   .from('sessions')
        //   .insert({ id: user.id, expires: null, sessionToken: generateSessionToken(), userId: null, name: user.name})
        //   .select()
          
        //   if (error) {
        //     console.error('Error creating session', error);
        //     return null;
        //   }

        //   console.log(data);
        

        //   return {
        //     id: user.id,
        //     name: user.name,
        //     email: user.email,
            
        //   };
        // } else {
        //   // Passwords do not match
        //   return null;
        // }


        
      },
    }),
  ],
  basePath: BASE_PATH,
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
