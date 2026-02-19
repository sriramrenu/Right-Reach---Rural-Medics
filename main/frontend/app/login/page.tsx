"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, LogIn, Shield, User, Heart, AlertCircle, Key } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [uhid, setUhid] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const currentUser = localStorage.getItem("current_user")
        const token = localStorage.getItem("token")
        if (currentUser && token) {
            router.push("/dashboard")
        }
    }, [router])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("current_user", JSON.stringify(data.user))
                localStorage.setItem("token", data.token)
                router.push("/dashboard")
            } else {
                setError(data.message || "Invalid username or password.")
            }
        } catch (err) {
            setError("Cannot connect to server. Is the backend running?")
        } finally {
            setIsLoading(false)
        }
    }

    const handleUhidLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

        try {
            const response = await fetch(`${API_URL}/api/auth/login-uhid`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uhid })
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("current_user", JSON.stringify(data.user))
                localStorage.setItem("token", data.token)
                router.push("/dashboard")
            } else {
                setError("UHID not found. Please register first.")
            }
        } catch (err) {
            setError("Connection error. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="p-6">
                <Link href="/">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Home
                    </Button>
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md border-primary/20 shadow-xl overflow-hidden">
                    <div className="h-2 bg-primary" />
                    <CardHeader className="text-center space-y-1">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                            <LogIn className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                        <CardDescription>Enter your credentials to access Right Reach</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="account" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="account">Account</TabsTrigger>
                                <TabsTrigger value="uhid">UHID Login</TabsTrigger>
                            </TabsList>

                            <TabsContent value="account">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username or Email</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="username"
                                                className="pl-10"
                                                placeholder="your_username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="password"
                                                type="password"
                                                className="pl-10"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {error && (
                                        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                            <AlertCircle className="w-4 h-4" />
                                            {error}
                                        </div>
                                    )}
                                    <Button type="submit" className="w-full h-11" disabled={isLoading}>
                                        {isLoading ? "Signing in..." : "Sign In"}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="uhid">
                                <form onSubmit={handleUhidLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="uhid">12-Digit UHID</Label>
                                        <div className="relative">
                                            <Shield className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="uhid"
                                                className="pl-10"
                                                placeholder="123456789012"
                                                value={uhid}
                                                onChange={(e) => setUhid(e.target.value)}
                                                maxLength={12}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {error && (
                                        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                            <AlertCircle className="w-4 h-4" />
                                            {error}
                                        </div>
                                    )}
                                    <Button type="submit" className="w-full h-11" disabled={isLoading}>
                                        {isLoading ? "Verifying..." : "Verify & Access"}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-muted-foreground">Don&apos;t have an account? </span>
                            <Link href="/register" className="text-primary font-medium hover:underline">
                                Register here
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </main>

            <footer className="p-6 text-center text-xs text-muted-foreground">
                &copy; 2026 Right Reach. All rights reserved.
            </footer>
        </div>
    )
}
