import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Trash2, Edit, Plus, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';

export function QuizManagement() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const { user } = useAuth();
  
  const [showForm, setShowForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    passingScore: 70,
    question: '',
    optionA: '', optionB: '', optionC: '', optionD: '',
    correctOption: 'A'
  });
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [qData, cData] = await Promise.all([
      api.getAllQuizzes(),
      api.getCourses()
    ]);
    setQuizzes(qData);
    setCourses(cData);
  };

  const showMessage = (type: 'success'|'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id: number) => {
    if(confirm('Êtes-vous sûr de vouloir supprimer ce quiz ?')){
      try {
        await api.deleteQuiz(id);
        showMessage('success', 'Quiz supprimé avec succès.');
        loadData();
      } catch (err: any) {
        showMessage('error', err.message || 'Erreur lors de la suppression.');
      }
    }
  };

  const openForm = (quiz: any = null) => {
    if (quiz) {
      setEditingQuiz(quiz);
      setFormData({ 
        title: quiz.title, 
        courseId: quiz.course_id, 
        passingScore: quiz.passing_score,
        question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A'
      });
    } else {
      setEditingQuiz(null);
      setFormData({ 
        title: '', courseId: courses.length > 0 ? courses[0].id : '', passingScore: 70,
        question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A'
      });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingQuiz) {
        await api.updateQuiz(Number(editingQuiz.id), {
          title: formData.title,
          passingScore: formData.passingScore
        });
        showMessage('success', 'Quiz modifié avec succès.');
      } else {
        const payload = {
          title: formData.title,
          courseId: formData.courseId,
          passingScore: formData.passingScore,
          questions: [
            {
              question: formData.question,
              answers: [
                { answerText: formData.optionA, isCorrect: formData.correctOption === 'A' },
                { answerText: formData.optionB, isCorrect: formData.correctOption === 'B' },
                { answerText: formData.optionC, isCorrect: formData.correctOption === 'C' },
                { answerText: formData.optionD, isCorrect: formData.correctOption === 'D' }
              ]
            }
          ]
        };
        await api.createQuiz(payload);
        showMessage('success', 'Quiz ajouté avec succès.');
      }
      setShowForm(false);
      loadData();
    } catch (err: any) {
      showMessage('error', err.message || 'Erreur lors de l\'enregistrement.');
    }
  };

  return (
    <div className="flex min-h-screen bg-muted relative">
      {message && (
        <div className={`fixed top-4 right-4 z-[60] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white transition-all ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {message.type === 'success' ? <CheckCircle className="size-5" /> : <AlertCircle className="size-5" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestion des Quiz</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => openForm()} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 shadow-sm transition">
              <Plus className="size-4" /> Nouveau Quiz
            </button>
            <Link to={user?.role === 'ADMIN' ? '/admin' : '/teacher'} className="text-primary hover:underline font-medium">Retour</Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-muted border-b">
              <tr>
                <th className="p-4 font-semibold text-sm">ID</th>
                <th className="p-4 font-semibold text-sm">Titre</th>
                <th className="p-4 font-semibold text-sm">Cours ID</th>
                <th className="p-4 font-semibold text-sm">Score Requis</th>
                <th className="p-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map(q => (
                <tr key={q.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4 text-sm">{q.id}</td>
                  <td className="p-4 text-sm font-medium">{q.title}</td>
                  <td className="p-4 text-sm text-muted-foreground">{q.course_id}</td>
                  <td className="p-4 text-sm font-semibold">{q.passing_score}%</td>
                  <td className="p-4 text-sm flex gap-2">
                    <button onClick={() => openForm(q)} className="text-blue-600 hover:bg-blue-100 p-2 rounded transition" title="Modifier"><Edit className="size-4" /></button>
                    <button onClick={() => handleDelete(Number(q.id))} className="text-red-600 hover:bg-red-100 p-2 rounded transition" title="Supprimer"><Trash2 className="size-4" /></button>
                  </td>
                </tr>
              ))}
              {quizzes.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Aucun quiz trouvé.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingQuiz ? 'Modifier' : 'Ajouter'} un quiz</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:bg-muted p-2 rounded-full transition">
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Titre du Quiz</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
              </div>
              {!editingQuiz && (
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Cours associé</label>
                  <select required value={formData.courseId} onChange={e => setFormData({...formData, courseId: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white transition">
                    {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Score pour réussir (%)</label>
                <input required type="number" min="0" max="100" value={formData.passingScore} onChange={e => setFormData({...formData, passingScore: Number(e.target.value)})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
              </div>

              {!editingQuiz && (
                <>
                  <hr className="my-6 border-gray-200" />
                  <h3 className="font-semibold text-lg text-primary">Question 1</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Intitulé de la question</label>
                    <input required type="text" value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Choix A</label>
                      <input required type="text" value={formData.optionA} onChange={e => setFormData({...formData, optionA: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Choix B</label>
                      <input required type="text" value={formData.optionB} onChange={e => setFormData({...formData, optionB: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Choix C</label>
                      <input required type="text" value={formData.optionC} onChange={e => setFormData({...formData, optionC: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Choix D</label>
                      <input required type="text" value={formData.optionD} onChange={e => setFormData({...formData, optionD: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Bonne réponse</label>
                    <select value={formData.correctOption} onChange={e => setFormData({...formData, correctOption: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white transition">
                      <option value="A">Choix A</option>
                      <option value="B">Choix B</option>
                      <option value="C">Choix C</option>
                      <option value="D">Choix D</option>
                    </select>
                  </div>
                </>
              )}
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition">Annuler</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 shadow-sm transition">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
