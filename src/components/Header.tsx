import React, { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './auth/AuthModal';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handler for Contact click
  const handleContactClick = () => {
    if (location.pathname === '/') {
      const el = document.getElementById('contact');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollToContact: true } });
    }
    setIsMenuOpen(false);
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-green-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">AI Humanizer</span>
          </div>
          
          <nav className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Home</Link>
            <Link to="/pricing" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Pricing</Link>
            <button
              onClick={handleContactClick}
              className="text-gray-700 hover:text-green-600 transition-colors font-medium bg-transparent border-none outline-none cursor-pointer"
              style={{ padding: 0 }}
            >
              Contact
            </button>
            {!user ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors font-medium"
              >
                Login
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">{profile?.name || user.email}</span>
                <button
                  onClick={signOut}
                  className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>
          
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden mt-2 py-3 bg-white rounded-lg shadow-lg">
            <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Home</Link>
            <Link to="/pricing" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Pricing</Link>
            <button
              onClick={handleContactClick}
              className="block w-full text-left px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 bg-transparent border-none outline-none cursor-pointer"
            >
              Contact
            </button>
            {!user ? (
              <button
                onClick={() => { setShowAuthModal(true); setIsMenuOpen(false); }}
                className="block w-full text-left px-4 py-2 text-green-600 font-medium hover:bg-gray-100"
              >
                Login
              </button>
            ) : (
              <>
                <span className="block px-4 py-2 text-gray-700 font-medium">{profile?.name || user.email}</span>
                <button
                  onClick={() => { signOut(); setIsMenuOpen(false); }}
                  className="block w-full text-left px-4 py-2 text-gray-700 font-medium hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};