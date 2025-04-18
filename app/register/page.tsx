import RegisterForm from "@/components/register-form"
import Link from "next/link"

export default function Register() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        <RegisterForm />
        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-gray-600 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </main>
  )
}
