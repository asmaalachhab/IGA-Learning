import { Link } from 'react-router';
import { Calendar, User } from 'lucide-react';
import { BlogPost } from '../data/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <article className="border rounded-lg overflow-hidden hover:shadow-lg transition bg-white">
      <ImageWithFallback
        src={post.image}
        alt={post.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <span className="inline-block px-3 py-1 bg-accent text-primary rounded-full text-sm mb-2">
          {post.category}
        </span>
        <h3 className="font-semibold mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <User className="size-3" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="size-3" />
            <span>{formattedDate}</span>
          </div>
        </div>
        <Link
          to={`/blog/${post.id}`}
          className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
        >
          Lire plus
        </Link>
      </div>
    </article>
  );
}
