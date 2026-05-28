import { Link } from 'react-router';
import {
  BookOpen,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  InstagramIcon,
} from 'lucide-react';
import { categories } from '../../data/mockData';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-12 items-center justify-center rounded bg-white p-1.5">
                <img
                  src="/iga-logo.webp"
                  alt="IGA Learning"
                  className="h-full w-auto object-contain"
                />
              </div>
            </Link>

            <p className="text-slate-300 mb-4">
              Votre plateforme d'apprentissage en ligne. Des milliers de cours
              gratuits avec certificats pour développer vos compétences.
            </p>

            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="size-10 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-primary transition"
              >
                <FacebookIcon className="size-5" />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="size-10 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-primary transition"
              >
                <TwitterIcon className="size-5" />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="size-10 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-primary transition"
              >
                <LinkedinIcon className="size-5" />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="size-10 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-primary transition"
              >
                <InstagramIcon className="size-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Catégories populaires</h3>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/cours?category=${category.slug}`}
                    className="text-slate-300 hover:text-primary transition"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Liens utiles</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/a-propos" className="text-slate-300 hover:text-primary transition">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-slate-300 hover:text-primary transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/certificat" className="text-slate-300 hover:text-primary transition">
                  Certificat
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-primary transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/connexion" className="text-slate-300 hover:text-primary transition">
                  Connexion
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li className="text-slate-300">Email: contact@igalearning.com</li>
              <li className="text-slate-300">Tél: +212 5 22 00 00 00</li>
              <li className="text-slate-300">Adresse: Casablanca, Maroc</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
          <p>
            &copy; 2025-2026 IGA Learning. Tous droits réservés. Plateforme
            d'apprentissage académique.
          </p>
        </div>
      </div>
    </footer>
  );
}