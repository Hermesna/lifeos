import { Link } from "react-router-dom";
import { FileQuestion, ArrowLeft } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border bg-muted/40 text-muted-foreground shadow-sm animate-bounce">
        <FileQuestion className="h-10 w-10 text-primary" />
      </div>

      {/* Código de error */}
      <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-4">
        Error 404
      </span>

      {/* Textos descriptivos */}
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-md leading-relaxed">
        The destination you are trying to access does not exist, has been moved,
        or we might have pruned it from the system.
      </p>

      <div className="mt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-md bg-primary h-9 px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
