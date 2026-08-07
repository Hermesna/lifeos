import { useState, type FormEvent, type ChangeEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuthStore } from "@/shared/stores/useAuthStore"
import { Button } from "@/components/ui/button"
import { LogIn, UserPlus, ArrowLeft, Mail } from "lucide-react"

const getFriendlyErrorMessage = (err: unknown, t: (key: string, options?: { defaultValue: string }) => string): string => {
    if (typeof err === "object" && err !== null && "code" in err) {
        const code = (err as { code: string }).code
        switch (code) {
            case "auth/invalid-credential":
            case "auth/wrong-password":
            case "auth/user-not-found":
                return t("auth.errors.invalidCredential", { defaultValue: "Correo electrónico o contraseña incorrectos." })
            case "auth/email-already-in-use":
                return t("auth.errors.emailInUse", { defaultValue: "Este correo electrónico ya está registrado." })
            case "auth/weak-password":
                return t("auth.errors.weakPassword", { defaultValue: "La contraseña es demasiado débil (mínimo 6 caracteres)." })
            case "auth/invalid-email":
                return t("auth.errors.invalidEmail", { defaultValue: "El formato del correo electrónico no es válido." })
            case "auth/too-many-requests":
                return t("auth.errors.tooManyRequests", { defaultValue: "Demasiados intentos fallidos. Inténtalo de nuevo más tarde." })
            default:
                break
        }
    }
    
    if (err instanceof Error) {
        const msg = err.message.toLowerCase()
        if (msg.includes("invalid-credential") || msg.includes("wrong-password") || msg.includes("user-not-found")) {
            return t("auth.errors.invalidCredential", { defaultValue: "Correo electrónico o contraseña incorrectos." })
        }
        if (msg.includes("email-already-in-use")) {
            return t("auth.errors.emailInUse", { defaultValue: "Este correo electrónico ya está registrado." })
        }
        return err.message
    }
    
    return t("auth.errors.default", { defaultValue: "Ocurrió un error en la autenticación" })
}

export function LoginPage() {
    const { t } = useTranslation()
    const [isRegistering, setIsRegistering] = useState(false)
    const [isForgotPassword, setIsForgotPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    
    const login = useAuthStore((state) => state.login)
    const register = useAuthStore((state) => state.register)
    const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle)
    const resetPassword = useAuthStore((state) => state.resetPassword)
    const navigate = useNavigate()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccessMessage("")
        try {
            if (isRegistering) {
                await register(email, password)
            } else {
                await login(email, password)
            }
            navigate("/")
        } catch (err: unknown) {
            setError(getFriendlyErrorMessage(err, t))
        }
    }

    const handleForgotPasswordSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccessMessage("")
        try {
            if (resetPassword) {
                await resetPassword(email)
            }
            setSuccessMessage(t("auth.success.resetEmailSent", { defaultValue: "Te hemos enviado un correo electrónico con las instrucciones para restablecer tu contraseña." }))
        } catch (err: unknown) {
            setError(getFriendlyErrorMessage(err, t))
        }
    }

    const handleGoogleLogin = async () => {
        setError("")
        setSuccessMessage("")
        try {
            await loginWithGoogle()
            navigate("/")
        } catch (err: unknown) {
            setError(getFriendlyErrorMessage(err, t))
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
            <div className="w-full max-w-md max-h-[90vh] overflow-y-auto space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                
                <div className="text-center space-y-1">
                    <h1 className="text-lg sm:text-xl font-bold">
                        {isForgotPassword 
                            ? t("auth.titles.forgotPassword", { defaultValue: "Recuperar contraseña" }) 
                            : isRegistering 
                                ? t("auth.titles.register", { defaultValue: "Crear una cuenta" }) 
                                : t("auth.titles.login", { defaultValue: "Bienvenido de nuevo" })}
                    </h1>
                    <p className="text-xs text-muted-foreground">
                        {isForgotPassword 
                            ? t("auth.subtitles.forgotPassword", { defaultValue: "Introduce tu correo para recibir las instrucciones" }) 
                            : isRegistering 
                                ? t("auth.subtitles.register", { defaultValue: "Regístrate para empezar a organizar tu vida" }) 
                                : t("auth.subtitles.login", { defaultValue: "Accede a tu panel personal" })}
                    </p>
                </div>

                {error && (
                    <div className="p-3 text-xs rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="p-3 text-xs rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {successMessage}
                    </div>
                )}

                {isForgotPassword ? (
                    <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">
                                {t("auth.labels.email", { defaultValue: "Correo electrónico" })}
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                required
                                placeholder={t("auth.placeholders.email", { defaultValue: "tu@correo.com" })}
                                className="flex h-10 sm:h-9 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                            />
                        </div>

                        <Button type="submit" className="w-full rounded-xl h-10 sm:h-9 cursor-pointer shadow-sm">
                            <Mail className="h-4 w-4 mr-2" />
                            {t("auth.buttons.sendInstructions", { defaultValue: "Enviar instrucciones" })}
                        </Button>

                        <div className="text-center pt-1">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsForgotPassword(false)
                                    setError("")
                                    setSuccessMessage("")
                                }}
                                className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground underline transition-colors cursor-pointer"
                            >
                                <ArrowLeft className="h-3 w-3 mr-1" />
                                {t("auth.links.backToLogin", { defaultValue: "Volver al inicio de sesión" })}
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">
                                    {t("auth.labels.email", { defaultValue: "Correo electrónico" })}
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                    required
                                    placeholder={t("auth.placeholders.email", { defaultValue: "tu@correo.com" })}
                                    className="flex h-10 sm:h-9 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                                />
                            </div>
                            
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        {t("auth.labels.password", { defaultValue: "Contraseña" })}
                                    </label>
                                    {!isRegistering && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsForgotPassword(true)
                                                setError("")
                                                setSuccessMessage("")
                                            }}
                                            className="text-[11px] text-primary hover:underline transition-colors cursor-pointer"
                                        >
                                            {t("auth.links.forgotPassword", { defaultValue: "¿Has olvidado tu contraseña?" })}
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="flex h-10 sm:h-9 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                                />
                            </div>

                            <Button type="submit" className="w-full rounded-xl h-10 sm:h-9 cursor-pointer shadow-sm">
                                {isRegistering ? <UserPlus className="h-4 w-4 mr-2" /> : <LogIn className="h-4 w-4 mr-2" />}
                                {isRegistering 
                                    ? t("auth.buttons.register", { defaultValue: "Registrarse" }) 
                                    : t("auth.buttons.login", { defaultValue: "Iniciar Sesión" })}
                            </Button>
                        </form>

                        <div className="relative flex py-1 items-center">
                            <div className="grow border-t border-border"></div>
                            <span className="shrink mx-3 text-[11px] text-muted-foreground uppercase tracking-wider">
                                {t("auth.orContinueWith", { defaultValue: "O continúa con" })}
                            </span>
                            <div className="grow border-t border-border"></div>
                        </div>

                        <Button 
                            type="button" 
                            variant="outline" 
                            className="w-full rounded-xl h-10 sm:h-9 cursor-pointer" 
                            onClick={handleGoogleLogin}
                        >
                            <svg className="h-4 w-4 mr-2 shrink-0" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                            </svg>
                            Google
                        </Button>

                        <div className="text-center pt-1">
                            <button
                                type="button"
                                onClick={() => setIsRegistering(!isRegistering)}
                                className="text-xs text-muted-foreground hover:text-foreground underline transition-colors cursor-pointer"
                            >
                                {isRegistering 
                                    ? t("auth.toggle.hasAccount", { defaultValue: "¿Ya tienes una cuenta? Inicia sesión" }) 
                                    : t("auth.toggle.noAccount", { defaultValue: "¿No tienes cuenta? Regístrate" })}
                            </button>
                        </div>
                    </>
                )}

            </div>
        </div>
    )
}