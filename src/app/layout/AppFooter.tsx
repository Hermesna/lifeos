export function AppFooter() {
    return (
        <footer className="py-3 px-4 md:px-6 text-center text-xs text-muted-foreground border-t border-border/40 bg-background/55 backdrop-blur-xs transition-colors duration-200 shrink-0 z-10">
            Made by{" "}
            <a 
                href="https://www.linkedin.com/in/hermesnunez" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-foreground hover:text-primary hover:underline transition-colors"
            >
                Hermes Núñez
            </a>
        </footer>
    )
}