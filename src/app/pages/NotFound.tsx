import { Link } from 'react-router';
import { Home, Search } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">Page non trouvée</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            <Home className="size-5" />
            Retour à l'accueil
          </Link>
          <Link
            to="/cours"
            className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition"
          >
            <Search className="size-5" />
            Explorer les cours
          </Link>
        </div>
      </div>
    </div>
  );
}
