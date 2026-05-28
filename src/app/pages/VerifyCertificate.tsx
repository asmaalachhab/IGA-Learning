import { useState } from 'react';
import { Search, CheckCircle, XCircle } from 'lucide-react';

export function VerifyCertificate() {
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState<boolean | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length > 0) {
      setVerified(code.toUpperCase().startsWith('IGA'));
    }
  };

  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="text-center mb-8">
              <Search className="size-16 text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">
                Vérifier un certificat
              </h1>
              <p className="text-muted-foreground">
                Entrez le code de vérification pour valider l'authenticité d'un
                certificat IGA Learning
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">
                  Code de vérification
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Exemple: IGA-2026-ABCD-1234"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium"
              >
                Vérifier le certificat
              </button>
            </form>

            {verified !== null && (
              <div
                className={`mt-8 p-6 rounded-lg ${
                  verified
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                {verified ? (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="size-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-green-900 mb-2">
                        Certificat valide
                      </h3>
                      <p className="text-green-800 mb-4">
                        Ce certificat a été délivré par IGA Learning et est
                        authentique.
                      </p>
                      <div className="space-y-1 text-sm text-green-800">
                        <p>
                          <strong>Étudiant:</strong> Ahmed Benali
                        </p>
                        <p>
                          <strong>Cours:</strong> Java pour débutants -
                          Programmation orientée objet
                        </p>
                        <p>
                          <strong>Date d'obtention:</strong> 15 avril 2026
                        </p>
                        <p>
                          <strong>Note:</strong> 92%
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <XCircle className="size-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-red-900 mb-2">
                        Certificat non valide
                      </h3>
                      <p className="text-red-800">
                        Ce code de vérification n'existe pas dans notre base de
                        données. Veuillez vérifier le code et réessayer.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Le code de vérification se trouve en
                bas de chaque certificat, à côté du QR code. Il est unique et
                permet de confirmer que le certificat n'a pas été falsifié.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
