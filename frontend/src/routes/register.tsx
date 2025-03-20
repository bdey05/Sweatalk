import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/ui/navbar";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authstore";

export const Route = createFileRoute("/register")({
  component: Register,
});

function Register() {
  const [validationError, setValidationError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");
  const [age, setAge] = useState<number>();
  const [feet, setFeet] = useState<number>();
  const [inches, setInches] = useState<number>();

  const [weight, setWeight] = useState<number>();


  const token = useAuthStore((state) => state.token)
  const handleRegister = useAuthStore((state) => state.handleRegister);
  const registerError = useAuthStore((state) => state.registerError);
  const resetErrors = useAuthStore((state) => state.resetErrors);

  const navigate = useNavigate();

  const verifyFields = (e) => {
    e.preventDefault();
    resetErrors();
    setValidationError("");
    if (password !== repeatPassword)
    {
      setValidationError("Error: Entered passwords do not match");
    }
    else 
    {
      const height = (feet! * 12) + inches!; 
      handleRegister(username, email, password, age as number, weight as number, height);
    }
  };

  useEffect(() => {
    resetErrors();
  }, [resetErrors]);

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
          <div className="space-y-1">
            <h1 className="text-4xl font-semibold tracking-tight">Sign up for an account</h1>
            <p className="text-base">Get ready to begin your fitness journey</p>
          </div>

          <form className="space-y-3" onSubmit={verifyFields}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                minLength={3}
                maxLength={20}
                pattern="^[a-zA-Z].*$"
                onInvalid={(e) => e.target.setCustomValidity("Username must start with a letter")}
                onInput={(e) => e.target.setCustomValidity("")}
                onChange={(e) => setUsername(e.target.value)}
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
                minLength={8}
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$"
                onInvalid={(e) =>
                  e.target.setCustomValidity(
                    "Password must be at least 8 characters with at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character",
                  )
                }
                onInput={(e) => e.target.setCustomValidity("")}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="repeatpassword">Repeat Password</Label>
              </div>
              <Input id="repeatpassword" type="password" onChange={(e) => setRepeatPassword(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="13"
                  max="120"
                  onChange={(e) => setAge(Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="25"
                  max="1000"
                  onChange={(e) => setWeight(Number(e.target.value))}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="feet">Height (ft)</Label>
                <Input
                  id="feet"
                  type="number"
                  min="2"
                  max="8"
                  onChange={(e) => setFeet(Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inches">Height (in)</Label>
                <Input
                  id="inches"
                  type="number"
                  min="0"
                  max="11"
                  onChange={(e) => setInches(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>

          <div className="text-center text-sm">
            <span>Already have an account? </span>
            <Link to="/login" className="text-accent">
              Login
            </Link>
          </div>
          <div>{registerError && <p>{registerError?.message}</p>}</div>
          <div>{validationError && <p>{validationError}</p>}</div>
        </div>
      </div>
    </div>
  );
}
