import React from 'react';
import { useLocation, Link } from 'react-router';
import { Award, CheckCircle, XCircle } from 'lucide-react';

export function QuizResult() {
  const location = useLocation();
  const result = location.state || { score: 0, passed: false };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg border p-8 max-w-md w-full text-center">
        {result.passed ? (
            <Award className="size-20 text-yellow-500 mx-auto mb-6" />
        ) : (
            <XCircle className="size-20 text-red-500 mx-auto mb-6" />
        )}
        
        <h1 className="text-3xl font-bold mb-2">
          {result.passed ? 'Félicitations !' : 'Oups...'}
        </h1>
        <p className="text-muted-foreground mb-8">
          Vous avez {result.passed ? 'réussi' : 'échoué à'} ce quiz avec un score de :
        </p>
        
        <div className="text-6xl font-black text-primary mb-8">
          {result.score}%
        </div>
        
        <div className="flex flex-col gap-3">
          {result.passed && (
            <Link to="/certificat" className="bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 flex justify-center items-center gap-2">
               Obtenir mon certificat
            </Link>
          )}
          <Link to="/cours" className="bg-muted text-foreground py-3 rounded-lg font-semibold hover:bg-muted/80">
            Retour aux cours
          </Link>
        </div>
      </div>
    </div>
  );
}
