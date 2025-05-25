import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/auth';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-poppins font-bold text-xl text-primary">
            Trip Planner
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-primary">Home</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary">Dashboard</Link>
                <button
                  onClick={handleLogout}
                  className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary">Login</Link>
                <Link to="/register" className="btn bg-gray-100 text-gray-700 hover:bg-gray-200">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/" 
                  className="text-gray-600 hover:text-primary px-2 py-1 rounded-lg hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                {user ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="text-gray-600 hover:text-primary px-2 py-1 rounded-lg hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="btn bg-gray-100 text-gray-700 hover:bg-gray-200 text-left px-2"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="btn btn-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
      </div>
    </nav>
  );
}

export default Navbar;
