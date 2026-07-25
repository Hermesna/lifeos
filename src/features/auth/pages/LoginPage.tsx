import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"

import { useAuthStore } from "@/shared/stores/useAuthStore"
import { loginSchema, type LoginFormData } from "../schemas/loginSchema"

export function LoginPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const login = useAuthStore((state) => state.login)

    const [showPassword, setShowPassword] = useState(false)
    const [authError, setAuthError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    })

    const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
        setAuthError(null)

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))

            const mockId = "usr_" + crypto.randomUUID().slice(0, 8)

            login(
                {
                    id: mockId,
                    name: data.email.split("@")[0],
                    email: data.email,
                },
                "mock_jwt_bearer_token"
            )

            navigate("/", { replace: true })
        } catch {
            setAuthError("Credenciales inválidas. Por favor verifica tu correo y contraseña.")
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground transition-colors duration-200">
            <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-xl">
                <div className="space-y-2 text-center">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <LogIn className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        {t("auth.welcomeBack", "Bienvenido a LifeOS")}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t("auth.loginSubtitle", "Introduce tus credenciales para acceder a tu cuenta")}
                    </p>
                </div>

                {authError && (
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-center text-sm text-destructive">
                        {authError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            {t("auth.emailLabel", "Correo Electrónico")}
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="tu@email.com"
                                className={`w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:ring-2 ${
                                    errors.email
                                        ? "border-destructive focus:ring-destructive/30"
                                        : "border-input focus:border-primary focus:ring-primary/20"
                                }`}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-foreground">
                                {t("auth.passwordLabel", "Contraseña")}
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-xs text-primary hover:underline"
                            >
                                {t("auth.forgotPassword", "¿Olvidaste tu contraseña?")}
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                {...register("password")}
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className={`w-full rounded-lg border bg-background py-2 pl-9 pr-10 text-sm outline-none transition-colors focus:ring-2 ${
                                    errors.password
                                        ? "border-destructive focus:ring-destructive/30"
                                        : "border-input focus:border-primary focus:ring-primary/20"
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-destructive">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                        <input
                            {...register("rememberMe")}
                            type="checkbox"
                            id="rememberMe"
                            className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary/20"
                        />
                        <label htmlFor="rememberMe" className="text-sm text-muted-foreground">
                            {t("auth.rememberMe", "Recordar mi sesión")}
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>{t("auth.loggingIn", "Iniciando sesión...")}</span>
                            </>
                        ) : (
                            <span>{t("auth.loginButton", "Iniciar Sesión")}</span>
                        )}
                    </button>
                </form>

                <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
                    <span>{t("auth.noAccount", "¿No tienes una cuenta?")} </span>
                    <Link to="/register" className="font-semibold text-primary hover:underline">
                        {t("auth.signUp", "Regístrate gratis")}
                    </Link>
                </div>
            </div>
        </div>
    )
}