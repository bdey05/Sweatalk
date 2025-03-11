import { createFileRoute, Link } from '@tanstack/react-router'
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle";

export const Route = createFileRoute('/register')({
  component: Register,
})

function Register() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full px-5 md:px-10 py-4">
        <nav className="flex flex-col md:flex-row items-center justify-between h-auto md:h-14">
        <div className="flex flex-col md:flex-row items-center justify-between h-auto md:h-14">
          <Link to="/" className="text-3xl md:text-4xl font-bold text-primary">
            Sweatalk
          </Link>
        </div>
        <ModeToggle />
        </nav>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[400px] space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-semibold tracking-tight">Sign up for an account</h1>
            <p className="text-lg">Get ready to begin your fitness journey</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="name@example.com" type="email" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm">
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password"/>
            </div>

            <Button className="w-full">Register</Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
          >
            <Mail className="mr-2 h-4 w-4" />
            Login with Gmail
          </Button>

          <div className="text-center text-sm">
            <span>Already have an account? </span>
            <Link to="/login" className="text-accent">Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}