import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { User, Mail, Lock, Camera, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function Profile() {
  const { user, updateStoredUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    profileImage: '',
    phone: '',
    bio: ''
  });

  const [role, setRole] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/connexion');
      return;
    }
    loadProfile();
  }, [user, navigate]);

  const getToken = () => {
    return localStorage.getItem('iga_token') || `demo-token-${user?.id}`;
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await api.getMe();
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        password: '',
        profileImage: data.profileImage || '',
        phone: data.phone || '',
        bio: data.bio || ''
      });
      setRole(data.role || user?.role || '');
    } catch (err: any) {
      showMessage('error', err.message || "Erreur lors du chargement du profil");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success'|'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      showMessage('error', 'L\'adresse email est obligatoire.');
      return;
    }

    setSaving(true);
    try {
      const response = await api.updateMe(formData);
      showMessage('success', 'Profil mis à jour avec succès.');
      setFormData(prev => ({ ...prev, password: '' })); // clear password field
      
      // Update context if needed, but Context only stores basic info
      if (response.user) {
        updateStoredUser({
          name: response.user.name,
          email: response.user.email,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          profileImage: response.user.profileImage,
        });
      }
    } catch (err: any) {
      showMessage('error', err.message || "Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-muted"><div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="min-h-screen bg-muted py-12 px-4 relative">
      {message && (
        <div className={`fixed top-4 right-4 z-[60] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white transition-all ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {message.type === 'success' ? <CheckCircle className="size-5" /> : <AlertCircle className="size-5" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>
        
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="bg-primary/10 px-8 py-10 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="size-24 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="size-12 text-primary" />
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg border-2 border-white">
                <Camera className="size-4" />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">{formData.firstName} {formData.lastName}</h2>
              <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-1 mt-1">
                <Mail className="size-4" /> {formData.email}
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 bg-white px-3 py-1 rounded-full text-sm font-medium text-primary shadow-sm border">
                <Shield className="size-4" /> 
                {role === 'ADMIN' ? 'Administrateur' : role === 'TEACHER' ? 'Professeur' : 'Étudiant'}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Prénom</label>
                <input 
                  type="text" 
                  value={formData.firstName} 
                  onChange={e => setFormData({...formData, firstName: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Nom</label>
                <input 
                  type="text" 
                  value={formData.lastName} 
                  onChange={e => setFormData({...formData, lastName: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">Adresse Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700 flex justify-between">
                  <span>Nouveau Mot de passe</span>
                  <span className="text-muted-foreground font-normal text-xs">(Optionnel - laissez vide pour ne pas changer)</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <input 
                    type="password" 
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" 
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">Téléphone</label>
                <input 
                  type="tel" 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" 
                  placeholder="+212 ..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">Bio</label>
                <textarea 
                  value={formData.bio} 
                  onChange={e => setFormData({...formData, bio: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition min-h-24" 
                  placeholder="Présentez-vous en quelques lignes"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">URL de l'image de profil</label>
                <input 
                  type="url" 
                  value={formData.profileImage} 
                  onChange={e => setFormData({...formData, profileImage: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" 
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="pt-6 border-t flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => navigate(-1)} 
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
              >
                Retour
              </button>
              <button 
                type="submit" 
                disabled={saving}
                className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 shadow-sm transition disabled:opacity-70 flex items-center gap-2"
              >
                {saving && <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
