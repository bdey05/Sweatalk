import { createFileRoute, Link } from '@tanstack/react-router'
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Navbar from "@/components/ui/navbar";
import { useState } from 'react'
import { useAuthStore } from '@/stores/authstore'


export const Route = createFileRoute('/register')({
  component: Register,
})

function Register() {
  const [responseMsg, setResponseMsg] = useState<string>("");
  //const handleRegister = useAuthStore((state) => state.handleRegister);
  const registerError = useAuthStore((state) => state.registerError);
  const resetErrors = useAuthStore((state) => state.resetErrors);

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: "TestUser", email: "test@gmail.com", password: "password"})
      });
      if (!res.ok) {
        throw new Error(`Response status: ${res.status}`);
      }
      const data = await res.json();
      setResponseMsg(data["message"]);
    } catch (error) {
        setResponseMsg(error.message);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
     <Navbar />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[400px] space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-semibold tracking-tight">Sign up for an account</h1>
            <p className="text-lg">Get ready to begin your fitness journey</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="name@example.com" type="email" required/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" required/>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" required/>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="repeatpassword">Repeat Password</Label>
              </div>
              <Input id="repeatpassword" type="password" required/>
            </div>

            <Button className="w-full" onClick={handleRegister}>Register</Button>
          </div>

          <div className="text-center text-sm">
            <span>Already have an account? </span>
            <Link to="/login" className="text-accent">Login</Link>
          </div>
          <h2>{responseMsg}</h2>
        </div>
      </div>
    </div>
  )
}