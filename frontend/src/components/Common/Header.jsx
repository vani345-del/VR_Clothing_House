import React from 'react'
import Topbar from '../Layout/Topbar'
import Navbar from '../Common/Navbar'
import { useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header>
      {isHome && <Topbar />} {/* Only show on homepage */}
      <Navbar />
    </header>
  );
};

export default Header