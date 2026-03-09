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
    ? 'fixed top-[48px] sm:top-[44px] w-full z-40 bg-gradient-to-b from-black/70 to-transparent transition-all duration-300 py-6'
    : 'sticky top-[48px] sm:top-[44px] w-full z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-secondary-100 transition-all duration-300 py-3';

  const linkBaseClasses = "font-medium relative group transition-all duration-300";
  const linkColorClasses = isHome && !scrolled
    ? 'text-white/90 hover:text-white drop-shadow-sm'
    : 'text-secondary-700 hover:text-primary-600';

  const logoTextClasses = isHome && !scrolled
    ? 'text-white drop-shadow-md'
    : 'bg-gradient-primary bg-clip-text text-transparent';

  return (
    <nav className={navClasses}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className={`flex items-center space-x-3 text-2xl md:text-3xl font-bold hover:scale-105 transition-transform duration-300 ${logoTextClasses}`}>
            <img src="https://iili.io/KyD9NzF.png" alt="TravelTemplate Logo" className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-white/20" />
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

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${isHome && !scrolled ? 'text-white' : 'text-secondary-700'} hover:scale-110 transition-transform p-2`}
              aria-label="Toggle menu"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden animate-slide-up mt-4">
            <div className={`px-4 pt-4 pb-6 space-y-2 rounded-2xl border ${isHome && !scrolled ? 'bg-white/10 backdrop-blur-xl border-white/20' : 'bg-white border-secondary-100 shadow-xl'}`}>
              <Link to="/" onClick={handleLinkClick} className={`block px-4 py-3 rounded-lg font-medium transition-colors ${isHome && !scrolled ? 'text-white hover:bg-white/10' : 'text-secondary-700 hover:bg-secondary-50'}`}>
                Home
              </Link>
              <Link to="/plan-my-trip" onClick={handleLinkClick} className={`block px-4 py-3 rounded-lg font-bold transition-colors ${isHome && !scrolled ? 'text-green-300 hover:bg-white/10' : 'text-traveltemplate-green hover:bg-secondary-50'}`}>
                Plan My Trip
              </Link>
              <Link to="/blogs" onClick={handleLinkClick} className={`block px-4 py-3 rounded-lg font-medium transition-colors ${isHome && !scrolled ? 'text-white hover:bg-white/10' : 'text-secondary-700 hover:bg-secondary-50'}`}>
                Stories
              </Link>
              <Link to="/about-us" onClick={handleLinkClick} className={`block px-4 py-3 rounded-lg font-medium transition-colors ${isHome && !scrolled ? 'text-white hover:bg-white/10' : 'text-secondary-700 hover:bg-secondary-50'}`}>
                About Us
              </Link>
              <Link to="/contact" onClick={handleLinkClick} className={`block px-4 py-3 rounded-lg font-medium transition-colors ${isHome && !scrolled ? 'text-white hover:bg-white/10' : 'text-secondary-700 hover:bg-secondary-50'}`}>
                Contact
              </Link>

              {!user ? (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Link to="/login" onClick={handleLinkClick} className={`text-center py-3 rounded-lg font-semibold ${isHome && !scrolled ? 'text-white border border-white/30' : 'text-secondary-700 border border-secondary-200'}`}>
                    Login
                  </Link>
                  <Link to="/register" onClick={handleLinkClick} className="text-center py-3 rounded-lg font-bold bg-primary-600 text-white">
                    Register
                  </Link>
                </div>
              ) : (
                <div className="space-y-2 mt-2 pt-2 border-t border-gray-200/20">
                  <div className={`px-4 py-2 text-xs font-bold uppercase tracking-wider ${isHome && !scrolled ? 'text-white/60' : 'text-gray-400'}`}>
                    My Account
                  </div>
                  <Link to="/my-bookings" onClick={handleLinkClick} className={`block px-4 py-3 rounded-lg font-medium transition-colors ${isHome && !scrolled ? 'text-white hover:bg-white/10' : 'text-secondary-700 hover:bg-secondary-50'}`}>
                    My Bookings
                  </Link>
                  <Link to="/my-reviews" onClick={handleLinkClick} className={`block px-4 py-3 rounded-lg font-medium transition-colors ${isHome && !scrolled ? 'text-white hover:bg-white/10' : 'text-secondary-700 hover:bg-secondary-50'}`}>
                    My Reviews
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${isHome && !scrolled ? 'text-red-300 hover:bg-white/10' : 'text-red-600 hover:bg-red-50'}`}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default GlobalNavbar;
