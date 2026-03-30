import { Routes, Route, Navigate } from "react-router-dom";
import WheelList from "./WheelList";
import WheelCreate from "./WheelCreate";
import WheelEdit from "./WheelEdit";
import WheelDetail from "./WheelDetail";

export const WheelPage = () => {
  return (
    <>
      <Routes>
        <Route index element={<WheelList />} />
        <Route path="create" element={<WheelCreate />} />
        <Route path="edit/:id" element={<WheelEdit />} />
        <Route path="detail/:id" element={<WheelDetail />} />

        {/* Catch-all invalid route inside leaderboard module */}
        <Route path="*" element={<Navigate to="/wheel" replace />} />
      </Routes>
    </>
  );
};
