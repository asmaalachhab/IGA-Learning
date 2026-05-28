import { useState } from 'react';
import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { categories } from '../data/mockData';

export function ExploreCourses() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categories[0].id
  );

  const selected = categories.find((cat) => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-muted">
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Explorer les cours</h1>
          <p className="text-xl text-blue-100">
            Parcourez nos cours par domaine et sous-catégorie
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-4 sticky top-24">
              <h2 className="font-semibold mb-4">Domaines</h2>
              <nav className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg transition text-left ${
                      selectedCategory === category.id
                        ? 'bg-primary text-white'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <span className="text-xl">{category.icon}</span>
                    <span className="flex-1">{category.name}</span>
                    <ChevronRight className="size-4" />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            {selected && (
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-5xl">{selected.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold">{selected.name}</h2>
                    <p className="text-muted-foreground">
                      {selected.subcategories.length} sous-catégories
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selected.subcategories.map((sub, index) => (
                    <Link
                      key={index}
                      to={`/cours?category=${selected.slug}&subcategory=${sub}`}
                      className="flex items-center justify-between p-4 border rounded-lg hover:border-primary hover:shadow-md transition"
                    >
                      <span className="font-medium">{sub}</span>
                      <ChevronRight className="size-5 text-primary" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
