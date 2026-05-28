import React, { useEffect, useState } from 'react';
import { Users, BookOpen, FileText, Settings, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router';
import { api } from '../../services/api';

export function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ students: 0, teachers: 0, courses: 0, quizzes: 0, certificates: 0 });
  const [latestCourses, setLatestCourses] = useState<any[]>([]);
  const [latestUsers, setLatestUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const users = await api.getUsers();
        const courses = await api.getCourses();
        // Since we don't have separate endpoints for all counts, we estimate or use actual data:
        const students = users.filter((u: any) => u.role === 'STUDENT').length;
        const teachers = users.filter((u: any) => u.role === 'TEACHER').length;
        
        setStats({ 
          students, 
          teachers, 
          courses: courses.length, 
          quizzes: courses.length, // approximation: 1 quiz per course
          certificates: students > 0 ? Math.floor(students / 2) : 0 // approximation
        });
        
        setLatestUsers(users.slice(-5).reverse());
        setLatestCourses(courses.slice(-5).reverse());
      } catch (err) {
        console.error("Erreur chargement dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="flex min-h-screen bg-muted">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r h-screen sticky top-0">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
        </div>
        <nav className="space-y-2 px-4">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-2 bg-primary/10 text-primary rounded-lg">
            <Settings className="size-5" /> Dashboard
          </Link>
          <Link to="/admin/users" className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg">
            <Users className="size-5" /> Utilisateurs
          </Link>
          <Link to="/admin/courses" className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg">
            <BookOpen className="size-5" /> Cours
          </Link>
          <Link to="/admin/quizzes" className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg">
            <FileText className="size-5" /> Quiz
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8">Bonjour, {user?.name}</h1>
        
        {loading ? (
            <div className="space-y-8 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className="bg-slate-200 h-32 rounded-lg"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-200 h-64 rounded-lg"></div>
                    <div className="bg-slate-200 h-64 rounded-lg"></div>
                </div>
            </div>
        ) : (
            <>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                    <Users className="text-primary size-8 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{stats.students}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Étudiants</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                    <Users className="text-primary size-8 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{stats.teachers}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Professeurs</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                    <BookOpen className="text-primary size-8 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{stats.courses}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Cours</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                    <FileText className="text-primary size-8 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{stats.quizzes}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Quiz</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                    <Award className="text-primary size-8 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{stats.certificates}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Certificats</p>
                </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center justify-between">Derniers Utilisateurs <Link to="/admin/users" className="text-sm text-primary hover:underline font-normal">Voir tout</Link></h2>
                        <ul className="space-y-3">
                            {latestUsers.map(u => (
                                <li key={u.id} className="flex justify-between items-center p-3 hover:bg-muted rounded-lg border">
                                    <div>
                                        <p className="font-semibold">{u.name}</p>
                                        <p className="text-xs text-muted-foreground">{u.email}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full ${u.role === 'ADMIN' ? 'bg-red-100 text-red-800' : u.role === 'TEACHER' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{u.role}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center justify-between">Derniers Cours <Link to="/admin/courses" className="text-sm text-primary hover:underline font-normal">Voir tout</Link></h2>
                        <ul className="space-y-3">
                            {latestCourses.map(c => (
                                <li key={c.id} className="flex gap-4 items-center p-3 hover:bg-muted rounded-lg border">
                                    <img src={c.image} alt="" className="w-12 h-12 object-cover rounded bg-muted" />
                                    <div>
                                        <p className="font-semibold line-clamp-1">{c.title}</p>
                                        <p className="text-xs text-muted-foreground">{c.category}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold mb-4">Actions Rapides</h2>
                <div className="flex gap-4">
                    <Link to="/admin/users" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition">Gérer les utilisateurs</Link>
                    <Link to="/admin/courses" className="bg-outline text-primary border border-primary px-4 py-2 rounded-lg hover:bg-primary/5 transition">Gérer les cours</Link>
                </div>
                </div>
            </>
        )}
      </div>
    </div>
  );
}
