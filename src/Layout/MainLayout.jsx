import Sidebar from "./Sidebar";

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 bg-gray-100 overflow-auto">
        {children}
      </div>
    </div>
  );
}