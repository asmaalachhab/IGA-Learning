import { Target, Users, Award, TrendingUp, BookOpen, Globe } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-primary via-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">À propos d'IGA Learning</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Notre mission est de rendre l'éducation accessible à tous,
            gratuitement, partout dans le monde.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-8 shadow-lg mb-12">
            <h2 className="text-3xl font-bold mb-6">Notre mission</h2>
            <p className="text-lg text-muted-foreground mb-4">
              IGA Learning est une plateforme d'apprentissage en ligne créée
              pour démocratiser l'accès à l'éducation de qualité. Nous croyons
              que chacun mérite la possibilité d'apprendre et de développer ses
              compétences, quel que soit son contexte socio-économique.
            </p>
            <p className="text-lg text-muted-foreground">
              Notre plateforme offre des milliers de cours gratuits dans des
              domaines variés, avec des certificats reconnus pour valoriser vos
              acquis. Nous nous engageons à maintenir tous nos contenus
              totalement gratuits et accessibles à tous.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-lg p-6 shadow">
              <Target className="size-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Notre objectif</h3>
              <p className="text-muted-foreground">
                Permettre à 1 million d'étudiants d'acquérir de nouvelles
                compétences et d'améliorer leur employabilité d'ici 2027.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <Globe className="size-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Notre portée</h3>
              <p className="text-muted-foreground">
                Présents dans plus de 50 pays, avec du contenu en plusieurs
                langues pour toucher le plus grand nombre.
              </p>
            </div>
          </div>

          <div className="bg-primary text-white rounded-lg p-8 mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Chiffres clés
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Users className="size-8 mx-auto mb-2" />
                <p className="text-4xl font-bold mb-1">150K+</p>
                <p className="text-blue-100">Étudiants actifs</p>
              </div>
              <div className="text-center">
                <BookOpen className="size-8 mx-auto mb-2" />
                <p className="text-4xl font-bold mb-1">500+</p>
                <p className="text-blue-100">Cours disponibles</p>
              </div>
              <div className="text-center">
                <Award className="size-8 mx-auto mb-2" />
                <p className="text-4xl font-bold mb-1">75K+</p>
                <p className="text-blue-100">Certificats délivrés</p>
              </div>
              <div className="text-center">
                <TrendingUp className="size-8 mx-auto mb-2" />
                <p className="text-4xl font-bold mb-1">98%</p>
                <p className="text-blue-100">Taux de satisfaction</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-6">Nos valeurs</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-2">
                  🎓 Accessibilité
                </h3>
                <p className="text-muted-foreground">
                  L'éducation doit être accessible à tous, sans barrières
                  financières ou géographiques.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">
                  ✨ Qualité
                </h3>
                <p className="text-muted-foreground">
                  Nous nous engageons à offrir du contenu de haute qualité,
                  créé par des experts reconnus.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">
                  🤝 Communauté
                </h3>
                <p className="text-muted-foreground">
                  Nous créons un environnement d'apprentissage collaboratif où
                  chacun peut progresser ensemble.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">
                  🚀 Innovation
                </h3>
                <p className="text-muted-foreground">
                  Nous utilisons les dernières technologies pour offrir la
                  meilleure expérience d'apprentissage possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
