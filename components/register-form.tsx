"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { userApi, roleApi } from "@/services/api"

export default function RegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role_id: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [roles, setRoles] = useState<any[]>([])

  // Fetch roles on component mount
  React.useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await roleApi.getAllRoles()
        setRoles(rolesData)
      } catch (error) {
        console.error("Failed to fetch roles:", error)
      }
    }

    fetchRoles()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role_id: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Prepare user data according to API expectations
      const userData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        role_id: formData.role_id,
        password: formData.password,
      }

      // Call the register API
      await userApi.createUser(userData)

      // Redirect to login page after successful registration
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter first name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>
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
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={handleRoleChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
