import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import {
  Star,
  Clock,
  BookOpen,
  Award,
  CheckCircle,
  Play
} from 'lucide-react';
import { courses as mockCourses } from '../data/mockData';
import { api } from '../services/api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAuth } from '../context/AuthContext';

export function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollMessage, setEnrollMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  useEffect(() => {
    if (!id) return;
    api.getCourse(Number(id))
      .then(setCourse)
      .catch(() => setCourse(mockCourses.find((c) => c.id === id) || null))
      .finally(() => setLoading(false));
      
    if (user?.role === 'STUDENT' && id) {
      api.getDashboard(Number(user.id))
        .then((data: any) => {
          if (data && data.courses) {
             const found = data.courses.find((c: any) => String(c.id) === String(id) || String(c.course_id) === String(id));
             if (found) setIsEnrolled(true);
          }
        })
        .catch(console.error);
    }
  }, [id, user]);

  const showMessage = (type: 'success'|'error', text: string) => {
    setEnrollMessage({ type, text });
    setTimeout(() => setEnrollMessage(null), 3000);
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/connexion');
      return;
    }
    if (user.role !== 'STUDENT') {
      showMessage('error', "Seuls les étudiants peuvent s'inscrire à des cours.");
      return;
    }
    
    setIsEnrolling(true);
    try {
      await api.enroll(Number(user.id), Number(course.id));
      setIsEnrolled(true);
      showMessage('success', "Inscription réussie !");
    } catch (err: any) {
      showMessage('error', err.message || "Erreur lors de l'inscription");
    } finally {
      setIsEnrolling(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Chargement du cours...</div>;
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Cours non trouvé</h1>
        <Link to="/cours" className="text-primary hover:underline mt-4 block">
          Retour à la liste des cours
        </Link>
      </div>
    );
  }

  type LessonRow = { id: string; title: string; duration: string; completed: boolean };
  const mockLessons: LessonRow[] =
    course.lessons && course.lessons.length > 0
      ? course.lessons.map((l: any, i: number) => ({
          ...l,
          id: String(l.id),
          title: String(l.title),
          completed: i < 2,
          duration: l.duration || '15 min',
        }))
      : Array.from({ length: 5 }, (_, i) => ({
          id: `${i + 1}`,
          title: `Leçon ${i + 1}: ${course.title}`,
          duration: '20 min',
          completed: i < 2,
        }));

  return (
    <div className="min-h-screen relative">
      {enrollMessage && (
        <div className={`fixed top-20 right-4 z-[60] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white transition-all ${enrollMessage.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          <CheckCircle className="size-5" />
          <span className="font-medium">{enrollMessage.text}</span>
        </div>
      )}

      <div className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-primary rounded-full text-sm mb-4">
                {course.category}
              </span>
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-slate-300 mb-6">
                {course.description}
              </p>
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="size-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-slate-300">
                    ({course.reviews || course.studentsCount || 0} avis)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="size-5" />
                  <span>{course.exercises || 5} exercices</span>
                </div>
              </div>
              <div className="flex gap-4">
                {isEnrolled ? (
                  <button className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2" disabled>
                    <CheckCircle className="size-5" /> Déjà inscrit
                  </button>
                ) : (
                  <button 
                    onClick={handleEnroll} 
                    disabled={isEnrolling}
                    className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium disabled:opacity-50">
                    {isEnrolling ? 'Inscription...' : "S'inscrire"}
                  </button>
                )}
                <button className="px-8 py-3 border border-white text-white rounded-lg hover:bg-white/10 transition">
                  {isEnrolled ? "Accéder au cours" : "Aperçu"}
                </button>
              </div>
            </div>
            <div>
              <ImageWithFallback
                src={course.image}
                alt={course.title}
                className="w-full h-80 object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">
                Ce que vous allez apprendre
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(course.objectives || []).map((objective: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="size-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{objective}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Contenu du cours</h2>
              <div className="space-y-2">
                {mockLessons.map((lesson: LessonRow, index: number) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 flex items-center justify-center rounded-full bg-primary/10">
                        {lesson.completed ? (
                          <CheckCircle className="size-5 text-primary" />
                        ) : (
                          <Play className="size-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{lesson.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {lesson.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Prérequis</h2>
              <ul className="space-y-2">
                {(course.prerequisites || []).map((prereq: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{prereq}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <h3 className="font-bold mb-4">Informations du cours</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Niveau</p>
                  <p className="font-medium">{course.level}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Durée</p>
                  <p className="font-medium">{course.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Exercices
                  </p>
                  <p className="font-medium">{course.exercises || 5} QCM</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Catégorie
                  </p>
                  <p className="font-medium">{course.category}</p>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-4">
                     <Award className="size-6 text-primary" />
                    <span className="font-medium">
                      Certificat de réussite
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Obtenez un certificat gratuit en complétant le cours et en
                    réussissant le test final.
                  </p>
                </div>
              </div>
              {isEnrolled && (
                <Link
                  to={`/cours/${course.id}/quiz`}
                  className="mt-6 block text-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-bold"
                >
                  Passer le quiz final
                </Link>
              )}
              <Link
                to="/certificat"
                className="mt-3 block text-center px-6 py-3 bg-accent text-primary rounded-lg hover:bg-accent/80 transition"
              >
                En savoir plus sur le certificat
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
