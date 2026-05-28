import { useState } from 'react';
import { blogPosts } from '../data/mockData';
import { BlogCard } from '../components/BlogCard';

export function Blog() {
  const [visiblePosts, setVisiblePosts] = useState(6);

  const loadMore = () => {
    setVisiblePosts((prev) => prev + 6);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Blog IGA Learning</h1>
          <p className="text-xl text-blue-100">
            Conseils, tutoriels et actualités sur l'apprentissage en ligne
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.slice(0, visiblePosts).map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {visiblePosts < blogPosts.length && (
          <div className="text-center mt-12">
            <button
              onClick={loadMore}
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium"
            >
              Charger plus d'articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
