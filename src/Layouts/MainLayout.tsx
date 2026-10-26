import { Outlet } from "react-router";
import Navbar from "../Components/Navbar/Navbar";


export default function MainLayout() {
  return (
    <>
      <div className="min-h-screen bg-secondary">
        <Navbar />
        
        
        <Outlet />
      </div>
    </>
  );
}
