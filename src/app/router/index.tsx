import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import { AppLayout } from "@/app/layout/AppLayout";
import { LanguagesPage } from "@/features/languages/pages/LanguagesPage";
import { BooksPage } from "@/features/books/pages/BooksPage";
import { TravelPage } from "@/features/travel/pages/TravelPage";
import HabitsPage from "@/features/habits/pages/HabitsPage";
import { NotFoundPage } from "@/shared/components/ui/NotFoundPage";
import { FinancePage } from "@/features/finance/pages/FinancePage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
      {
        path: "/finance",
        element: <FinancePage />,
      },
      {
        path: "/languages",
        element: <LanguagesPage />,
      },
      {
        path: "/books",
        element: <BooksPage />,
      },
      {
        path: "/habits",
        element: <HabitsPage />,
      },
      {
        path: "/travel",
        element: <TravelPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
