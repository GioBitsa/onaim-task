import { Routes, Route, Navigate } from "react-router-dom";
import LeaderBoardList from "./LeaderBoardList";
import LeaderBoardCreate from "./LeaderBoardCreate";
import LeaderBoardEdit from "./LeaderBoardEdit";
import LeaderBoardDetail from "./LeaderBoardDetail";

export const LeaderboardPage = () => {
  return (
    <>
      <Routes>
        <Route index element={<LeaderBoardList />} />
        <Route path="create" element={<LeaderBoardCreate />} />
        <Route path="edit/:id" element={<LeaderBoardEdit />} />
        <Route path="detail/:id" element={<LeaderBoardDetail />} />

        {/* Catch-all invalid route inside leaderboard module */}
        <Route path="*" element={<Navigate to="/leaderboard" replace />} />
      </Routes>
    </>
  );
};
