import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Search,
  TrendingUp,
  Award,
  Users,
  BookOpen,
  CheckCircle,
  Smartphone,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { courses, categories } from '../data/mockData';
import { CourseCard } from '../components/CourseCard';
import { CategoryCard } from '../components/CategoryCard';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explorer?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const bestCourses = courses
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);
  const newCourses = courses.slice(0, 6);

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary to-slate-900 text-white py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <span className="flex size-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-sm font-medium">Plus de 500 nouveaux cours ajoutés</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
              L'excellence éducative, <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                accessible à tous.
              </span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl mb-10 text-blue-100/90 font-light max-w-2xl mx-auto">
              Rejoignez la première plateforme d'apprentissage IGA.
              Développez vos compétences avec des experts et obtenez des certificats reconnus.
            </motion.p>
            
            <motion.form onSubmit={handleSearch} variants={fadeInUp} className="relative max-w-2xl mx-auto group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-teal-300 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-2xl">
                <Search className="ml-4 size-6 text-blue-200 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Que souhaitez-vous apprendre aujourd'hui ?"
                  className="w-full bg-transparent border-none px-4 py-3 text-white placeholder:text-blue-200/70 focus:outline-none focus:ring-0 text-lg"
                />
                <button type="submit" className="px-8 py-3 bg-white text-primary font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
                  Rechercher
                </button>
              </div>
            </motion.form>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 border-b border-border bg-white relative z-20 -mt-10 mx-4 md:mx-auto max-w-6xl rounded-2xl shadow-xl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border/50">
            {[
              { label: "Apprenants actifs", value: "25k+", icon: Users },
              { label: "Cours disponibles", value: "1,200+", icon: BookOpen },
              { label: "Certifications", value: "15k+", icon: Award },
              { label: "Taux de réussite", value: "94%", icon: TrendingUp },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center justify-center text-center px-4"
              >
                <stat.icon className="size-8 text-primary mb-3 opacity-80" />
                <h4 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h4>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meilleurs Cours */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4"
          >
            <div className="max-w-2xl">
              <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Top Sélection</span>
              <h2 className="text-4xl font-extrabold mb-4 text-slate-900">Les plus plébiscités</h2>
              <p className="text-lg text-muted-foreground">
                Découvrez les cours les mieux notés par notre communauté d'apprenants et commencez votre progression dès maintenant.
              </p>
            </div>
            <Link
              to="/cours"
              className="group flex items-center gap-2 px-6 py-3 bg-white border border-border text-slate-800 font-semibold rounded-xl hover:border-primary hover:text-primary transition-all shadow-sm hover:shadow-md"
            >
              Voir le catalogue
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {bestCourses.map((course) => (
              <motion.div key={course.id} variants={fadeInUp}>
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Nouveautés */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white opacity-60"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4"
          >
            <div className="max-w-2xl">
              <span className="text-secondary font-semibold tracking-wider uppercase text-sm mb-2 block">Nouveautés</span>
              <h2 className="text-4xl font-extrabold mb-4 text-slate-900">Derniers ajouts</h2>
              <p className="text-lg text-muted-foreground">
                Restez à la pointe de la technologie avec nos toutes dernières formations fraîchement publiées.
              </p>
            </div>
            <Link
              to="/cours"
              className="group flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              Découvrir plus
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {newCourses.map((course) => (
              <motion.div key={course.id} variants={fadeInUp}>
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Catégories */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-extrabold mb-6">Explorez nos domaines d'expertise</h2>
            <p className="text-xl text-slate-400 font-light">
              Que vous souhaitiez vous reconvertir ou monter en compétences, nous avons la catégorie qu'il vous faut.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {categories.map((category) => (
              <motion.div key={category.id} variants={fadeInUp}>
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Mobile App */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-primary to-blue-800 rounded-[2.5rem] p-8 md:p-16 text-white relative shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-xl relative z-10 mb-12 md:mb-0"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Apprenez partout,<br/>à tout moment
              </h2>
              <p className="text-xl text-blue-100 mb-8 font-light">
                Emportez IGA Learning dans votre poche. Téléchargez nos cours pour une consultation hors ligne et progressez à votre rythme.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button onClick={() => alert('L\'application iOS sera bientôt disponible !')} className="flex items-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition shadow-lg hover:-translate-y-1">
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] uppercase tracking-wider text-slate-300">Disponible sur</span>
                    <span className="font-bold text-lg leading-none">App Store</span>
                  </div>
                </button>
                <button onClick={() => alert('L\'application Android sera bientôt disponible !')} className="flex items-center gap-3 px-6 py-4 bg-white text-slate-900 rounded-xl hover:bg-slate-50 transition shadow-lg hover:-translate-y-1">
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">Disponible sur</span>
                    <span className="font-bold text-lg leading-none">Google Play</span>
                  </div>
                </button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-10 w-full md:w-1/3 flex justify-center perspective-[1000px]"
            >
              <div className="relative w-64 h-[500px] bg-slate-900 rounded-[3rem] border-8 border-slate-800 shadow-2xl overflow-hidden rotate-[-5deg] hover:rotate-0 transition-transform duration-500 ease-out">
                <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-xl w-32 mx-auto z-20"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-80"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-0 w-full text-center">
                  <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/80 backdrop-blur-md border border-white/20 shadow-lg">
                    <Award className="size-8 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
