import { ReactFlowProvider } from "@xyflow/react";
import Image from "next/image";
import { auth } from "@/app/auth";
import AuthButton from "@/app/components/auth/AuthButton.server";
import ReactFlowNode from "./components/Node/ReactFlowNode";
import SignUpButton from "./components/signup/SignUpButton";
import { Button } from "@mui/material";
// import { redirect } from "next/dist/server/api-utils";
import { redirect } from 'next/navigation';
import ClientSignOutButton from "./components/signout/SignOutButton";


export default async function Home() {
  const session = await auth();
  let email = session?.user?.email || ""
  let userName = session?.user?.name || ""
  console.log(session);
  
  

  return (
    <main>
    {
      session?.user?.name ? 
      (  
        <>
        <ReactFlowProvider>
        <div style={{ flex: 1 }}>
        <ReactFlowNode userName={userName} email={email} />
        </div>
        <div style={{ position: 'fixed', top: '10px', left: '10px' }}>
          <ClientSignOutButton />
        </div>
      </ReactFlowProvider>
      </>
      ) : (<><AuthButton/><br/>
          {/* New User? Sign up here: <SignUpButton/> */}
          </>)
  }
  </main>
  );
}
