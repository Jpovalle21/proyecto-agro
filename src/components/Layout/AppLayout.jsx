import { Outlet } from "react-router-dom";
import MainSidebar from "./MainSidebar";

export default function AppLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc]">
      <MainSidebar />

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
