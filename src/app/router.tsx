import { createBrowserRouter, Navigate } from "react-router-dom";
import { AdminLayout } from "../shared/layout/AdminLayout";
import { LeaderboardPage } from "../modules/leaderboard/pages/LeaderboardPage";
import { RafflePage } from "../modules/raffle/pages/RafflePage";
import { WheelPage } from "../modules/wheel/pages/WheelPage";
import { NotFoundPage } from "../shared/components/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <AdminLayout />,
    children: [
      { path: "/", element: <Navigate to="/leaderboard" replace /> },
      { path: "/leaderboard/*", element: <LeaderboardPage /> },
      { path: "/raffle/*", element: <RafflePage /> },
      { path: "/wheel/*", element: <WheelPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
