import { useState, type FormEvent, type ChangeEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/shared/stores/useAuthStore"
import { Button } from "@/components/ui/button"
import { LogIn, UserPlus } from "lucide-react"

export function LoginPage() {
    const [isRegistering, setIsRegistering] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    
    const login = useAuthStore((state) => state.login)
    const register = useAuthStore((state) => state.register)
    const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle)
    const navigate = useNavigate()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError("")
        try {
            if (isRegistering) {
                await register(email, password)
            } else {
                await login(email, password)
            }
            navigate("/")
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Ocurrió un error en la autenticación"
            setError(errorMessage)
        }
    }

    const handleGoogleLogin = async () => {
        setError("")
        try {
            await loginWithGoogle()
            navigate("/")
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Error al iniciar sesión con Google"
            setError(errorMessage)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-6 shadow-md">
                <div className="text-center space-y-1">
                    <h1 className="text-xl font-bold">
                        {isRegistering ? "Crear una cuenta" : "Bienvenido de nuevo"}
                    </h1>
                    <p className="text-xs text-muted-foreground">
                        {isRegistering ? "Regístrate para empezar a organizar tu vida" : "Accede a tu panel personal"}
                    </p>
                </div>

                {error && (
                    <div className="p-3 text-xs rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Correo electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            required
                            placeholder="tu@correo.com"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        {isRegistering ? <UserPlus className="h-4 w-4 mr-2" /> : <LogIn className="h-4 w-4 mr-2" />}
                        {isRegistering ? "Registrarse" : "Iniciar Sesión"}
                    </Button>
                </form>

                <div className="relative flex py-2 items-center">
                    <div className="grow border-t border-border"></div>
                    <span className="shrink mx-4 text-xs text-muted-foreground uppercase">O continúa con</span>
                    <div className="grow border-t border-border"></div>
                </div>

                <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleGoogleLogin}
                >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    Google
                </Button>

                <div className="text-center pt-2">
                    <button
                        type="button"
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
                    >
                        {isRegistering ? "¿Ya tienes una cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
                    </button>
                </div>
            </div>
        </div>
    )
}