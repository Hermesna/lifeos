import { useState, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Check, ChevronDown } from "lucide-react"

export type Language = "es" | "en" | "fr"

interface LanguageOption {
    code: Language
    FlagComponent: () => React.JSX.Element
}

const flagWrapperStyle = "h-3.5 w-5 rounded-[2px] overflow-hidden shrink-0 border border-black/20 dark:border-white/20 shadow-[0_1px_2px_rgba(0,0,0,0.1)] flex items-center justify-center bg-card"

function SpainFlag() {
    return (
        <div className={flagWrapperStyle}>
            <svg className="h-full w-full object-cover" viewBox="0 0 750 500" preserveAspectRatio="none">
                <rect width="750" height="500" fill="#c60b1e" />
                <rect width="750" height="250" y="125" fill="#ffc400" />
            </svg>
        </div>
    )
}

function UKFlag() {
    return (
        <div className={flagWrapperStyle}>
            <svg className="h-full w-full object-cover" viewBox="0 0 60 30" preserveAspectRatio="none">
                <defs>
                    <clipPath id="uk-bound">
                        <rect width="60" height="30" />
                    </clipPath>
                </defs>
                <g clipPath="url(#uk-bound)">
                    <rect width="60" height="30" fill="#00247d" />
                    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#cf142b" strokeWidth="2" />
                    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
                    <path d="M30,0 v30 M0,15 h60" stroke="#cf142b" strokeWidth="6" />
                </g>
            </svg>
        </div>
    )
}

function FranceFlag() {
    return (
        <div className={flagWrapperStyle}>
            <svg className="h-full w-full object-cover" viewBox="0 0 900 600" preserveAspectRatio="none">
                <rect width="900" height="600" fill="#ed2939" />
                <rect width="600" height="600" fill="#fff" />
                <rect width="300" height="600" fill="#002395" />
            </svg>
        </div>
    )
}

const languages: LanguageOption[] = [
    { code: "es", FlagComponent: SpainFlag },
    { code: "en", FlagComponent: UKFlag },
    { code: "fr", FlagComponent: FranceFlag },
]

export function LanguageToggle() {
    const { i18n } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const currentLang = (i18n.language?.slice(0, 2) as Language) || "es"

    const languageNames = new Intl.DisplayNames([currentLang], { type: "language" })

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const changeLanguage = (code: Language) => {
        i18n.changeLanguage(code)
        setIsOpen(false)
    }

    const selectedLanguage = languages.find((l) => l.code === currentLang) || languages[0]
    const ActiveFlag = selectedLanguage.FlagComponent

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-2.5 text-xs font-medium text-foreground transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                aria-label="Seleccionar idioma"
            >
                <ActiveFlag />
                <span className="uppercase font-semibold tracking-wider">{currentLang}</span>
                <ChevronDown size={13} className="text-muted-foreground opacity-70" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-44 origin-top-right rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-lg transition-all animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                    <div className="space-y-0.5">
                        {languages.map((lang) => {
                            const Flag = lang.FlagComponent
                            const isSelected = currentLang === lang.code

                            const rawName = languageNames.of(lang.code) || lang.code
                            const localizedLabel = rawName.charAt(0).toUpperCase() + rawName.slice(1)

                            return (
                                <button
                                    key={lang.code}
                                    onClick={() => changeLanguage(lang.code)}
                                    className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors ${isSelected
                                        ? "bg-accent text-accent-foreground font-medium"
                                        : "hover:bg-accent/50 text-foreground/80"
                                        }`}
                                >
                                    <span className="flex items-center gap-2.5">
                                        <Flag />
                                        <span>{localizedLabel}</span>
                                    </span>
                                    {isSelected && <Check size={14} className="text-primary" />}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}