import { NavLink } from "react-router-dom";
import { navigation } from "@/shared/constants/navigation";

export function AppSidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-colors duration-200">
      <div className="border-b border-sidebar-border px-6 py-5">
        <h1 className="text-2xl font-bold tracking-tight text-sidebar-primary">
          LifeOS
        </h1>
      </div>

      {/* Navegación */}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-md shadow-primary/10"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-primary",
                ].join(" ")
              }
            >
              <Icon size={20} className="shrink-0" />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
