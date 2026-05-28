import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: Array<'ADMIN' | 'TEACHER' | 'STUDENT'>;
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="relative z-10 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 shadow-xl mb-6"
        >
          <BookOpen className="size-10 text-white" />
        </motion.div>
        <div className="flex flex-col items-center z-10">
          <h2 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">IGA Learning</h2>
          <div className="flex items-center gap-1">
            <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-primary"></motion.div>
            <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-primary"></motion.div>
            <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-primary"></motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    // Rediriger vers login si non connecté
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Si l'utilisateur n'a pas le bon rôle, rediriger vers son dashboard par défaut
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'TEACHER') return <Navigate to="/teacher" replace />;
    return <Navigate to="/student" replace />;
  }

  return <>{children}</>;
}
