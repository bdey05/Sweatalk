import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useState } from 'react';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    if (!localStorage.getItem("token")) {
      throw redirect({ to: '/login' });
    }
  },
    component: Dashboard,  
})

function Dashboard() {
  type User = {
    id: number,
    username: string,
    email: string
  }

  const [users, setUsers] = useState<User[]>([]); 
  const [err, setError] = useState<string>("");

  const callAPI = async () => {
    const token = localStorage.getItem("token");
    console.log(token);
    try {
      const res = await fetch("http://localhost:5000/protected", {
        method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-tokens": token || "",
          },
      });
      if (!res.ok)
      {
        throw new Error(`Response status: ${res.status}`);
      }
      const data = await res.json();
      setUsers(data["users"]);

    } catch(error) {
        setError(error.message);
    }
  }

  return (
    <div>
      <button onClick={callAPI}>Get Users From Protected Route</button>
      <br />
      <Link to="/">Go Home</Link>
      <h2>The users in the database are:</h2>
      <div>
        {
          users.map((val, index) => (
            <div key={index}>
              <h2>{val['id']}</h2>
              <h2>{val['email']}</h2>
              <h2>{val['username']}</h2>
            </div>
          ))
        }
      </div>
      {err}
    </div>
  )
}
