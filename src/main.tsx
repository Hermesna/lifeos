import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import "./index.css"
import "./i18n"
import { router } from "@/app/router"
import { ThemeProvider } from "@/shared/providers/ThemeProvider"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider defaultTheme="system">
            <RouterProvider router={router} />
        </ThemeProvider>
    </StrictMode>
)