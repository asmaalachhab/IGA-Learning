import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { Search, SlidersHorizontal } from 'lucide-react';
import { courses as mockCourses } from '../data/mockData';
import { api } from '../services/api';
import { CourseCard } from '../components/CourseCard';

export function CourseList() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('best-rated');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterDuration, setFilterDuration] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [courses, setCourses] = useState<any[]>(mockCourses);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCourses('', categoryParam || '')
      .then((data) => setCourses(data as any[]))
      .catch(() => setCourses(mockCourses))
      .finally(() => setLoading(false));
  }, [categoryParam]);

  const filteredCourses = useMemo(() => {
    let filtered = courses;

    // Le filtrage par catégorie est déjà appliqué côté backend si categoryParam existe.
    // En mode fallback mock, on garde tous les cours pour éviter une liste vide à cause des slugs.
    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterLevel !== 'all') {
      filtered = filtered.filter((course) => course.level === filterLevel);
    }

    if (filterDuration !== 'all') {
      const duration = parseInt(filterDuration);
      filtered = filtered.filter((course) => {
        const courseDuration = parseInt(course.duration);
        if (filterDuration === '5') return courseDuration <= 5;
        if (filterDuration === '10') return courseDuration > 5 && courseDuration <= 10;
        if (filterDuration === '20') return courseDuration > 10 && courseDuration <= 20;
        if (filterDuration === '20+') return courseDuration > 20;
        return true;
      });
    }

    if (sortBy === 'best-rated') {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      filtered = [...filtered];
    }

    return filtered;
  }, [categoryParam, searchQuery, sortBy, filterLevel, filterDuration]);

  return (
    <div className="min-h-screen bg-muted">
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Catalogue des cours</h1>
          <p className="text-xl text-blue-100">
            {filteredCourses.length} cours disponibles
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un cours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-4 sticky top-24">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden w-full flex items-center justify-between mb-4 px-4 py-2 bg-primary text-white rounded-lg"
              >
                <span>Filtres</span>
                <SlidersHorizontal className="size-5" />
              </button>

              <div className={showFilters ? 'block' : 'hidden lg:block'}>
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Trier par</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="best-rated">Mieux notés</option>
                    <option value="newest">Derniers cours</option>
                  </select>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Niveau</h3>
                  <div className="space-y-2">
                    {['all', 'Débutant', 'Intermédiaire', 'Avancé'].map(
                      (level) => (
                        <label key={level} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="level"
                            value={level}
                            checked={filterLevel === level}
                            onChange={(e) => setFilterLevel(e.target.value)}
                            className="size-4"
                          />
                          <span>{level === 'all' ? 'Tous' : level}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Durée</h3>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'Toutes' },
                      { value: '5', label: 'Moins de 5h' },
                      { value: '10', label: '5-10h' },
                      { value: '20', label: '10-20h' },
                      { value: '20+', label: 'Plus de 20h' }
                    ].map((duration) => (
                      <label
                        key={duration.value}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="radio"
                          name="duration"
                          value={duration.value}
                          checked={filterDuration === duration.value}
                          onChange={(e) => setFilterDuration(e.target.value)}
                          className="size-4"
                        />
                        <span>{duration.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-4">
              {loading && <div className="bg-white rounded-lg p-6 text-center">Chargement des cours...</div>}
              {!loading && filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} horizontal />
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-muted-foreground">
                  Aucun cours trouvé avec ces critères
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
