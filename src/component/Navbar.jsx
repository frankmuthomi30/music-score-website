import React, { useState, useEffect } from 'react';
import { Menu, X, Music, BookOpen, Upload, Info, Sun, Moon, LogIn, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const navItems = [
    { name: 'Home', icon: Music, path: '/' },
    { name: 'Browse', icon: BookOpen, path: '/browse' },
    { name: 'Upload', icon: Upload, path: '/upload' },
    { name: 'About', icon: Info, path: '/about' },
    { name: 'Sign In', icon: LogIn, path: '/signin' },
    { name: 'Sign Out', icon: LogOut, path: '/signout' },
    { name: 'Profile', icon: User, path: '/profile' }  // New Profile item
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navbarBackground = isDarkMode
    ? `bg-gradient-to-r from-gray-900 to-gray-800`
    : `bg-gradient-to-r from-blue-500 to-purple-600`;

  const textColor = isDarkMode ? 'text-white' : 'text-white';

  return (
    <nav className={`${navbarBackground} p-4 shadow-lg fixed w-full top-0 z-50 transition-all duration-300`}
         style={{ 
           boxShadow: `0 ${Math.min(scrollPosition / 10, 20)}px 30px rgba(0,0,0,0.1)`,
           padding: `${Math.max(16 - scrollPosition / 30, 8)}px 1rem`
         }}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className={`text-2xl md:text-3xl font-extrabold ${textColor} transition-transform duration-300 transform hover:scale-105`}>
          Kikuyu Music Sheets
        </h1>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`focus:outline-none ${textColor}`}
          >
            {isOpen ? <X size={28} className="animate-spin" /> : <Menu size={28} className="animate-bounce" />}
          </button>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center ${textColor} hover:text-cyan-200 transition-all duration-300 transform hover:scale-110`}
              >
                <item.icon size={20} className="mr-2" />
                <span className="text-lg">{item.name}</span>
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`flex items-center ${textColor} hover:text-yellow-300 transition-all duration-300 transform hover:scale-110`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </li>
        </ul>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className={`mt-4 space-y-4 md:hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-4 animate-fadeIn`}>
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center ${isDarkMode ? 'text-gray-200 hover:text-blue-400' : 'text-gray-800 hover:text-blue-600'} transition-colors duration-300`}
              >
                <item.icon size={22} className={`mr-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                <span className="text-xl">{item.name}</span>
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`flex items-center ${isDarkMode ? 'text-gray-200 hover:text-yellow-300' : 'text-gray-800 hover:text-yellow-500'} transition-colors duration-300`}
            >
              {isDarkMode ? <Sun size={22} className="mr-3 text-yellow-300" /> : <Moon size={22} className="mr-3 text-gray-600" />}
              <span className="text-xl">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
