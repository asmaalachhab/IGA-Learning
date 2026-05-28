import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Award, BookOpen, Clock, Heart, Star, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useState } from 'react';

interface Props { course: any; compact?: boolean; horizontal?: boolean; }

export function CourseCard({ course, compact = false, horizontal = false }: Props) {
  const { user } = useAuth();
  const [favorite, setFavorite] = useState(Boolean(course.favorite));
  const progress = Number(course.progress || course.progress_percent || 0);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    if (!user?.id) return;
    setFavorite(v => !v);
    api.toggleFavorite(Number(user.id), Number(course.id)).catch(() => setFavorite(v => !v));
  }

  return (
    <motion.article whileHover={{ y: -6 }} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-2xl transition-all">
      <Link to={`/cours/${course.id}`} className="block">
        <div className="relative h-48 overflow-hidden bg-slate-100">
          <img src={course.image || course.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80'} alt={course.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-blue-700 shadow">{course.level || course.difficulty || 'Débutant'}</div>
          <button onClick={toggle} className={`absolute right-3 top-3 rounded-full p-2 shadow transition ${favorite ? 'bg-red-500 text-white' : 'bg-white/95 text-slate-700'}`} aria-label="Ajouter aux favoris"><Heart className="size-5" fill={favorite ? 'currentColor' : 'none'} /></button>
        </div>
        <div className="p-5">
          <div className="mb-3 flex items-center justify-between gap-2 text-sm text-slate-500"><span className="inline-flex items-center gap-1"><BookOpen className="size-4 text-blue-600" /> {course.category || 'Formation'}</span><span className="inline-flex items-center gap-1"><Star className="size-4 text-amber-400" fill="currentColor" /> {course.rating || '4.8'}</span></div>
          <h3 className="line-clamp-2 text-lg font-extrabold text-slate-900">{course.title}</h3>
          {!compact && <p className="mt-2 line-clamp-2 text-sm text-slate-600">{course.description}</p>}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500"><span className="inline-flex items-center gap-1"><Clock className="size-4" /> {course.duration || '2h 30'}</span><span className="inline-flex items-center gap-1"><Users className="size-4" /> {course.students || course.students_count || 0} étudiants</span><span className="inline-flex items-center gap-1"><Award className="size-4" /> Certificat</span><span>{course.teacher_name || course.teacher || 'IGA Learning'}</span></div>
          {progress > 0 && <div className="mt-4"><div className="flex justify-between text-xs font-semibold"><span>Progression</span><span>{progress}%</span></div><div className="mt-1 h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min(progress, 100)}%` }} /></div></div>}
          <div className="mt-5 flex items-center justify-between"><span className="font-bold text-blue-700">{course.price ? `${course.price} DH` : 'Gratuit'}</span><span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Voir le cours</span></div>
        </div>
      </Link>
    </motion.article>
  );
}
