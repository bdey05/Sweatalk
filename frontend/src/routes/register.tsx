import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/register')({
  component: Register,
})

function Register() {
  return (
    <div className="p-2">
      <h3>Welcome Register!</h3>
    </div>
  )
}