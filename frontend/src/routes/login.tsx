import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Navbar from "@/components/ui/navbar"


export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
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

            <Button className="w-full">Login</Button>
          </div>

          <div className="text-center text-sm">
            <span>Don't have an account? </span>
            <Link to="/register" className="text-accent">Register</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
