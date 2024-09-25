"use client"
import { useRouter } from "next/navigation";

export default function SignUpButton() {
  const router = useRouter();

    const handleSignUp = () => {
        router.push("/signup");
      }
    
      
    return (
    <div className="flex justify-center">
            <button type="button" onClick={handleSignUp}>CLICK HERE</button>
            </div>
        
    )
}
