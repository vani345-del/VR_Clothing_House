import React, { useState } from 'react'
import { FaBars } from 'react-icons/fa';
import Adminsidebar from './Adminsidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    const [isSidebarOpen,setIsOpnesidebar]=useState(false);

    const togglesidebat=()=>{
        setIsOpnesidebar(!isSidebarOpen);
    }
  return (
   <div className="min-h-screen flex flex-col md:flex-row relative">
    {/* mobile toggle button */}
    <div className="flex md:hidden p-4 bg-gray-900 text-white z-20">
        <button onClick={togglesidebat}>
            <FaBars size={24}/>
            
        </button>
        <h1 className="ml-4 text-xl font-medium">Admin Dashboard</h1>
    </div>
    
    {/* Overlay for mobilesidebar */}

    {isSidebarOpen &&(
        <div onClick={togglesidebat} className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"></div>
    )}
    {/* sidebar */}
    <div className={`bg-gray-900 w-64 min-h-screen text-white absolute md:relative transform ${isSidebarOpen ? "translate-x-0":"-translate-x-full"} transition-transform duration-300 md:translate-x-0 md:static md:block z-20`}>
        {/* sidebar */}
        <Adminsidebar/>
    </div>
    {/* MAin content */}
    <div className="flex-grow p-6 overflow-auto">
        <Outlet/>
            
    </div>

   </div>

  )
}

export default AdminLayout