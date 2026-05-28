import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import ReportDetails from './pages/ReportDetails';
import HowItWorks from './pages/HowItWorks';
import ContactSupport from './pages/ContactSupport';
import { Home as HomeIcon, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

function Navbar({ theme, toggleTheme }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
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
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1 md:px-1.5 py-1 md:py-1.5 rounded-2xl shadow-sm">
            <Link
              to="/"
              className={`flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1.5 rounded-xl text-xs md:text-sm font-medium transition-all ${
                location.pathname === '/' 
                  ? 'bg-brand-500/10 text-brand-500 dark:text-brand-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <HomeIcon className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
          
          <button 
            onClick={toggleTheme}
            className="p-2 md:p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 hover:shadow-md transition-all active:scale-95 shadow-sm"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
          </button>
        </div>
      </div>
    </nav>
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
