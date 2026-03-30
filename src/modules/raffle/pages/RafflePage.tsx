import { Routes, Route, Navigate } from "react-router-dom";
import RaffleList from "./RaffleList";
import RaffleCreate from "./RaffleCreate";
import RaffleEdit from "./RaffleEdit";
import RaffleDetail from "./RaffleDetail";

export const RafflePage = () => {
  return (
    <>
      <Routes>
        <Route index element={<RaffleList />} />
        <Route path="create" element={<RaffleCreate />} />
        <Route path="edit/:id" element={<RaffleEdit />} />
        <Route path="detail/:id" element={<RaffleDetail />} />

        {/* Catch-all invalid route inside leaderboard module */}
        <Route path="*" element={<Navigate to="/raffle" replace />} />
      </Routes>
    </>
  );
};
