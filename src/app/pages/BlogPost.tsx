import { useParams, Link } from 'react-router';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { blogPosts } from '../data/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function BlogPost() {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Article non trouvé</h1>
        <Link to="/blog" className="text-primary hover:underline mt-4 block">
          Retour au blog
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(post.date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-muted">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <ArrowLeft className="size-4" />
          Retour au blog
        </Link>

        <article className="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
          <ImageWithFallback
            src={post.image}
            alt={post.title}
            className="w-full h-96 object-cover"
          />

          <div className="p-8">
            <span className="inline-block px-3 py-1 bg-accent text-primary rounded-full text-sm mb-4">
              {post.category}
            </span>

            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

            <div className="flex items-center gap-6 text-muted-foreground mb-8 pb-8 border-b">
              <div className="flex items-center gap-2">
                <User className="size-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                <span>{formattedDate}</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-xl text-muted-foreground mb-6">
                {post.excerpt}
              </p>

              <div className="space-y-4 text-lg leading-relaxed">
                <p>
                  L'apprentissage en ligne a révolutionné la façon dont nous
                  acquérons de nouvelles compétences. Que vous soyez débutant
                  ou expert, il existe toujours des opportunités pour
                  approfondir vos connaissances et rester à jour dans votre
                  domaine.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  Les avantages de l'apprentissage en ligne
                </h2>

                <p>
                  La flexibilité est l'un des principaux avantages de
                  l'apprentissage en ligne. Vous pouvez étudier à votre propre
                  rythme, selon votre emploi du temps, et depuis n'importe où
                  dans le monde. Cette approche permet d'équilibrer
                  efficacement vie professionnelle et développement personnel.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  Comment maximiser votre apprentissage
                </h2>

                <ul className="space-y-2 ml-6">
                  <li>
                    Fixez-vous des objectifs clairs et mesurables pour chaque
                    cours
                  </li>
                  <li>
                    Créez un planning d'étude régulier et tenez-vous-y
                  </li>
                  <li>
                    Pratiquez régulièrement ce que vous apprenez avec des
                    exercices
                  </li>
                  <li>
                    Rejoignez une communauté d'apprenants pour échanger et vous
                    motiver
                  </li>
                  <li>
                    N'hésitez pas à revoir les concepts difficiles plusieurs
                    fois
                  </li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">Conclusion</h2>

                <p>
                  L'investissement dans votre éducation est l'un des meilleurs
                  investissements que vous puissiez faire. Avec les ressources
                  disponibles aujourd'hui, il n'a jamais été aussi facile
                  d'apprendre de nouvelles compétences et de progresser dans
                  votre carrière. Commencez dès aujourd'hui et voyez la
                  différence que cela peut faire dans votre vie professionnelle
                  et personnelle.
                </p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t">
              <h3 className="font-bold mb-4">À propos de l'auteur</h3>
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="size-8 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{post.author}</p>
                  <p className="text-muted-foreground text-sm">
                    Expert en {post.category} et formateur chez IGA Learning
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
