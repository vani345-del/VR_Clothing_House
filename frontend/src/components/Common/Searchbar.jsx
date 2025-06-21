import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiMagnifyingGlass, HiMiniXCircle } from 'react-icons/hi2';

const Searchbar = () => {
  const [searchText, setSearchText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get current category from pathname
  const pathname = location.pathname;
  const category = pathname.startsWith('/sarees')
    ? 'sarees'
    : pathname.startsWith('/dresses')
    ? 'dresses'
    : pathname.startsWith('/kidsware')
    ? 'kidsware'
    : '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchText.trim() || !category) return;

    navigate(`/${category}?search=${encodeURIComponent(searchText.trim())}`);
    setIsOpen(false);
    setSearchText('');
  };

  const toggleSearchbar = () => {
    setIsOpen(!isOpen);
    setSearchText('');
  };

  return (
    <div
      className={`flex items-center justify-center w-full ${
        isOpen ? 'absolute top-0 left-0 w-full bg-white h-24 z-50' : 'w-auto'
      }`}
    >
      {isOpen ? (
        <form onSubmit={handleSubmit} className="relative flex justify-center items-center w-full">
          <div className="relative w-4/5 sm:w-1/2">
            <input
              type="text"
              placeholder={`Search in ${category}...`}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="bg-gray-100 px-4 py-2 pr-12 pl-2 rounded-lg focus:outline-none w-full"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              <HiMagnifyingGlass className="h-6 w-6" />
            </button>
          </div>
          <button
            type="button"
            onClick={toggleSearchbar}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
          >
            <HiMiniXCircle className="h-6 w-6" />
          </button>
        </form>
      ) : (
        <button onClick={toggleSearchbar}>
          <HiMagnifyingGlass className="h-7 w-7" />
        </button>
      )}
    </div>
  );
};

export default Searchbar;
