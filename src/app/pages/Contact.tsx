import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { api } from '../services/api';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSubmitted(false);
    try {
      await api.sendContactMessage(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'envoi.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Contactez-nous</h1>
          <p className="text-xl text-blue-100">
            Une question ? Une suggestion ? Nous sommes là pour vous aider.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                  Merci pour votre message ! Nous vous répondrons dans les plus
                  brefs délais.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block mb-2 font-medium">Nom complet</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Sujet</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="size-5" />
                  )}
                  {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-8 shadow-lg mb-6">
              <h3 className="font-bold mb-6">Informations de contact</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="size-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a
                      href="mailto:contact@igalearning.com"
                      className="text-muted-foreground hover:text-primary"
                    >
                      contact@igalearning.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="size-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <a
                      href="tel:+212522000000"
                      className="text-muted-foreground hover:text-primary"
                    >
                      +212 5 22 00 00 00
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="size-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-muted-foreground">
                      Boulevard Zerktouni
                      <br />
                      Casablanca, Maroc
                      <br />
                      20000
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary text-white rounded-lg p-8">
              <h3 className="font-bold mb-4">Horaires d'ouverture</h3>
              <div className="space-y-2 text-blue-100">
                <p>Lundi - Vendredi: 9h - 18h</p>
                <p>Samedi: 10h - 14h</p>
                <p>Dimanche: Fermé</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
