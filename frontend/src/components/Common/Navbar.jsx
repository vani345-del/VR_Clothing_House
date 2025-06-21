import { HiOutlineShoppingBag, HiOutlineUser } from 'react-icons/hi';
import { HiBars3BottomRight } from 'react-icons/hi2';
import { Link, useLocation } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';
import { useEffect, useState } from 'react';
import Searchbar from './Searchbar';
import CartDrawer from '../Layout/CartDrawer';
import { useSelector } from 'react-redux';
import logo from '../../assets/biglogo.png';

// ✅ Helper to detect current category from path
const getCategoryFromPath = (path) => {
  if (path.includes("/sarees")) return "Sarees";
  if (path.includes("/dresses")) return "Dresses";
  if (path.includes("/kidsware")) return "Kidswear";
  return "Sarees"; // default
};

const Navbar = () => {
  const [drawerOpen, setOpen] = useState(false);
  const [toggle3bar, setToggle3bar] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const cartItemCount = cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0;
  const location = useLocation();
  const currentCategory = getCategoryFromPath(location.pathname);

  const handletogglebar3 = () => {
    setToggle3bar(!toggle3bar);
  };

  const toggleDrawer = () => {
    setOpen(!drawerOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';
  const isSmallDevice = window.innerWidth < 768;

  const navBackground = isHome && !isScrolled
    ? 'bg-transparent text-white shadow-none'
    : 'bg-white text-black shadow-md';

  const navTop = isHome && !isScrolled ? 'top-6' : 'top-0';

  return (
    <>
      <nav className={`fixed ${navTop} left-0 w-full px-4 py-4 z-30 transition-all duration-300 ${navBackground}`}>
        <div className="flex items-center justify-between w-full">

          {/* Left Side */}
          <div className='flex items-center space-x-4'>
            {/* Logo on small screens after scroll */}
            {isSmallDevice && (!isHome || isScrolled) && (
              <img
                src={logo}
                alt="Logo"
                className="h-10 w-auto max-h-10 transition-all duration-300"
              />
            )}

            {/* Nav Links for md and up */}
            <div className='hidden md:flex space-x-6'>
              <Link to="/" className='relative text-sm font-bold uppercase group'>
                Home
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/sarees" className='relative text-sm font-bold uppercase group'>
                Sarees
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/dresses" className='relative text-sm font-bold uppercase group'>
                Dresses
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/kidsware" className='relative text-sm font-bold uppercase group'>
                Kidsware
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>

          {/* Center Logo (only for md+ if not home or scrolled) */}
          <div className="hidden md:flex justify-center w-full absolute left-0 right-0 mx-auto pointer-events-none">
            {(!isHome || isScrolled) && (
              <img
                src={logo}
                alt="Logo"
                className="h-12 w-auto max-h-12 transition-all duration-300 pointer-events-none"
              />
            )}
          </div>

          {/* Right Side */}
          <div className='flex items-center space-x-3'>
            {/* Admin Link */}
            {user && user.role === "admin" && (
              <Link to='/admin' className='hidden sm:block bg-black px-2 rounded text-sm text-white'>Admin</Link>
            )}

            {/* Searchbar for md and up */}
            <div className='hidden md:flex items-center gap-1 font-bold'>
              <Searchbar category={currentCategory} />
            </div>

            {/* Searchbar for mobile */}
            <div className='flex md:hidden items-center'>
              <Searchbar category={currentCategory} />
            </div>

            <Link to='/profile' className=' font-bold'>
              <HiOutlineUser className='h-6 w-6' />
            </Link>

            <button onClick={toggleDrawer} className='relative font-bold'>
              <HiOutlineShoppingBag className='h-6 w-6 font-bold' />
              {cartItemCount > 0 && (
                <span className='absolute -top-1 bg-[#ea2e0e] text-white text-xs rounded-full px-2 py-0.5'>
                  {cartItemCount}
                </span>
              )}
            </button>

            <button onClick={handletogglebar3} className='md:hidden'>
              <HiBars3BottomRight className='h-6 w-6' />
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />

      {/* MOBILE MENU */}
      <div className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${toggle3bar ? "translate-x-0" : "-translate-x-full"}`}>
        <div className='flex justify-end p-4'>
          <button onClick={handletogglebar3}>
            <IoMdClose className='h-6 w-6 text-black' />
          </button>
        </div>
        <div className='p-4'>
          <h2 className='text-xl font-semibold mb-4'>Menu</h2>
          <nav className='space-y-4'>
             <Link to="/" onClick={handletogglebar3} className='block text-black hover:text-gray-700'>Home</Link>
            <Link to="/sarees" onClick={handletogglebar3} className='block text-black hover:text-gray-700'>Sarees</Link>
            <Link to="/dresses" onClick={handletogglebar3} className='block text-black hover:text-gray-700'>Dresses</Link>
            <Link to="/kidsware" onClick={handletogglebar3} className='block text-black hover:text-gray-700'>Kidsware</Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;

