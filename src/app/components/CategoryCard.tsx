import { Link } from 'react-router';
import { Category } from '../data/mockData';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/cours?category=${category.slug}`}
      className="block p-6 border rounded-lg hover:shadow-lg hover:border-primary transition bg-white"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">{category.icon}</span>
        <h3 className="font-semibold">{category.name}</h3>
      </div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {category.subcategories.slice(0, 4).map((sub, index) => (
          <li key={index}>• {sub}</li>
        ))}
        {category.subcategories.length > 4 && (
          <li className="text-primary">
            +{category.subcategories.length - 4} autres
          </li>
        )}
      </ul>
    </Link>
  );
}
