// Check if the user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false

  const token = localStorage.getItem("user_token")
  return !!token
}

// Get the current user's token
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null

  return localStorage.getItem("user_token")
}

// Set the user's token
export const setToken = (token: string): void => {
  if (typeof window === "undefined") return

  localStorage.setItem("user_token", token)
}

// Remove the user's token (logout)
export const removeToken = (): void => {
  if (typeof window === "undefined") return

  localStorage.removeItem("user_token")
}

// Redirect to login if not authenticated
export const redirectIfNotAuthenticated = (): void => {
  if (typeof window === "undefined") return

  if (!isAuthenticated()) {
    window.location.href = "/"
  }
}
