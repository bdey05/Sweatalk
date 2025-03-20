import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/ui/navbar";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authstore";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const token = useAuthStore((state) => state.token);
  const handleLogin = useAuthStore((state) => state.handleLogin);
  const loginError = useAuthStore((state) => state.loginError);
  const resetErrors = useAuthStore((state) => state.resetErrors);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  useEffect(() => {
    resetErrors();
  }, [resetErrors])

  useEffect(() => {
    if (token) {
      navigate({ to: "/mealplanner" });
    }
  }, [token, navigate])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[400px] space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-semibold tracking-tight">
              Login into your account
            </h1>
            <p className="text-lg">Get back into your fitness journey</p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          <div className="text-center text-sm">
            <span>Don't have an account? </span>
            <Link to="/register" className="text-accent">
              Register
            </Link>
          </div>
          <div>{loginError && <p>{loginError?.message}</p>}</div>
        </div>
      </div>
    </div>
  );
}
