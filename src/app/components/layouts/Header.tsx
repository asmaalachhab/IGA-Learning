import { Link, useLocation } from 'react-router';
import { Search, BookOpen, Menu, User, X, LogOut, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'TEACHER') return '/teacher';
    return '/student';
  };

  const navLinks = [
    { name: 'Certificat', path: '/certificat' },
    { name: 'Blog', path: '/blog' },
    { name: 'À propos', path: '/a-propos' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 bg-white/95 backdrop-blur-xl shadow-md border-b border-slate-200 py-2`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to={getDashboardLink()} className="flex items-center gap-3 group">
              <img 
                src="/iga-logo.webp" 
                alt="IGA Learning" 
                className="h-[50px] w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                    location.pathname === link.path 
                      ? 'text-[#0072bc] bg-blue-50' 
                      : 'text-slate-800 hover:text-[#0072bc] hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-full text-slate-700 hover:text-[#0072bc] hover:bg-slate-50 transition-colors duration-200"
            >
              <Search className="size-5" />
            </button>

            <div className="w-px h-6 mx-2 bg-slate-200"></div>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to={getDashboardLink()} className="flex items-center gap-3 p-1.5 pr-4 rounded-full border border-slate-200 hover:border-primary/30 hover:bg-slate-50 text-slate-800 transition-colors">
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold leading-tight">{user.name}</span>
                    <span className="text-[10px] uppercase tracking-wider opacity-70">{user.role}</span>
                  </div>
                </Link>
                
                <button
                  onClick={logout}
                  className="p-2.5 rounded-full text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
                  title="Déconnexion"
                >
                  <LogOut className="size-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/connexion"
                  className="text-sm font-semibold text-slate-800 hover:text-[#0072bc] hover:bg-slate-50 px-4 py-2 rounded-full transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/inscription"
                  className="text-sm font-semibold px-5 py-2.5 rounded-full bg-[#0072bc] text-white hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          <button
            className="lg:hidden p-2 rounded-full text-slate-800 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Search Bar Dropdown */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg overflow-hidden z-40"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="relative max-w-3xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Que souhaitez-vous apprendre ?"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg shadow-inner"
                  autoFocus
                />
                <button 
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 bg-slate-200/50 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden top-[72px]"
            />
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-[72px] right-0 bottom-0 w-[85%] max-w-sm bg-white border-l border-slate-200 shadow-2xl z-50 lg:hidden overflow-y-auto flex flex-col"
            >
              <div className="p-6 flex flex-col gap-6 h-full">
                {user ? (
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-4">
                    <div className="size-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{user.name}</h4>
                      <span className="text-xs font-semibold text-primary px-2 py-0.5 bg-primary/10 rounded-full uppercase tracking-wider">{user.role}</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/connexion"
                      className="flex items-center justify-center py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl"
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/inscription"
                      className="flex items-center justify-center py-3 bg-primary text-white font-semibold rounded-xl shadow-lg shadow-primary/20"
                    >
                      S'inscrire
                    </Link>
                  </div>
                )}

                <nav className="flex flex-col gap-2 flex-1">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-4 px-2">Navigation</div>
                  <Link
                    to="/explorer"
                    className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-slate-50 text-slate-900 font-medium hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="size-5 text-primary" />
                      Explorer les cours
                    </div>
                    <ChevronRight className="size-4 text-slate-400" />
                  </Link>
                  
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="flex items-center justify-between px-4 py-3.5 rounded-xl text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      {link.name}
                      <ChevronRight className="size-4 text-slate-300" />
                    </Link>
                  ))}
                  
                  {user && (
                    <>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6 px-2">Mon Espace</div>
                      <Link
                        to={getDashboardLink()}
                        className="flex items-center justify-between px-4 py-3.5 rounded-xl text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        Tableau de bord
                        <ChevronRight className="size-4 text-slate-300" />
                      </Link>
                      <Link
                        to="/profil"
                        className="flex items-center justify-between px-4 py-3.5 rounded-xl text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        Mon Profil
                        <ChevronRight className="size-4 text-slate-300" />
                      </Link>
                    </>
                  )}
                </nav>

                {user && (
                  <div className="pt-4 border-t border-slate-100 mt-auto">
                    <button 
                      onClick={logout} 
                      className="flex items-center justify-center w-full gap-2 px-4 py-4 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="size-5" /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
