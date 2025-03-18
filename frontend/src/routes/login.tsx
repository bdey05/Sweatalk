import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Navbar from "@/components/ui/navbar"
import { useState } from 'react'
import { useAuthStore } from '@/stores/authstore'


export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const token = useAuthStore((state) => state.token);
  const handleLogin = useAuthStore((state) => state.handleLogin);
  const loginError = useAuthStore((state) => state.loginError);

  /*const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: "test@gmail.com", password: "password"})
      });
      if (!res.ok) {
        throw new Error(`Response status: ${res.status}`);
      }
      const data = await res.json();
      setResponseMsg(data["token"]);
      localStorage.setItem("token", data["token"]);
    } catch (error) {
        setResponseMsg(error.message);
    }
  }*/
  //ToDo: Create a validateFormFields function and then call handleLogin within that field 

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
              <Input id="email" placeholder="name@example.com" type="email" onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)}/>
            </div>

            <Button className="w-full" onClick={() => handleLogin(email, password)}>Login</Button>
          </div>

          <div className="text-center text-sm">
            <span>Don't have an account? </span>
            <Link to="/register" className="text-accent">Register</Link>
          </div>
          <h2>{loginError && loginError?.message}</h2>
          <h2>{token && token}</h2>
          <h2>{email}</h2>
          <h2>{password}</h2>

          <Link to="/dashboard">Dashboard</Link>
        </div>
      </div>
    </div>
  )
}
