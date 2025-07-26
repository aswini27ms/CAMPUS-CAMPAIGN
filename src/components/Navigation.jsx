import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { currentUser, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Campus Feed', path: '/campus-feed' },
    { name: 'Announcements', path: '/announcements' },
    { name: 'Timetable', path: '/timetable' },
    { name: 'Lost & Found', path: '/lost-found' },
    {
      name: 'Services',
      dropdown: [
        { name: 'Hostel Support', path: '/hostel-support' },
        { name: 'Complaints', path: '/complaints' },
        { name: 'Skill Learning', path: '/skill-learning' },
        { name: 'Book Session', path: '/session-booking' },
        { name: 'Polls FeedBack', path: '/pollsfeedback' },
        { name: 'TechOpportunities', path: '/techopportunities' },
      ]
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 bg-white/95 backdrop-blur-xl shadow-md border-b border-gray-200`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 transition-colors duration-300">
              Campus<span className="text-blue-600">Link</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-800 transition-all duration-200 hover:text-blue-600 rounded-lg">
                      {item.name}
                      <ChevronDown size={16} className="ml-1 transition-transform duration-200 group-hover:rotate-180" />
                    </button>
                    {openDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-200 py-3 z-[200] overflow-hidden"
                      >
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            to={dropdownItem.path}
                            className="block px-5 py-3 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:text-blue-600 ${
                      location.pathname === item.path ? 'text-blue-600' : 'text-gray-800'
                    }`}
                  >
                    {item.name}
                    {location.pathname === item.path && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                        layoutId="activeTab"
                      />
                    )}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 px-4 py-2 text-gray-800 hover:text-blue-600 transition-colors"
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="px-6 py-2 font-medium text-gray-800 rounded-lg hover:text-blue-600 transition-all duration-300">
                  Sign In
                </Link>
                <Link to="/login" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1.5 relative">
              <span className={`w-6 h-0.5 transition-all duration-300 origin-center ${isMobileMenuOpen ? 'rotate-45 translate-y-2 bg-blue-600' : 'bg-gray-800'}`}></span>
              <span className={`w-6 h-0.5 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-0' : 'bg-gray-800'}`}></span>
              <span className={`w-6 h-0.5 transition-all duration-300 origin-center ${isMobileMenuOpen ? '-rotate-45 -translate-y-2 bg-blue-600' : 'bg-gray-800'}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className={`lg:hidden overflow-hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isMobileMenuOpen ? 1 : 0, height: isMobileMenuOpen ? 'auto' : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="py-6 border-t border-gray-200 bg-white">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.dropdown ? (
                  <div className="mb-2">
                    <div className="px-6 py-3 text-base font-bold text-gray-800 bg-gray-100 border-l-4 border-blue-500">
                      {item.name}
                    </div>
                    {item.dropdown.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.name}
                        to={dropdownItem.path}
                        className={`block px-10 py-3 text-sm font-medium border-l-2 ${
                          location.pathname === dropdownItem.path
                            ? 'text-blue-600 bg-blue-50 border-blue-400 translate-x-2'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 border-transparent hover:border-blue-200 hover:translate-x-1'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {dropdownItem.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`block px-6 py-4 text-base font-medium border-l-4 ${
                      location.pathname === item.path
                        ? 'text-blue-600 bg-blue-50 border-blue-500 translate-x-2'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-transparent hover:border-blue-300 hover:translate-x-1'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="px-6 py-6 space-y-4 border-t border-gray-200 bg-gray-50">
              {currentUser ? (
                <>
                  <Link 
                    to="/profile" 
                    className="block w-full py-3 text-center text-gray-700 font-bold border-2 border-gray-300 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-all duration-300 transform hover:scale-105" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <User size={18} />
                      <span>Profile</span>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block w-full py-3 text-center text-gray-700 font-bold border-2 border-gray-300 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-all duration-300 transform hover:scale-105" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                  <Link to="/login" className="block w-full py-3 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1" onClick={() => setIsMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navigation;