import { createBrowserRouter } from "react-router-dom";

import AppLayout from "@/app/layout/AppLayout";

import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import CareerPage from "@/features/career/pages/CareerPage";
import FinancePage from "@/features/finance/pages/FinancePage";
import LanguagesPage from "@/features/languages/pages/LanguagesPage";
import BooksPage from "@/features/books/pages/BooksPage";
import HabitsPage from "@/features/habits/pages/HabitsPage";
import TravelPage from "@/features/travel/pages/TravelPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
      {
        path: "/career",
        element: <CareerPage />,
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
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },
]);