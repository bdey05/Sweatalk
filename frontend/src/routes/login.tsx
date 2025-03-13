import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Navbar from "@/components/ui/navbar"
import { useState } from 'react'


export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const [responseMsg, setResponseMsg] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa("TestUser" + ':' + "pafssword")
        }
      });
      if (!res.ok) {
        throw new Error(`Response status: ${res.status}`);
      }
      const data = await res.json();
      setResponseMsg(data["token"]);
    } catch (error) {
        setResponseMsg(error.message);
    }
  }

  return  (
    <div className="min-h-screen flex flex-col">
     <Navbar />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[400px] space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-semibold tracking-tight">Login into your account</h1>
            <p className="text-lg">Get back into your fitness journey</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="name@example.com" type="email" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password"/>
            </div>

            <Button className="w-full" onClick={handleLogin}>Login</Button>
          </div>

          <div className="text-center text-sm">
            <span>Don't have an account? </span>
            <Link to="/register" className="text-accent">Register</Link>
          </div>
          <h2>{responseMsg}</h2>
        </div>
      </div>
    </div>
  )
}
