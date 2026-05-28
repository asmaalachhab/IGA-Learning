import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Trash2, Edit, Plus, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';

export function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'STUDENT', password: '' });
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    api.getUsers().then(setUsers);
  };

  const showMessage = (type: 'success'|'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id: number) => {
    if(confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')){
      try {
        await api.deleteUser(id);
        showMessage('success', 'Utilisateur supprimé avec succès.');
        loadUsers();
      } catch (err: any) {
        showMessage('error', err.message || 'Erreur lors de la suppression.');
      }
    }
  };

  const openForm = (user: any = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, role: user.role, password: '' });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', role: 'STUDENT', password: '' });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.updateUser(editingUser.id, formData);
        showMessage('success', 'Utilisateur modifié avec succès.');
      } else {
        await api.createUser(formData);
        showMessage('success', 'Utilisateur ajouté avec succès.');
      }
      setShowForm(false);
      loadUsers();
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
          <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => openForm()} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 shadow-sm transition">
              <Plus className="size-4" /> Ajouter un utilisateur
            </button>
            <Link to="/admin" className="text-primary hover:underline font-medium">Retour</Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-muted border-b">
              <tr>
                <th className="p-4 font-semibold text-sm">ID</th>
                <th className="p-4 font-semibold text-sm">Nom</th>
                <th className="p-4 font-semibold text-sm">Email</th>
                <th className="p-4 font-semibold text-sm">Rôle</th>
                <th className="p-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4 text-sm">{u.id}</td>
                  <td className="p-4 text-sm font-medium">{u.name}</td>
                  <td className="p-4 text-sm text-muted-foreground">{u.email}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${u.role === 'ADMIN' ? 'bg-red-100 text-red-800' : u.role === 'TEACHER' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm flex gap-2">
                    <button onClick={() => openForm(u)} className="text-blue-600 hover:bg-blue-100 p-2 rounded transition" title="Modifier"><Edit className="size-4" /></button>
                    <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:bg-red-100 p-2 rounded transition" title="Supprimer"><Trash2 className="size-4" /></button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Aucun utilisateur trouvé.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingUser ? 'Modifier' : 'Ajouter'} un utilisateur</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:bg-muted p-2 rounded-full transition">
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Nom complet</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" placeholder="Ex: Jean Dupont" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Adresse Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" placeholder="jean.dupont@email.com" />
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Mot de passe</label>
                  <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" placeholder="••••••••" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Rôle</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white transition">
                  <option value="STUDENT">Étudiant</option>
                  <option value="TEACHER">Professeur</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
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
