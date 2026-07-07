import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";

interface AppCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
}

function AppCard({
  title,
  description,
  icon,
  children,
}: AppCardProps) {
  return (
    <Card className="h-full shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>

          {description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {icon}
      </CardHeader>

      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default AppCard;