import { useAuthStore } from '@/stores/authstore'
import React from 'react'

const Profile = () => {

  //const user = useAuthStore((state) => state.user);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  let feet;
  let inches;
  if (user)
  {
    feet = Math.floor(user.height / 12);
    inches = user.height % 12; 
  }

  return (
    <div className="space-y-4 p-4">
        <div className="flex items-center space-x-3">
        <div className="h-12 w-12 rounded-full bg-primary"></div>
        <div>
            {user && <h3 className="font-medium">{user.username}</h3>}
        </div>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-lg bg-accent/50 p-3">
        <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">Weight</span>
            {user && <span className="font-medium">{user.weight} lbs</span>}
        </div>
        <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">Height</span>
            {user && <span className="font-medium">{feet}' {inches}''</span>}
        </div>
        <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">Age</span>
            {user && <span className="font-medium">{user.age} yrs</span>}
        </div>
        </div>
    </div>
  )
}

export default Profile