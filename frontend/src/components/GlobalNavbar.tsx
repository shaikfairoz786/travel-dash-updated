import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const GlobalNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === '/';

  // Handle scroll effect for transparent navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Dynamic Styles
  const navClasses = isHome && !scrolled
    ? 'fixed top-[48px] w-full z-40 bg-gradient-to-b from-black/70 to-transparent transition-all duration-300 py-6'
    : 'sticky top-[48px] w-full z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-secondary-100 transition-all duration-300 py-3';

  const linkBaseClasses = "font-medium relative group transition-all duration-300";
  const linkColorClasses = isHome && !scrolled
    ? 'text-white/90 hover:text-white drop-shadow-sm'
    : 'text-secondary-700 hover:text-primary-600';

  const logoTextClasses = isHome && !scrolled
    ? 'text-white drop-shadow-md'
    : 'bg-gradient-primary bg-clip-text text-transparent';

  return (
    <>
      <nav className={navClasses}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className={`flex items-center space-x-2 md:space-x-3 text-xl sm:text-2xl md:text-3xl font-bold hover:scale-105 transition-transform duration-300 ${logoTextClasses}`}>
            <img src="https://iili.io/KyD9NzF.png" alt="TravelTemplate Logo" className="h-8 w-8 md:h-12 md:w-12 rounded-full object-cover border-2 border-white/20" />
            <span>TravelTemplate</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`${linkBaseClasses} ${linkColorClasses}`}>
              Home
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${isHome && !scrolled ? 'bg-white' : 'bg-gradient-primary'}`}></span>
            </Link>
            <Link to="/plan-my-trip" className={`${linkBaseClasses} ${isHome && !scrolled ? 'text-white hover:text-primary-200' : 'text-traveltemplate-green hover:text-traveltemplate-brown'} font-bold`}>
              Plan My Trip
            </Link>
            <Link to="/blogs" className={`${linkBaseClasses} ${linkColorClasses}`}>
              Stories
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${isHome && !scrolled ? 'bg-white' : 'bg-gradient-primary'}`}></span>
            </Link>
            <Link to="/about-us" className={`${linkBaseClasses} ${linkColorClasses}`}>
              About Us
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${isHome && !scrolled ? 'bg-white' : 'bg-gradient-primary'}`}></span>
            </Link>
            <Link to="/contact" className={`${linkBaseClasses} ${linkColorClasses}`}>
              Contact
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${isHome && !scrolled ? 'bg-white' : 'bg-gradient-primary'}`}></span>
            </Link>

            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className={`${linkBaseClasses} ${linkColorClasses}`}>
                    Dashboard
                    <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${isHome && !scrolled ? 'bg-white' : 'bg-gradient-primary'}`}></span>
                  </Link>
                )}

                <div className="flex items-center space-x-4">
                  <div className="relative group flex items-center h-full py-2">
                    <span className={`font-medium cursor-pointer flex items-center gap-1 ${isHome && !scrolled ? 'text-white/90' : 'text-secondary-700'}`}>
                      Hi, {user.name.split(' ')[0]}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top overflow-hidden z-[100]">
                      <Link to="/my-bookings" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors">
                        My Bookings
                      </Link>
                      <Link to="/my-reviews" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors">
                        My Reviews
                      </Link>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className={isHome && !scrolled ? 'btn-secondary bg-white/10 text-white border-white/30 hover:bg-white/20' : 'btn-secondary text-sm px-4 py-2'}
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={`${linkBaseClasses} ${linkColorClasses}`}>
                  Login
                </Link>
                <Link to="/register" className={isHome && !scrolled ? 'px-6 py-2 rounded-full bg-white text-primary-900 font-bold hover:bg-gray-100 transition-colors' : 'btn-primary text-sm px-6 py-2 rounded-full'}>
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden z-50">
            <button
              onClick={() => setIsMenuOpen(true)}
              className={`relative z-50 p-2 hover:scale-110 transition-transform ${
                isHome && !scrolled ? 'text-white' : 'text-secondary-700'
              }`}
              aria-label="Open menu"
            >
              <svg className="h-7 w-7 sm:h-8 sm:w-8 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>

    {/* Mobile Menu Slide-Over Drawer (Rendered outside nav to escape stacking context) */}
    <div 
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[105] transition-opacity duration-300 md:hidden ${
        isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      onClick={() => setIsMenuOpen(false)}
    />
    <div 
      className={`fixed inset-y-0 right-0 w-[85%] sm:w-[350px] bg-white shadow-2xl z-[110] transform transition-transform duration-300 ease-out md:hidden flex flex-col pb-6 overflow-y-auto ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex justify-end p-4 border-b border-gray-50 mb-4 sticky top-0 bg-white z-10">
        <button
          onClick={() => setIsMenuOpen(false)}
          className="p-2 text-secondary-500 hover:text-secondary-900 bg-secondary-50 hover:bg-secondary-100 rounded-full transition-colors"
          aria-label="Close menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="px-6 space-y-4 flex-grow">
            <Link to="/" onClick={handleLinkClick} className="block px-4 py-3 rounded-xl font-semibold text-secondary-800 hover:bg-secondary-50 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link to="/plan-my-trip" onClick={handleLinkClick} className="block px-4 py-3 rounded-xl font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors">
              Plan My Trip
            </Link>
            <Link to="/blogs" onClick={handleLinkClick} className="block px-4 py-3 rounded-xl font-semibold text-secondary-800 hover:bg-secondary-50 hover:text-primary-600 transition-colors">
              Stories
            </Link>
            <Link to="/about-us" onClick={handleLinkClick} className="block px-4 py-3 rounded-xl font-semibold text-secondary-800 hover:bg-secondary-50 hover:text-primary-600 transition-colors">
              About Us
            </Link>
            <Link to="/contact" onClick={handleLinkClick} className="block px-4 py-3 rounded-xl font-semibold text-secondary-800 hover:bg-secondary-50 hover:text-primary-600 transition-colors">
              Contact
            </Link>
          </div>

          <div className="px-6 mt-8 border-t border-gray-100 pt-6">
            {!user ? (
              <div className="flex flex-col gap-3">
                <Link to="/login" onClick={handleLinkClick} className="w-full text-center py-3.5 rounded-xl font-semibold text-secondary-800 border-2 border-secondary-200 hover:bg-secondary-50">
                  Login
                </Link>
                <Link to="/register" onClick={handleLinkClick} className="w-full text-center py-3.5 rounded-xl font-bold bg-primary-600 text-white shadow-md shadow-primary-500/30 hover:bg-primary-700">
                  Register
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="px-4 py-2 mb-2 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">Signed in as</span>
                  <span className="font-semibold text-gray-900 truncate block">{user.name}</span>
                </div>
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" onClick={handleLinkClick} className="block px-4 py-3 rounded-xl font-semibold text-secondary-800 hover:bg-secondary-50 hover:text-primary-600 transition-colors">
                    Admin Dashboard
                  </Link>
                )}
                <Link to="/my-bookings" onClick={handleLinkClick} className="block px-4 py-3 rounded-xl font-semibold text-secondary-800 hover:bg-secondary-50 hover:text-primary-600 transition-colors">
                  My Bookings
                </Link>
                <Link to="/my-reviews" onClick={handleLinkClick} className="block px-4 py-3 rounded-xl font-semibold text-secondary-800 hover:bg-secondary-50 hover:text-primary-600 transition-colors">
                  My Reviews
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full mt-2 text-center px-4 py-3.5 rounded-xl font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
    </>
  );
};

export default GlobalNavbar;
