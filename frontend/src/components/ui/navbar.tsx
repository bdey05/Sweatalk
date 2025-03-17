import { Link } from '@tanstack/react-router'
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button"

const Navbar = () => {
 
  return (
    <header className="w-full px-5 md:px-10 py-4">
        <nav className="flex flex-col md:flex-row items-center justify-between h-auto md:h-14">
            <div className="flex flex-col md:flex-row items-center justify-between h-auto md:h-14">
                <Link to="/" className="text-3xl md:text-4xl font-bold text-primary">
                    Sweatalk
                </Link>
            </div>
            <div className="flex items-center gap-3 md:gap-5 mt-3 md:mt-0">   
                <Button variant="secondary" className="text-base md:text-lg">
                    <Link to="/login">Login</Link>
                </Button> 
             <ModeToggle />
           </div>
        </nav>
    </header>
  )
}

export default Navbar