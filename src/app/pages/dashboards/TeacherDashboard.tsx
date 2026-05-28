import React, { useEffect, useState } from 'react';
import { BookOpen, FileText, Users, Award, Settings, Edit, Trash2, Plus, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Link } from 'react-router';

export function TeacherDashboard() {
  const { user } = useAuth();
  const [selectedPage, setSelectedPage] = useState('dashboard');
  const [courses, setCourses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  
  const [showGradeForm, setShowGradeForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState<any>(null);
  const [gradeData, setGradeData] = useState({ studentId: '', courseId: '', grade: 0, comments: '' });
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const c = await api.getCourses();
      setCourses(c); 
      
      if(user?.id) {
        const s = await api.getTeacherStudents(Number(user.id));
        setStudents(s);
        
        const g = await api.getTeacherGrades(Number(user.id));
        setGrades(g);
      }
    } catch(e) {
      console.error(e);
    }
  };

  const showMessage = (type: 'success'|'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteGrade = async (id: number) => {
    if(confirm('Voulez-vous vraiment supprimer cette note ?')) {
      try {
        await api.deleteGrade(id);
        showMessage('success', 'Note supprimée avec succès.');
        loadDashboardData();
      } catch (err: any) {
        showMessage('error', err.message || 'Erreur lors de la suppression.');
      }
    }
  };

  const openGradeForm = (grade: any = null) => {
    if(grade) {
      setEditingGrade(grade);
      setGradeData({
        studentId: grade.student_id,
        courseId: grade.course_id,
        grade: grade.grade,
        comments: grade.comments || ''
      });
    } else {
      setEditingGrade(null);
      setGradeData({ studentId: students[0]?.id || '', courseId: courses[0]?.id || '', grade: 0, comments: '' });
    }
    setShowGradeForm(true);
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...gradeData, teacherId: user?.id };
      if(editingGrade) {
        await api.updateGrade(editingGrade.id, payload);
        showMessage('success', 'Note modifiée avec succès.');
      } else {
        await api.createGrade(payload);
        showMessage('success', 'Note ajoutée avec succès.');
      }
      setShowGradeForm(false);
      loadDashboardData();
    } catch(err: any) {
      showMessage('error', err.message || 'Erreur lors de l\'enregistrement.');
    }
  };

  const renderContent = () => {
    if (selectedPage === 'students') {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-6">Mes Étudiants Inscrits</h2>
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-muted border-b">
                <tr>
                  <th className="p-4 font-semibold text-sm">ID</th>
                  <th className="p-4 font-semibold text-sm">Nom</th>
                  <th className="p-4 font-semibold text-sm">Email</th>
                  <th className="p-4 font-semibold text-sm">Cours Inscrit</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="p-4 text-sm">{s.id}</td>
                    <td className="p-4 text-sm font-medium">{s.name}</td>
                    <td className="p-4 text-sm text-muted-foreground">{s.email}</td>
                    <td className="p-4 text-sm font-medium">{s.course_title}</td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr><td colSpan={4} className="p-4 text-center text-muted-foreground">Aucun étudiant inscrit</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (selectedPage === 'grades') {
      return (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Notes des Étudiants</h2>
            <button onClick={() => openGradeForm()} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 shadow-sm transition">
              <Plus className="size-4" /> Ajouter une note
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-muted border-b">
                <tr>
                  <th className="p-4 font-semibold text-sm">Étudiant</th>
                  <th className="p-4 font-semibold text-sm">Cours</th>
                  <th className="p-4 font-semibold text-sm">Note / 20</th>
                  <th className="p-4 font-semibold text-sm">Commentaire</th>
                  <th className="p-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {grades.map(g => (
                  <tr key={g.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="p-4 text-sm font-medium">{g.student_name}</td>
                    <td className="p-4 text-sm text-muted-foreground">{g.course_title}</td>
                    <td className="p-4 text-sm font-bold text-primary">{g.grade}</td>
                    <td className="p-4 text-sm">{g.comments}</td>
                    <td className="p-4 text-sm flex gap-2">
                      <button onClick={() => openGradeForm(g)} className="text-blue-600 hover:bg-blue-100 p-2 rounded transition" title="Modifier"><Edit className="size-4" /></button>
                      <button onClick={() => handleDeleteGrade(g.id)} className="text-red-600 hover:bg-red-100 p-2 rounded transition" title="Supprimer"><Trash2 className="size-4" /></button>
                    </td>
                  </tr>
                ))}
                {grades.length === 0 && (
                  <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">Aucune note attribuée</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Default Dashboard
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Bonjour, Prof. {user?.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-muted-foreground">Mes Cours</h3>
              <div className="bg-blue-50 p-3 rounded-full"><BookOpen className="text-primary size-6" /></div>
            </div>
            <p className="text-3xl font-bold">{courses.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-muted-foreground">Étudiants Inscrits</h3>
              <div className="bg-green-50 p-3 rounded-full"><Users className="text-green-600 size-6" /></div>
            </div>
            <p className="text-3xl font-bold">{students.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-muted-foreground">Notes Attribuées</h3>
              <div className="bg-purple-50 p-3 rounded-full"><Award className="text-purple-600 size-6" /></div>
            </div>
            <p className="text-3xl font-bold">{grades.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-4">Actions Rapides</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/admin/courses" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 shadow-sm transition">Gérer mes cours</Link>
            <Link to="/admin/quizzes" className="bg-white text-primary border border-primary px-4 py-2 rounded-lg hover:bg-primary/5 transition">Gérer mes quiz</Link>
            <button onClick={() => setSelectedPage('students')} className="bg-white text-primary border border-primary px-4 py-2 rounded-lg hover:bg-primary/5 transition">Voir les étudiants</button>
            <button onClick={() => setSelectedPage('grades')} className="bg-white text-primary border border-primary px-4 py-2 rounded-lg hover:bg-primary/5 transition">Gérer les notes</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-muted relative">
      {message && (
        <div className={`fixed top-4 right-4 z-[60] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white transition-all ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {message.type === 'success' ? <CheckCircle className="size-5" /> : <AlertCircle className="size-5" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 bg-white border-r h-screen sticky top-0 shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-primary">Espace Professeur</h2>
        </div>
        <nav className="space-y-1 p-4">
          <button onClick={() => setSelectedPage('dashboard')} className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${selectedPage === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
            <Settings className="size-5" /> Dashboard
          </button>
          <Link to="/admin/courses" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-lg font-medium transition">
            <BookOpen className="size-5" /> Mes Cours
          </Link>
          <button onClick={() => setSelectedPage('students')} className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${selectedPage === 'students' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
            <Users className="size-5" /> Étudiants
          </button>
          <button onClick={() => setSelectedPage('grades')} className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${selectedPage === 'grades' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
            <Award className="size-5" /> Notes
          </button>
          <Link to="/admin/quizzes" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-lg font-medium transition">
            <FileText className="size-5" /> Mes Quiz
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderContent()}
      </div>

      {showGradeForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingGrade ? 'Modifier' : 'Ajouter'} une note</h2>
              <button onClick={() => setShowGradeForm(false)} className="text-muted-foreground hover:bg-muted p-2 rounded-full transition">
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={handleGradeSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Étudiant</label>
                <select required value={gradeData.studentId} onChange={e => setGradeData({...gradeData, studentId: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition">
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Cours</label>
                <select required value={gradeData.courseId} onChange={e => setGradeData({...gradeData, courseId: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition">
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Note (sur 20)</label>
                <input required type="number" step="0.5" min="0" max="20" value={gradeData.grade} onChange={e => setGradeData({...gradeData, grade: Number(e.target.value)})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Commentaire (Optionnel)</label>
                <textarea value={gradeData.comments} onChange={e => setGradeData({...gradeData, comments: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" rows={3}></textarea>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowGradeForm(false)} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition">Annuler</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 shadow-sm transition">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
