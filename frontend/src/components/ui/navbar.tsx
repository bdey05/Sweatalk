import React from 'react'
import { Link } from '@tanstack/react-router'
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button"
import { useState } from 'react';

const Navbar = () => {
  const [JWT, setJWT] = useState<string | null>(localStorage.getItem("token"));

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-access-tokens": token || "",
        },
      });
      if (!res.ok)
      {
        throw new Error(`Response status: ${res.status}`);
      }
      localStorage.clear();
      setJWT(null);

    } catch(error) {
        console.log(error);
    }
  }
  return (
    <header className="w-full px-5 md:px-10 py-4">
        <nav className="flex flex-col md:flex-row items-center justify-between h-auto md:h-14">
            <div className="flex flex-col md:flex-row items-center justify-between h-auto md:h-14">
                <Link to="/" className="text-3xl md:text-4xl font-bold text-primary">
                    Sweatalk
                </Link>
            </div>
            <div className="flex items-center gap-3 md:gap-5 mt-3 md:mt-0">
                {!JWT ?   
                <Button variant="secondary" className="text-base md:text-lg">
                    <Link to="/login">Login</Link>
                </Button> :
                <Button variant="secondary" className="text-base md:text-lg" onClick={handleLogout}>
                    <Link to="/">Logout</Link>
                </Button> 
                } 
             <ModeToggle />
           </div>
        </nav>
    </header>
  )
}

export default Navbar