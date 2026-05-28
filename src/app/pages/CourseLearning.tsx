import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, Heart, NotebookPen, PlayCircle, Star } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

function num(v: unknown, fallback = 0) { const n = Number(v); return Number.isFinite(n) ? n : fallback; }

export function CourseLearning() {
  const { id } = useParams();
  const courseId = num(id);
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [course, setCourse] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      const [c, p] = await Promise.all([
        api.getCourse(courseId),
        user?.id ? api.getProgress(Number(user.id), courseId).catch(() => null) : Promise.resolve(null),
      ]);
      if (!mounted) return;
      setCourse(c);
      setProgress(p);
      if (p?.lesson_id && Array.isArray(c.lessons)) {
        const idx = c.lessons.findIndex((l: any) => Number(l.id) === Number(p.lesson_id));
        if (idx >= 0) setActiveIndex(idx);
      }
      setNotes(localStorage.getItem(`iga_notes_${courseId}`) || '');
    }
    load().catch(() => setCourse(null));
    return () => { mounted = false; };
  }, [courseId, user?.id]);

  const lessons = useMemo(() => course?.lessons?.length ? course.lessons : [
    { id: 1, title: 'Introduction au cours', duration: '08:00', video_url: course?.video_url || '' },
    { id: 2, title: 'Concepts essentiels', duration: '18:00', video_url: course?.video_url || '' },
    { id: 3, title: 'Projet pratique', duration: '25:00', video_url: course?.video_url || '' },
  ], [course]);
  const activeLesson = lessons[activeIndex] || lessons[0];
  const percent = Math.round(((activeIndex + (progress?.completed ? 1 : 0)) / Math.max(lessons.length, 1)) * 100);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !progress) return;
    const last = num(progress.last_position, 0);
    if (last > 0) v.currentTime = last;
  }, [activeLesson?.id, progress]);

  useEffect(() => {
    const timer = setInterval(() => {
      const v = videoRef.current;
      if (!v || !user?.id || !activeLesson?.id) return;
      api.saveProgress({ userId: Number(user.id), courseId, lessonId: Number(activeLesson.id), lastPosition: Math.floor(v.currentTime), watchedSeconds: Math.floor(v.currentTime), completed: false }).catch(() => {});
    }, 10000);
    return () => clearInterval(timer);
  }, [user?.id, courseId, activeLesson?.id]);

  async function markCompleted() {
    if (!user?.id || !activeLesson?.id) return;
    await api.updateLessonProgress({ userId: Number(user.id), courseId, lessonId: Number(activeLesson.id), completed: true, lastPosition: Math.floor(videoRef.current?.currentTime || 0) });
    setMessage('Leçon marquée comme terminée.');
    if (activeIndex < lessons.length - 1) setActiveIndex(activeIndex + 1);
  }

  function saveNotes(value: string) {
    setNotes(value); localStorage.setItem(`iga_notes_${courseId}`, value);
  }

  if (!course) return <div className="container mx-auto px-4 py-16">Chargement du cours...</div>;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="container mx-auto px-4 py-6">
        <Link to={`/cours/${courseId}`} className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-6"><ArrowLeft className="size-4" /> Retour au cours</Link>
        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10">
            <video ref={videoRef} src={activeLesson?.video_url || course.video_url || ''} controls className="w-full aspect-video bg-black" poster={course.image} />
            <div className="p-6 bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div><p className="text-blue-300 text-sm">Leçon {activeIndex + 1}/{lessons.length}</p><h1 className="text-2xl font-bold">{activeLesson?.title || course.title}</h1></div>
                <button onClick={markCompleted} className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 font-semibold text-white hover:bg-emerald-600"><CheckCircle2 className="size-5" /> Marquer terminé</button>
              </div>
              {message && <p className="mt-4 text-emerald-300">{message}</p>}
              <div className="mt-6 h-3 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-blue-500" style={{ width: `${Math.min(percent, 100)}%` }} /></div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button disabled={activeIndex === 0} onClick={() => setActiveIndex(i => Math.max(0, i - 1))} className="rounded-full bg-white/10 px-5 py-2 disabled:opacity-40">Précédent</button>
                <button disabled={activeIndex >= lessons.length - 1} onClick={() => setActiveIndex(i => Math.min(lessons.length - 1, i + 1))} className="inline-flex items-center gap-2 rounded-full bg-white text-slate-900 px-5 py-2 disabled:opacity-40">Suivant <ArrowRight className="size-4" /></button>
                <Link to={`/cours/${courseId}/quiz`} className="rounded-full bg-amber-400 text-slate-950 px-5 py-2 font-semibold">Quiz</Link>
              </div>
            </div>
          </motion.section>
          <aside className="space-y-4">
            <div className="rounded-3xl bg-white text-slate-900 p-5 shadow-xl"><h2 className="font-bold text-xl mb-4 flex items-center gap-2"><PlayCircle className="size-5 text-blue-600" /> Playlist</h2><div className="space-y-2">{lessons.map((lesson: any, index: number) => (<button key={lesson.id || index} onClick={() => setActiveIndex(index)} className={`w-full text-left rounded-2xl p-4 border transition ${index === activeIndex ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:bg-slate-50'}`}><p className="font-semibold line-clamp-1">{lesson.title}</p><p className="text-sm text-slate-500">{lesson.duration || '10 min'}</p></button>))}</div></div>
            <div className="rounded-3xl bg-white text-slate-900 p-5 shadow-xl"><h2 className="font-bold text-xl mb-3 flex items-center gap-2"><NotebookPen className="size-5 text-blue-600" /> Mes notes</h2><textarea value={notes} onChange={e => saveNotes(e.target.value)} className="w-full min-h-32 rounded-2xl border border-slate-200 p-3" placeholder="Écris tes notes ici..." /></div>
            <div className="rounded-3xl bg-white/10 p-5 border border-white/10"><h2 className="font-bold mb-3">Ressources</h2><p className="flex items-center gap-2 text-blue-100"><FileText className="size-4" /> PDF du cours</p><p className="flex items-center gap-2 text-blue-100 mt-2"><Heart className="size-4" /> Favoris</p><p className="flex items-center gap-2 text-blue-100 mt-2"><Star className="size-4" /> Recommandations</p></div>
          </aside>
        </div>
      </div>
    </main>
  );
}
