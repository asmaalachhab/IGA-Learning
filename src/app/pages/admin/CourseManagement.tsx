import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Trash2, Edit, Plus, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';

export function CourseManagement() {
  const [courses, setCourses] = useState<any[]>([]);
  const { user } = useAuth();
  
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', description: '', category_name: 'Informatique', level: 'Debutant', image: '', teacher_id: '' });
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);
  const [teachers, setTeachers] = useState<any[]>([]);

  useEffect(() => {
    loadCourses();
    loadTeachers();
  }, []);

  const loadCourses = () => {
    api.getCourses().then(data => {
      if (user?.role === 'TEACHER') {
          setCourses(data);
      } else {
          setCourses(data);
      }
    });
  };

  const loadTeachers = async () => {
    try {
      const users = await api.getUsers();
      setTeachers(users.filter((u: any) => u.role === 'TEACHER'));
    } catch(e) {}
  };

  const showMessage = (type: 'success'|'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id: number) => {
    if(confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')){
      try {
        await api.deleteCourse(id);
        showMessage('success', 'Cours supprimé avec succès.');
        loadCourses();
      } catch (err: any) {
        showMessage('error', err.message || 'Erreur lors de la suppression.');
      }
    }
  };

  const openForm = (course: any = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({ 
        title: course.title, 
        description: course.description, 
        category_name: course.category, 
        level: course.level, 
        image: course.image,
        teacher_id: course.teacher_id || ''
      });
    } else {
      setEditingCourse(null);
      setFormData({ title: '', description: '', category_name: 'Informatique', level: 'Debutant', image: '', teacher_id: user?.role === 'TEACHER' ? String(user.id) : '' });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Pour la création, s'il n'y a pas de professeur, on peut prendre l'utilisateur connecté si c'est un prof
      let tId = formData.teacher_id;
      if (!tId && user?.role === 'TEACHER') {
        tId = String(user.id);
      }
      const payload = { ...formData, teacher_id: tId };
      
      if (editingCourse) {
        await api.updateCourse(Number(editingCourse.id), payload);
        showMessage('success', 'Cours modifié avec succès.');
      } else {
        await api.createCourse(payload);
        showMessage('success', 'Cours ajouté avec succès.');
      }
      setShowForm(false);
      loadCourses();
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
          <h1 className="text-3xl font-bold">Gestion des Cours</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => openForm()} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 shadow-sm transition">
              <Plus className="size-4" /> Nouveau Cours
            </button>
            <Link to={user?.role === 'ADMIN' ? '/admin' : '/teacher'} className="text-primary hover:underline font-medium">Retour</Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-muted border-b">
              <tr>
                <th className="p-4 font-semibold text-sm">ID</th>
                <th className="p-4 font-semibold text-sm">Image</th>
                <th className="p-4 font-semibold text-sm">Titre</th>
                <th className="p-4 font-semibold text-sm">Catégorie</th>
                <th className="p-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4 text-sm">{c.id}</td>
                  <td className="p-4 text-sm">
                    <img src={c.image || 'https://via.placeholder.com/150'} alt={c.title} className="w-16 h-10 object-cover rounded shadow-sm border" />
                  </td>
                  <td className="p-4 text-sm font-medium">{c.title}</td>
                  <td className="p-4 text-sm text-muted-foreground">{c.category}</td>
                  <td className="p-4 text-sm flex gap-2">
                    <button onClick={() => openForm(c)} className="text-blue-600 hover:bg-blue-100 p-2 rounded transition" title="Modifier"><Edit className="size-4" /></button>
                    <button onClick={() => handleDelete(Number(c.id))} className="text-red-600 hover:bg-red-100 p-2 rounded transition" title="Supprimer"><Trash2 className="size-4" /></button>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Aucun cours trouvé.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingCourse ? 'Modifier' : 'Ajouter'} un cours</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:bg-muted p-2 rounded-full transition">
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Titre</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" rows={3}></textarea>
              </div>

              {user?.role === 'ADMIN' && (
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Professeur</label>
                  <select required value={formData.teacher_id} onChange={e => setFormData({...formData, teacher_id: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white transition">
                    <option value="">Sélectionner un professeur</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name} (ID: {t.id})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Catégorie</label>
                  <select value={formData.category_name} onChange={e => setFormData({...formData, category_name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white transition">
                    <option value="Informatique">Informatique</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Langues">Langues</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Niveau</label>
                  <select value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white transition">
                    <option value="Debutant">Débutant</option>
                    <option value="Intermediaire">Intermédiaire</option>
                    <option value="Avance">Avancé</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">URL de l'image (optionnel)</label>
                <input type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" placeholder="https://..." />
              </div>
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
