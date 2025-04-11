import { createFileRoute, Link } from "@tanstack/react-router";
//import { Dumbbell, Utensils, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import landing from "../assets/landing.svg";

import Navbar from "@/components/ui/navbar";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="w-full mx-5 my-3 px-12 py-5 flex flex-col gap-12 md:flex-row items-center justify-center">
        <div className="text-center md:text-left md:w-1/2">
          <h1 className="font-bold text-5xl m-5">
            The social media application for fitness enthusiasts
          </h1>
          <p className="text-xl m-5">
            Connect with your friends, anytime, any meal, any workout
          </p>
          <Button variant="destructive" className="mx-5 text-lg">
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
        <div className="w-full md:w-1/2 h-auto p-2 flex justify-center">
          <img src={landing} className="w-full max-w-4xl" />
        </div>
      </div>
     {/* <div className="flex flex-col px-[4%] md:flex-row justify-center items-center gap-10 md:gap-[5%] my-10">
        <div className="text-center md:text-left w-full md:w-1/3">
          <Dumbbell className="h-20 w-20 text-primary mx-auto md:mx-0" />
          <h3 className="text-2xl font-semibold my-2">Track your workouts</h3>
          <p className="text-xl">Create workout plans based on your goals</p>
        </div>
        <div className="text-center md:text-left w-full md:w-1/3">
          <Utensils className="h-20 w-20 text-secondary mx-auto md:mx-0" />
          <h3 className="text-2xl font-semibold my-2">Plan your meals</h3>
          <p className="text-xl">
            Find nutritional information for your favorite recipes
          </p>
        </div>
        <div className="text-center md:text-left w-full md:w-1/3">
          <Users className="h-20 w-20 text-destructive mx-auto md:mx-0" />
          <h3 className="text-2xl font-semibold my-2">
            Share your fitness journey
          </h3>
          <p className="text-xl">
            Exchange recipes and workouts with the community
          </p>
        </div>
      </div>*/}
    </div>
  );
}
