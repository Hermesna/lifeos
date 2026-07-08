import { AppCard } from "@/shared/components/ui/AppCard";
import { BookOpen } from "lucide-react";

export function BooksPage() {
  const currentBook = {
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    progress: 68,
    currentPage: 320,
    totalPages: 470,
  };

  return (
    <AppCard
      title="Current Reading"
      description="Knowledge backlog"
      icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
    >
      <div className="space-y-4 pt-2">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold leading-none tracking-tight text-card-foreground line-clamp-1">
            {currentBook.title}
          </h4>
          <p className="text-xs text-muted-foreground">
            by {currentBook.author}
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span className="font-medium text-card-foreground">
              {currentBook.currentPage}/{currentBook.totalPages} pgs ({currentBook.progress}%)
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${currentBook.progress}%` }}
            />
          </div>
        </div>
      </div>
    </AppCard>
  );
}