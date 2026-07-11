import { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { navigation } from "@/shared/constants/navigation";
import { ThemeToggle } from "@/shared/components/ui/ThemeToggle";
import { User, Settings, LogOut, Shield } from "lucide-react";

export function AppHeader() {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentRoute = navigation.find(
    (item) => item.href === location.pathname,
  );
  const pageTitle = currentRoute ? currentRoute.title : "Dashboard";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-header px-6 text-foreground transition-colors duration-200 z-40">
      <h2 className="text-lg font-semibold text-primary transition-all duration-200">
        {pageTitle}
      </h2>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring/50"
            aria-haspopup="true"
            aria-expanded={isProfileOpen}
          >
            HN
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-lg transition-all animate-in fade-in slide-in-from-top-2 duration-150 z-50">
              <div className="px-3 py-2 text-xs border-b border-border/60 mb-1">
                <p className="font-medium text-foreground">Hermes</p>
                <p className="text-muted-foreground truncate">
                  hermesnunezalcaraz@gmail.com
                </p>
              </div>

              <div className="space-y-0.5">
                <Link
                  to="/perfil"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <User size={16} className="text-muted-foreground" />
                  <span>Mi Perfil</span>
                </Link>

                <Link
                  to="/ajustes"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Settings size={16} className="text-muted-foreground" />
                  <span>Ajustes</span>
                </Link>

                <Link
                  to="/seguridad"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Shield size={16} className="text-muted-foreground" />
                  <span>Seguridad</span>
                </Link>
              </div>

              <div className="my-1 border-t border-border/60" />

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  console.log("Cerrando sesión...");
                }}
                className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors text-left font-medium"
              >
                <LogOut size={16} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
