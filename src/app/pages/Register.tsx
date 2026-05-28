import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { User, Mail, Lock, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { register: registerContext } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    try {
      await registerContext(formData.name, formData.email, formData.password);
      setTimeout(() => {
          navigate('/student');
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Inscription impossible');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative order-2 lg:order-1">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10 mt-8 md:mt-0"
        >
          <div className="text-center lg:text-left mb-10">
            <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-8">
              <img src="/iga-logo.webp" alt="IGA Learning" className="h-10 w-auto object-contain" />
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Créer un compte</h1>
            <p className="text-muted-foreground text-lg">Rejoignez-nous pour commencer à apprendre</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-primary"></div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1.5 text-sm font-semibold text-slate-700">Nom complet</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jean Dupont"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-semibold text-slate-700">Adresse e-mail</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-semibold text-slate-700">Mot de passe</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-semibold text-slate-700">Confirmer le mot de passe</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100 flex items-center gap-2">
                  <span className="flex size-4 bg-red-600 rounded-full text-white items-center justify-center text-[10px] font-bold">!</span>
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group w-full relative flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-xl hover:bg-primary transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden mt-6"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">{loading ? 'Création en cours...' : "S'inscrire"}</span>
                {!loading && <ArrowRight className="relative z-10 size-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-600 font-medium">
              Déjà un compte ?{' '}
              <Link to="/connexion" className="text-primary hover:text-blue-800 font-semibold transition-colors">
                Se connecter
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Image & Branding */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden order-1 lg:order-2"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-secondary/30 to-transparent"></div>
        
        <div className="relative z-10 p-12 flex flex-col justify-between h-full w-full">
          <div className="flex justify-end">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-14 items-center justify-center rounded-xl bg-white shadow-xl p-2">
                <img src="/iga-logo.webp" alt="IGA Learning" className="h-full w-auto object-contain" />
              </div>
            </Link>
          </div>

          <div className="mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-white mb-6 leading-tight"
            >
              Donnez un nouvel élan<br/>à votre carrière.
            </motion.h2>
            <div className="space-y-4">
              {[
                "Des formateurs experts à votre écoute",
                "Une plateforme intuitive et performante",
                "Des exercices pratiques et des quiz interactifs"
              ].map((text, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="flex items-center gap-3 text-slate-300"
                >
                  <CheckCircle2 className="size-5 text-emerald-400" />
                  <span className="text-lg">{text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
