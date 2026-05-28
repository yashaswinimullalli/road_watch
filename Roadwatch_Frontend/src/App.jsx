import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import ReportDetails from './pages/ReportDetails';
import HowItWorks from './pages/HowItWorks';
import ContactSupport from './pages/ContactSupport';
import { Home as HomeIcon, Moon, Sun, Menu, X, LayoutDashboard, HelpCircle, Phone, Clock, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';


function Navbar({ theme, toggleTheme }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Home', icon: <HomeIcon className="w-4 h-4" /> },
    { to: '/admin', label: 'City Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/how-it-works', label: 'How It Works', icon: <HelpCircle className="w-4 h-4" /> },
    { to: '/contact-support', label: 'Contact Support', icon: <Phone className="w-4 h-4" /> },
  ];

  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 py-2 md:py-3 shadow-sm' : 'bg-transparent py-3 md:py-6'}`}>
        <div className="max-w-7xl mx-auto px-3 md:px-6 flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-1.5 md:gap-2 group shrink-0 min-w-0">
            <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold text-base md:text-xl shadow-lg transition-transform group-hover:scale-105">
              R
            </div>
            <span className="text-sm sm:text-base md:text-xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors truncate">
              RoadSathi
            </span>
          </Link>
          
          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-1.5 rounded-2xl shadow-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-medium transition-all ${
                    location.pathname === link.to 
                      ? 'bg-brand-500/10 text-brand-500 dark:text-brand-400' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Home Icon (Standalone shortcut) */}
            <div className="lg:hidden flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1 py-1 rounded-2xl shadow-sm">
              <Link
                to="/"
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  location.pathname === '/' 
                    ? 'bg-brand-500/10 text-brand-500 dark:text-brand-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
                aria-label="Home"
              >
                <HomeIcon className="w-4 h-4 shrink-0" />
              </Link>
            </div>
            
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2 md:p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 hover:shadow-md transition-all active:scale-95 shadow-sm"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
            </button>

            {/* Mobile Drawer Toggle Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 hover:shadow-md transition-all active:scale-95 shadow-sm"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Drawer Panel */}
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col p-6 pt-24 animate-slide-up">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Navigation</h3>
            </div>

            <div className="flex flex-col gap-2 flex-grow">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.to 
                      ? 'bg-brand-500/10 text-brand-500 dark:text-brand-400' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </Link>
              ))}

              {/* History shortcut section inside drawer */}
              <div className="border-t border-slate-150 dark:border-slate-800/80 my-4 pt-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Recent Actions
                </h3>
                <div className="flex flex-col gap-2">
                  <Link
                    to={localStorage.getItem('lastReportId') ? `/report/${localStorage.getItem('lastReportId')}` : '/report'}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Review Last Report</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-auto">
              <p className="text-xxs text-slate-400 text-center">RoadSathi Platform v1.0.0</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [userCoords, setUserCoords] = useState(null);

  useEffect(() => {
    // NEW FEATURE: Location fetching and saving
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            if (data && data.display_name) {
              const locationString = data.display_name;

              // Store coords + address in state so Home can use them
              setUserCoords({ latitude, longitude, address: locationString });

              await fetch('http://localhost:5000/api/location', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ location: locationString, latitude, longitude }),
              });
              console.log('Location saved successfully');
            } else {
              // No address but still store raw coords
              setUserCoords({ latitude, longitude, address: null });
            }
          } catch (err) {
            console.error('Error in location flow:', err);
            setUserCoords({ latitude, longitude, address: null });
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col transition-colors duration-300 bg-slate-50 dark:bg-slate-950">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main className="flex-grow pt-14 sm:pt-16 md:pt-24 pb-4 md:pb-8 px-2 sm:px-3 md:px-6 relative flex flex-col min-h-0 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home coords={userCoords} />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/report" element={<ReportDetails />} />
            <Route path="/report/:id" element={<ReportDetails />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/contact-support" element={<ContactSupport />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
