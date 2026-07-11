import { NavLink } from "react-router-dom";
import { navigation } from "@/shared/constants/navigation";

export function AppSidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card text-foreground transition-colors duration-200">
      <div className="border-b px-6 py-5">
        <h1 className="text-2xl font-bold tracking-tight">LifeOS</h1>
      </div>

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
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 font-medium shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                ].join(" ")
              }
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
