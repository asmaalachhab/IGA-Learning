import React, { useEffect, useState } from 'react';
import { BookOpen, Award, TrendingUp, Settings, FileText, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Link } from 'react-router';

export function StudentDashboard() {
  const { user } = useAuth();
  const [selectedPage, setSelectedPage] = useState('dashboard');
  
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
        loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
        const [dashData, allCourses, allQuizzes, res, certs] = await Promise.all([
            api.getDashboard(Number(user?.id)).catch(() => ({ courses: [] })),
            api.getCourses(),
            api.getAllQuizzes().catch(() => []),
            api.getResultsByStudent(Number(user?.id)).catch(() => []),
            api.getCertificatesByStudent(Number(user?.id)).catch(() => [])
        ]);
        
        const enrolled = dashData.courses || [];
        setEnrolledCourses(enrolled);
        setAvailableCourses(allCourses.filter((c: any) => !enrolled.find((e: any) => e.id === c.id)));
        setQuizzes(allQuizzes);
        setResults(res);
        setCertificates(certs);
    } catch(e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const renderContent = () => {
    if (selectedPage === 'courses') {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-6">Tous mes cours</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledCourses.map(course => (
              <div key={course.id} className="flex gap-4 border bg-white p-4 rounded-lg shadow-sm">
                  <img src={course.image || 'https://via.placeholder.com/150'} alt={course.title} className="w-24 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-1">{course.title}</h3>
                    <div className="w-full bg-muted rounded-full h-2 mt-4">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Link to={`/cours/${course.id}`} className="bg-primary text-primary-foreground px-4 py-1.5 rounded text-sm hover:opacity-90">Continuer</Link>
                    </div>
                  </div>
              </div>
            ))}
            {enrolledCourses.length === 0 && <p className="text-muted-foreground">Vous n'êtes inscrit à aucun cours.</p>}
          </div>
        </div>
      );
    }

    if (selectedPage === 'available') {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-6">Cours disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availableCourses.map(course => (
              <div key={course.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <img src={course.image || 'https://via.placeholder.com/300x200'} alt={course.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{course.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{course.description}</p>
                    <Link to={`/cours/${course.id}`} className="block w-full text-center bg-primary/10 text-primary px-4 py-2 rounded hover:bg-primary/20">Voir les détails</Link>
                  </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (selectedPage === 'quizzes') {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-6">Mes Quiz</h2>
          <div className="grid grid-cols-1 gap-4">
            {quizzes.map(q => {
               const isDone = results.find(r => r.quiz_id === q.id);
               return (
                <div key={q.id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{q.title}</h3>
                    <p className="text-sm text-muted-foreground">Score requis: {q.passing_score}%</p>
                  </div>
                  {isDone ? (
                    <span className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
                      <CheckCircle className="size-4" /> Terminé ({isDone.score}%)
                    </span>
                  ) : (
                    <Link to={`/cours/${q.course_id}/quiz`} className="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90">Passer le quiz</Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (selectedPage === 'certificates') {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-6">Mes Certificats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert, i) => (
              <div key={i} className="bg-white border rounded-lg p-6 shadow-sm flex items-start gap-4">
                 <div className="p-3 bg-green-100 text-green-700 rounded-full">
                    <Award className="size-8" />
                 </div>
                 <div>
                    <h3 className="font-bold text-lg">{cert.course_name}</h3>
                    <p className="text-muted-foreground text-sm">Délivré le: {new Date(cert.issue_date).toLocaleDateString()}</p>
                    <p className="text-sm font-medium mt-1">Score: {cert.score}%</p>
                    <Link to="/certificat" className="inline-block mt-4 text-primary hover:underline text-sm font-medium">Télécharger</Link>
                 </div>
              </div>
            ))}
            {certificates.length === 0 && <p className="text-muted-foreground">Vous n'avez pas encore de certificats.</p>}
          </div>
        </div>
      );
    }

    // Default Dashboard
    if (loading) {
        return (
            <div className="animate-pulse space-y-8">
                <div className="h-10 bg-slate-200 rounded w-1/3 mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-lg"></div>)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-64 bg-slate-200 rounded-lg"></div>
                    <div className="h-64 bg-slate-200 rounded-lg"></div>
                </div>
            </div>
        );
    }

    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Mon Tableau de bord</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <BookOpen className="size-8 text-primary mx-auto mb-2" />
            <p className="text-3xl font-bold">{enrolledCourses.length}</p>
            <p className="text-muted-foreground text-sm">Cours suivis</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <Award className="size-8 text-primary mx-auto mb-2" />
            <p className="text-3xl font-bold">{certificates.length}</p>
            <p className="text-muted-foreground text-sm">Certificats</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <TrendingUp className="size-8 text-primary mx-auto mb-2" />
            <p className="text-3xl font-bold">14h</p>
            <p className="text-muted-foreground text-sm">Temps d'apprentissage</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Mes Cours (En cours)</h2>
                </div>
                <div className="space-y-4">
                    {enrolledCourses.slice(0, 2).map(course => (
                    <div key={course.id} className="flex gap-4 border p-4 rounded-lg">
                        <img src={course.image || 'https://via.placeholder.com/150'} alt={course.title} className="w-20 h-16 object-cover rounded" />
                        <div className="flex-1">
                        <h3 className="font-semibold line-clamp-1">{course.title}</h3>
                        <div className="w-full bg-muted rounded-full h-2 mt-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        </div>
                        <div className="flex items-center">
                        <Link to={`/cours/${course.id}`} className="bg-primary/10 text-primary px-3 py-1 rounded text-sm font-medium hover:bg-primary/20">Continuer</Link>
                        </div>
                    </div>
                    ))}
                    {enrolledCourses.length === 0 && <p className="text-sm text-muted-foreground">Aucun cours en cours.</p>}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Cours Disponibles</h2>
                    <button onClick={() => setSelectedPage('available')} className="text-primary text-sm hover:underline">Voir tout</button>
                </div>
                <div className="space-y-4">
                    {availableCourses.slice(0, 3).map(course => (
                    <div key={course.id} className="flex items-center justify-between border p-3 rounded-lg">
                        <h3 className="font-semibold line-clamp-1 text-sm">{course.title}</h3>
                        <Link to={`/cours/${course.id}`} className="text-primary text-sm hover:underline">S'inscrire</Link>
                    </div>
                    ))}
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Quiz Disponibles</h2>
                  <button onClick={() => setSelectedPage('quizzes')} className="text-primary text-sm hover:underline">Voir tout</button>
                </div>
                <div className="space-y-4">
                    {quizzes.slice(0, 3).map(q => (
                    <div key={'q-'+q.id} className="flex items-center justify-between border p-3 rounded-lg">
                        <h3 className="font-semibold text-sm">Quiz : {q.title}</h3>
                        <Link to={`/cours/${q.course_id}/quiz`} className="text-primary text-sm font-medium hover:underline">Passer</Link>
                    </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Mes Certificats</h2>
                  <button onClick={() => setSelectedPage('certificates')} className="text-primary text-sm hover:underline">Voir tout</button>
                </div>
                <div className="space-y-4">
                    {certificates.slice(0, 2).map((cert, i) => (
                    <div key={'cert-'+i} className="flex items-center justify-between border p-3 rounded-lg bg-green-50/50">
                        <div className="flex items-center gap-3">
                            <Award className="text-green-600 size-5" />
                            <h3 className="font-semibold text-sm text-green-800">{cert.course_name}</h3>
                        </div>
                        <Link to="/certificat" className="text-green-700 bg-green-200/50 px-3 py-1 rounded text-sm font-medium hover:bg-green-200">Voir</Link>
                    </div>
                    ))}
                    {certificates.length === 0 && <p className="text-sm text-muted-foreground">Aucun certificat.</p>}
                </div>
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-muted">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r h-screen sticky top-0 flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary">Espace Étudiant</h2>
        </div>
        <nav className="space-y-2 px-4 flex-1">
          <button onClick={() => setSelectedPage('dashboard')} className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg ${selectedPage === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
            <Settings className="size-5" /> Dashboard
          </button>
          <button onClick={() => setSelectedPage('courses')} className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg ${selectedPage === 'courses' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
            <BookOpen className="size-5" /> Mes Cours
          </button>
          <button onClick={() => setSelectedPage('available')} className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg ${selectedPage === 'available' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
            <BookOpen className="size-5" /> Cours Disponibles
          </button>
          <button onClick={() => setSelectedPage('quizzes')} className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg ${selectedPage === 'quizzes' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
            <FileText className="size-5" /> Quiz & Notes
          </button>
          <button onClick={() => setSelectedPage('certificates')} className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg ${selectedPage === 'certificates' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
            <Award className="size-5" /> Mes Certificats
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
}
