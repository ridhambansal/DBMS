"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { authApi } from "@/services/api"

export default function LoginForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Sample login for testing - allows login with test@example.com/password
      if (formData.email === "test@example.com" && formData.password === "password") {
        // For demo purposes only - in a real app, you would validate with your API
        console.log("Sample login successful")
        localStorage.setItem("user_token", "sample-token-123")
        router.push("/dashboard")
        return
      }

      // Call the login API
      const response = await authApi.login(formData)

      // Store the token in localStorage
      if (response && response.token) {
        localStorage.setItem('jwt', response.token)
        localStorage.setItem("user_token", response.token)
        router.push("/dashboard")
      } else {
        throw new Error("Invalid response from server")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <Link href="/register" className="w-full">
            <Button variant="outline" className="w-full" type="button">
              Create User
            </Button>
          </Link>
        </CardFooter>
      </form>
    </Card>
  )
}
