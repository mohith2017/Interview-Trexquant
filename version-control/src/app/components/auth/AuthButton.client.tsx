"use client";
import { useSession } from "next-auth/react";

import { Button } from "@/app/components/ui/button";

import { signIn, signOut } from "@/app/auth/helpers";
import React, { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";

export default function AuthButton() {
  // console.log(session?.user?, "auth button");
  const session = useSession();
  const router = useRouter();



  const handleSignIn = async () => {
        await signIn();
  };


  return session?.data?.user ? (
    <>
    {/* <Protected /> */}
    <Button
      onClick={async () => {
        await signOut();
        await signIn();

        
      } }
    >
      {session?.data?.user?.name} : Sign Out
    </Button></>
  ) : (
    <> 
    <Button onClick={handleSignIn}>CLICK HERE</Button>
    </>
  );
}
