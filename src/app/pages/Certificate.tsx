import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router';
import { Award, QrCode, FileCheck, TrendingUp, Search, Printer, Download, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export function Certificate() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const certRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    if (user?.id) {
      api.getCertificatesByStudent(Number(user.id))
        .then(setCertificates)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const handlePrint = (id: number) => {
    const printContent = certRefs.current[id];
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Reload to restore React bindings
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Info */}
      <div className="bg-gradient-to-br from-slate-900 via-primary to-slate-900 text-white py-16 relative overflow-hidden print:hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000')] bg-cover opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-full mb-6 backdrop-blur-md">
            <Award className="size-12 text-yellow-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Vos Certificats IGA Learning
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto font-light">
            Valorisez vos compétences avec nos certifications officielles, vérifiables et reconnues par l'industrie.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin size-12 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : certificates.length > 0 ? (
          <div className="space-y-16">
            {certificates.map((cert) => (
              <div key={cert.id} className="max-w-5xl mx-auto">
                <div className="flex justify-end gap-4 mb-4 print:hidden">
                  <button onClick={() => handlePrint(cert.id)} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition shadow-sm hover:shadow">
                    <Printer className="size-5" /> Imprimer
                  </button>
                </div>
                
                {/* Certificate Design */}
                <div 
                  ref={(el) => { certRefs.current[cert.id] = el; }}
                  className="bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 relative print:shadow-none print:border-none"
                  style={{ minHeight: '650px' }}
                >
                  <div className="absolute inset-0 border-[16px] border-double border-slate-100 pointer-events-none"></div>
                  <div className="absolute inset-0 border-8 border-primary/5 pointer-events-none m-4"></div>
                  
                  {/* Logo Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                    <Award className="size-96 text-primary" />
                  </div>

                  <div className="relative z-10 p-16 flex flex-col items-center text-center h-full">
                    <div className="flex items-center justify-between w-full mb-12">
                      <div className="flex items-center gap-3">
                        <img src="/iga-logo.webp" alt="IGA" className="h-14 w-auto object-contain" />
                        <span className="text-2xl font-bold tracking-tight text-slate-800">Learning</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest block mb-1">N° Certificat</span>
                        <span className="font-mono text-lg text-slate-700">{cert.verification_code || `IGA-${cert.id}-2024`}</span>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h2 className="text-5xl font-black text-slate-800 tracking-tight mb-2 uppercase" style={{ letterSpacing: '0.1em' }}>Certificat</h2>
                      <p className="text-2xl text-primary font-light tracking-widest uppercase">d'Accomplissement</p>
                    </div>

                    <p className="text-lg text-slate-500 mb-4 italic">Ce document atteste que</p>
                    <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 border-b-2 border-primary pb-4 px-12 inline-block">
                      {cert.student_name || user?.name || "Étudiant IGA"}
                    </h3>

                    <p className="text-lg text-slate-500 mb-4">a complété avec succès le programme de formation intitulé</p>
                    <h4 className="text-3xl font-bold text-primary mb-12 max-w-2xl leading-tight">
                      {cert.course_name}
                    </h4>

                    <div className="flex w-full justify-between items-end mt-auto pt-8">
                      <div className="text-left">
                        <div className="border-b border-slate-300 w-48 mb-2"></div>
                        <p className="font-bold text-slate-800">Directeur Pédagogique</p>
                        <p className="text-sm text-slate-500">IGA Learning Institute</p>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="size-24 border border-slate-200 bg-white p-2 rounded-lg shadow-sm mb-3 relative">
                          <QrCode className="w-full h-full text-slate-800" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-10">
                            <ShieldCheck className="size-16 text-primary" />
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 font-mono">Scanner pour vérifier</p>
                      </div>

                      <div className="text-right">
                         <div className="border-b border-slate-300 w-48 mb-2">
                           <p className="text-lg font-medium text-slate-700 text-center mb-1">{new Date(cert.issue_date || Date.now()).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                         </div>
                        <p className="font-bold text-slate-800">Date de délivrance</p>
                        <p className="text-sm text-slate-500">Score de réussite: {cert.score}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border p-12 text-center print:hidden">
            <Award className="size-16 text-muted-foreground/30 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Aucun certificat pour le moment</h2>
            <p className="text-slate-500 mb-8">
              Vous n'avez pas encore obtenu de certificat. Inscrivez-vous à des cours, complétez les leçons et réussissez les quiz finaux pour obtenir vos certifications.
            </p>
            <Link to="/cours" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition shadow-sm">
              <Search className="size-5" /> Explorer les cours
            </Link>
          </div>
        )}

        {/* Info Section for public verification */}
        <div className="mt-20 max-w-4xl mx-auto text-center border-t pt-12 print:hidden">
          <ShieldCheck className="size-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Vérification de Certificat</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Tous nos certificats disposent d'un code unique permettant aux employeurs de vérifier leur authenticité directement sur notre plateforme.
          </p>
          <Link
            to="/certificat/verifier"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-primary text-primary rounded-lg hover:bg-primary/5 transition font-medium"
          >
            <Search className="size-5" />
            Portail de vérification
          </Link>
        </div>
      </div>
    </div>
  );
}
