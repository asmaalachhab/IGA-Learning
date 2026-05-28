export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  subcategories: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  image: string;
  rating: number;
  reviews: number;
  duration: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  exercises: number;
  lessons: Lesson[];
  objectives: string[];
  prerequisites: string[];
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  duration: string;
  order: number;
  content: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  questions: Question[];
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Informatique',
    slug: 'informatique',
    icon: '💻',
    subcategories: [
      'Langages de programmation',
      'Base de données',
      'Réseaux',
      'Cybersécurité',
      'Développement web',
      'Développement mobile',
      'Bureautique',
      'Intelligence artificielle'
    ]
  },
  {
    id: '2',
    name: 'Business',
    slug: 'business',
    icon: '💼',
    subcategories: [
      'Management',
      'Marketing digital',
      'Entrepreneuriat',
      'Finance',
      'Comptabilité'
    ]
  },
  {
    id: '3',
    name: 'Design',
    slug: 'design',
    icon: '🎨',
    subcategories: [
      'UI/UX Design',
      'Graphic Design',
      'Web Design',
      'Motion Design'
    ]
  },
  {
    id: '4',
    name: 'Langues',
    slug: 'langues',
    icon: '🌍',
    subcategories: ['Anglais', 'Français', 'Espagnol', 'Allemand', 'Arabe']
  },
  {
    id: '5',
    name: 'Sciences',
    slug: 'sciences',
    icon: '🔬',
    subcategories: ['Mathématiques', 'Physique', 'Chimie', 'Biologie']
  },
  {
    id: '6',
    name: 'Santé',
    slug: 'sante',
    icon: '⚕️',
    subcategories: ['Médecine', 'Nutrition', 'Psychologie', 'Sport']
  },
  {
    id: '7',
    name: 'Arts',
    slug: 'arts',
    icon: '🎭',
    subcategories: ['Musique', 'Photographie', 'Cinéma', 'Théâtre']
  },
  {
    id: '8',
    name: 'Développement Personnel',
    slug: 'developpement-personnel',
    icon: '🧠',
    subcategories: [
      'Leadership',
      'Communication',
      'Gestion du temps',
      'Confiance en soi'
    ]
  }
];

export const courses: Course[] = [
  {
    id: '1',
    title: 'Java pour débutants - Programmation orientée objet',
    description:
      'Apprenez les fondamentaux de Java et de la programmation orientée objet. Ce cours couvre les bases du langage Java, les concepts POO, et les bonnes pratiques de développement.',
    category: 'Informatique',
    subcategory: 'Langages de programmation',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    rating: 4.8,
    reviews: 1250,
    duration: '12h',
    level: 'Débutant',
    exercises: 45,
    lessons: [],
    objectives: [
      'Maîtriser les bases du langage Java',
      'Comprendre la programmation orientée objet',
      'Créer des applications Java simples',
      'Utiliser les collections Java'
    ],
    prerequisites: [
      'Aucune expérience en programmation requise',
      'Ordinateur avec Java installé'
    ]
  },
  {
    id: '2',
    title: 'SQL et bases de données relationnelles',
    description:
      'Maîtrisez SQL et les bases de données relationnelles. Apprenez à créer, gérer et interroger des bases de données avec MySQL et PostgreSQL.',
    category: 'Informatique',
    subcategory: 'Base de données',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d',
    rating: 4.7,
    reviews: 980,
    duration: '10h',
    level: 'Débutant',
    exercises: 38,
    lessons: [],
    objectives: [
      'Écrire des requêtes SQL complexes',
      'Concevoir des bases de données normalisées',
      'Optimiser les performances des requêtes',
      'Gérer les transactions et la sécurité'
    ],
    prerequisites: ['Connaissances de base en informatique']
  },
  {
    id: '3',
    title: 'Cybersécurité - Principes fondamentaux',
    description:
      'Découvrez les principes essentiels de la cybersécurité. Apprenez à protéger les systèmes informatiques contre les menaces et les attaques.',
    category: 'Informatique',
    subcategory: 'Cybersécurité',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
    rating: 4.9,
    reviews: 2100,
    duration: '15h',
    level: 'Intermédiaire',
    exercises: 52,
    lessons: [],
    objectives: [
      'Identifier les vulnérabilités courantes',
      'Mettre en place des mesures de sécurité',
      'Comprendre le cryptage et les protocoles sécurisés',
      'Gérer les incidents de sécurité'
    ],
    prerequisites: ['Bases en réseaux informatiques', 'Connaissances Linux']
  },
  {
    id: '4',
    title: 'Développement Web avec HTML, CSS et JavaScript',
    description:
      'Créez des sites web modernes et responsives. Maîtrisez HTML5, CSS3 et JavaScript pour développer des interfaces web professionnelles.',
    category: 'Informatique',
    subcategory: 'Développement web',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    rating: 4.6,
    reviews: 1800,
    duration: '18h',
    level: 'Débutant',
    exercises: 60,
    lessons: [],
    objectives: [
      'Créer des pages web structurées avec HTML',
      'Styliser des sites avec CSS moderne',
      'Ajouter de l\'interactivité avec JavaScript',
      'Développer des sites responsives'
    ],
    prerequisites: ['Aucune expérience requise']
  },
  {
    id: '5',
    title: 'React - Développement d\'applications web modernes',
    description:
      'Maîtrisez React, la bibliothèque JavaScript la plus populaire. Créez des applications web interactives et performantes.',
    category: 'Informatique',
    subcategory: 'Développement web',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
    rating: 4.8,
    reviews: 3200,
    duration: '20h',
    level: 'Intermédiaire',
    exercises: 75,
    lessons: [],
    objectives: [
      'Comprendre les concepts de React',
      'Gérer l\'état avec hooks',
      'Utiliser React Router pour la navigation',
      'Connecter à des APIs REST'
    ],
    prerequisites: ['Connaissances en HTML, CSS et JavaScript']
  },
  {
    id: '6',
    title: 'Développement mobile avec React Native',
    description:
      'Créez des applications mobiles iOS et Android avec React Native. Un seul code pour deux plateformes.',
    category: 'Informatique',
    subcategory: 'Développement mobile',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c',
    rating: 4.7,
    reviews: 1500,
    duration: '22h',
    level: 'Intermédiaire',
    exercises: 68,
    lessons: [],
    objectives: [
      'Développer des apps mobiles cross-platform',
      'Utiliser les composants natifs',
      'Gérer la navigation mobile',
      'Publier sur les stores'
    ],
    prerequisites: ['Maîtrise de React et JavaScript']
  },
  {
    id: '7',
    title: 'Intelligence Artificielle - Introduction au Machine Learning',
    description:
      'Découvrez les fondamentaux de l\'IA et du Machine Learning. Créez vos premiers modèles prédictifs avec Python.',
    category: 'Informatique',
    subcategory: 'Intelligence artificielle',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    rating: 4.9,
    reviews: 2800,
    duration: '25h',
    level: 'Avancé',
    exercises: 85,
    lessons: [],
    objectives: [
      'Comprendre les algorithmes de ML',
      'Utiliser scikit-learn et TensorFlow',
      'Entraîner des modèles de classification',
      'Évaluer et optimiser les performances'
    ],
    prerequisites: ['Python avancé', 'Mathématiques (algèbre, statistiques)']
  },
  {
    id: '8',
    title: 'Python pour Data Science',
    description:
      'Maîtrisez Python pour l\'analyse de données. Utilisez pandas, NumPy et matplotlib pour explorer et visualiser des données.',
    category: 'Informatique',
    subcategory: 'Langages de programmation',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    rating: 4.7,
    reviews: 2400,
    duration: '16h',
    level: 'Intermédiaire',
    exercises: 55,
    lessons: [],
    objectives: [
      'Manipuler des données avec pandas',
      'Créer des visualisations impactantes',
      'Nettoyer et préparer les données',
      'Analyser des datasets complexes'
    ],
    prerequisites: ['Bases en Python']
  },
  {
    id: '9',
    title: 'Réseaux informatiques - Du débutant à l\'expert',
    description:
      'Comprenez le fonctionnement des réseaux informatiques. Du modèle OSI aux protocoles TCP/IP, devenez expert en networking.',
    category: 'Informatique',
    subcategory: 'Réseaux',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
    rating: 4.6,
    reviews: 1100,
    duration: '14h',
    level: 'Intermédiaire',
    exercises: 42,
    lessons: [],
    objectives: [
      'Comprendre le modèle OSI et TCP/IP',
      'Configurer des routeurs et switchs',
      'Diagnostiquer les problèmes réseau',
      'Sécuriser les infrastructures réseau'
    ],
    prerequisites: ['Bases en informatique']
  },
  {
    id: '10',
    title: 'Excel avancé - Tableaux croisés dynamiques et macros',
    description:
      'Devenez expert Excel. Maîtrisez les tableaux croisés dynamiques, les formules avancées et l\'automatisation avec VBA.',
    category: 'Informatique',
    subcategory: 'Bureautique',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
    rating: 4.5,
    reviews: 890,
    duration: '11h',
    level: 'Intermédiaire',
    exercises: 35,
    lessons: [],
    objectives: [
      'Créer des tableaux croisés dynamiques',
      'Utiliser des formules complexes',
      'Automatiser avec les macros VBA',
      'Créer des dashboards professionnels'
    ],
    prerequisites: ['Bases en Excel']
  },
  {
    id: '11',
    title: 'Marketing Digital - Stratégies et outils',
    description:
      'Maîtrisez le marketing digital. SEO, SEA, réseaux sociaux, email marketing : toutes les compétences pour réussir en ligne.',
    category: 'Business',
    subcategory: 'Marketing digital',
    image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293',
    rating: 4.7,
    reviews: 1600,
    duration: '13h',
    level: 'Débutant',
    exercises: 40,
    lessons: [],
    objectives: [
      'Optimiser le référencement SEO',
      'Créer des campagnes publicitaires efficaces',
      'Gérer les réseaux sociaux',
      'Mesurer le ROI de vos actions'
    ],
    prerequisites: ['Aucune']
  },
  {
    id: '12',
    title: 'UI/UX Design - Créer des expériences utilisateur exceptionnelles',
    description:
      'Apprenez à concevoir des interfaces utilisateur intuitives et esthétiques. Maîtrisez Figma et les principes du design.',
    category: 'Design',
    subcategory: 'UI/UX Design',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5',
    rating: 4.8,
    reviews: 2200,
    duration: '17h',
    level: 'Débutant',
    exercises: 50,
    lessons: [],
    objectives: [
      'Comprendre les principes UX',
      'Maîtriser Figma pour le design',
      'Créer des prototypes interactifs',
      'Conduire des tests utilisateurs'
    ],
    prerequisites: ['Sensibilité au design']
  },
  {
    id: '13',
    title: 'Anglais professionnel - Business English',
    description:
      'Perfectionnez votre anglais professionnel. Communication, présentations, négociations : tout pour réussir en entreprise.',
    category: 'Langues',
    subcategory: 'Anglais',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d',
    rating: 4.6,
    reviews: 1400,
    duration: '15h',
    level: 'Intermédiaire',
    exercises: 65,
    lessons: [],
    objectives: [
      'Communiquer efficacement en anglais',
      'Rédiger des emails professionnels',
      'Faire des présentations convaincantes',
      'Négocier en anglais'
    ],
    prerequisites: ['Niveau B1 en anglais']
  },
  {
    id: '14',
    title: 'Gestion de projet Agile et Scrum',
    description:
      'Maîtrisez les méthodologies Agile et Scrum. Gérez efficacement vos projets et vos équipes.',
    category: 'Business',
    subcategory: 'Management',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
    rating: 4.7,
    reviews: 1900,
    duration: '12h',
    level: 'Intermédiaire',
    exercises: 44,
    lessons: [],
    objectives: [
      'Comprendre les principes Agile',
      'Appliquer le framework Scrum',
      'Animer des sprints efficaces',
      'Devenir Scrum Master certifié'
    ],
    prerequisites: ['Expérience en gestion de projet']
  },
  {
    id: '15',
    title: 'Photographie numérique - De débutant à professionnel',
    description:
      'Apprenez la photographie de A à Z. Techniques, composition, post-traitement : tout pour devenir photographe.',
    category: 'Arts',
    subcategory: 'Photographie',
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e',
    rating: 4.9,
    reviews: 3100,
    duration: '19h',
    level: 'Débutant',
    exercises: 70,
    lessons: [],
    objectives: [
      'Maîtriser les réglages de l\'appareil',
      'Comprendre la composition',
      'Retoucher avec Lightroom et Photoshop',
      'Créer un portfolio professionnel'
    ],
    prerequisites: ['Posséder un appareil photo']
  },
  {
    id: '16',
    title: 'Node.js et Express - Backend JavaScript',
    description:
      'Créez des APIs REST avec Node.js et Express. Maîtrisez le développement backend en JavaScript.',
    category: 'Informatique',
    subcategory: 'Développement web',
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479',
    rating: 4.7,
    reviews: 1700,
    duration: '16h',
    level: 'Intermédiaire',
    exercises: 58,
    lessons: [],
    objectives: [
      'Créer des serveurs avec Express',
      'Gérer des bases de données MongoDB',
      'Authentifier avec JWT',
      'Déployer des APIs en production'
    ],
    prerequisites: ['JavaScript ES6+']
  },
  {
    id: '17',
    title: 'Docker et Kubernetes - DevOps moderne',
    description:
      'Maîtrisez la conteneurisation avec Docker et l\'orchestration avec Kubernetes. Déployez des applications scalables.',
    category: 'Informatique',
    subcategory: 'Réseaux',
    image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b',
    rating: 4.8,
    reviews: 2500,
    duration: '21h',
    level: 'Avancé',
    exercises: 72,
    lessons: [],
    objectives: [
      'Créer et gérer des conteneurs Docker',
      'Orchestrer avec Kubernetes',
      'Mettre en place CI/CD',
      'Monitorer les applications'
    ],
    prerequisites: ['Linux, développement web']
  },
  {
    id: '18',
    title: 'Blockchain et Cryptomonnaies',
    description:
      'Comprenez la technologie blockchain et les cryptomonnaies. Développez des smart contracts avec Solidity.',
    category: 'Informatique',
    subcategory: 'Cybersécurité',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0',
    rating: 4.6,
    reviews: 1300,
    duration: '18h',
    level: 'Avancé',
    exercises: 62,
    lessons: [],
    objectives: [
      'Comprendre la blockchain',
      'Développer des smart contracts',
      'Créer des tokens ERC-20',
      'Déployer sur Ethereum'
    ],
    prerequisites: ['Programmation (JavaScript ou Python)']
  },
  {
    id: '19',
    title: 'Entrepreneuriat - Créer et développer sa startup',
    description:
      'Apprenez à créer et développer votre startup. Business model, levée de fonds, growth hacking : tout pour réussir.',
    category: 'Business',
    subcategory: 'Entrepreneuriat',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd',
    rating: 4.7,
    reviews: 2100,
    duration: '14h',
    level: 'Débutant',
    exercises: 48,
    lessons: [],
    objectives: [
      'Valider son idée de startup',
      'Créer un business plan solide',
      'Lever des fonds',
      'Scaler son entreprise'
    ],
    prerequisites: ['Aucune']
  },
  {
    id: '20',
    title: 'Finance d\'entreprise - Analyse financière',
    description:
      'Maîtrisez l\'analyse financière. Bilans, compte de résultat, ratios : comprenez la santé financière des entreprises.',
    category: 'Business',
    subcategory: 'Finance',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c',
    rating: 4.5,
    reviews: 980,
    duration: '13h',
    level: 'Intermédiaire',
    exercises: 41,
    lessons: [],
    objectives: [
      'Analyser les états financiers',
      'Calculer les ratios clés',
      'Évaluer la rentabilité',
      'Prendre des décisions financières'
    ],
    prerequisites: ['Bases en comptabilité']
  },
  {
    id: '21',
    title: 'Motion Design avec After Effects',
    description:
      'Créez des animations professionnelles avec Adobe After Effects. Du motion design aux effets spéciaux.',
    category: 'Design',
    subcategory: 'Motion Design',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d',
    rating: 4.8,
    reviews: 1800,
    duration: '17h',
    level: 'Intermédiaire',
    exercises: 56,
    lessons: [],
    objectives: [
      'Maîtriser After Effects',
      'Créer des animations fluides',
      'Utiliser les expressions',
      'Produire des vidéos professionnelles'
    ],
    prerequisites: ['Bases en design graphique']
  },
  {
    id: '22',
    title: 'Mathématiques pour l\'informatique',
    description:
      'Renforcez vos bases mathématiques pour l\'informatique. Algèbre, logique, probabilités et statistiques.',
    category: 'Sciences',
    subcategory: 'Mathématiques',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
    rating: 4.6,
    reviews: 1200,
    duration: '20h',
    level: 'Intermédiaire',
    exercises: 80,
    lessons: [],
    objectives: [
      'Maîtriser l\'algèbre linéaire',
      'Comprendre la logique mathématique',
      'Appliquer les probabilités',
      'Utiliser les statistiques'
    ],
    prerequisites: ['Niveau lycée en mathématiques']
  },
  {
    id: '23',
    title: 'Nutrition et diététique',
    description:
      'Apprenez les principes de la nutrition. Créez des plans alimentaires équilibrés et sains.',
    category: 'Santé',
    subcategory: 'Nutrition',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061',
    rating: 4.7,
    reviews: 1600,
    duration: '12h',
    level: 'Débutant',
    exercises: 38,
    lessons: [],
    objectives: [
      'Comprendre les macronutriments',
      'Créer des plans alimentaires',
      'Gérer le poids sainement',
      'Adapter l\'alimentation au sport'
    ],
    prerequisites: ['Aucune']
  },
  {
    id: '24',
    title: 'Leadership et management d\'équipe',
    description:
      'Développez vos compétences en leadership. Motivez, gérez et faites grandir vos équipes.',
    category: 'Développement Personnel',
    subcategory: 'Leadership',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
    rating: 4.8,
    reviews: 2300,
    duration: '11h',
    level: 'Débutant',
    exercises: 36,
    lessons: [],
    objectives: [
      'Développer son leadership',
      'Communiquer efficacement',
      'Gérer les conflits',
      'Motiver ses équipes'
    ],
    prerequisites: ['Expérience en management ou souhait d\'évoluer']
  },
  {
    id: '25',
    title: 'Composition musicale et MAO',
    description:
      'Créez votre musique avec les outils numériques. De la composition à la production musicale assistée par ordinateur.',
    category: 'Arts',
    subcategory: 'Musique',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04',
    rating: 4.7,
    reviews: 1500,
    duration: '16h',
    level: 'Débutant',
    exercises: 52,
    lessons: [],
    objectives: [
      'Composer avec un DAW',
      'Enregistrer et mixer',
      'Utiliser des instruments virtuels',
      'Produire un morceau complet'
    ],
    prerequisites: ['Bases en musique']
  },
  {
    id: '26',
    title: 'TypeScript - JavaScript typé pour de meilleures applications',
    description:
      'Maîtrisez TypeScript pour créer des applications JavaScript robustes et maintenables.',
    category: 'Informatique',
    subcategory: 'Langages de programmation',
    image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159',
    rating: 4.8,
    reviews: 2700,
    duration: '14h',
    level: 'Intermédiaire',
    exercises: 50,
    lessons: [],
    objectives: [
      'Utiliser le système de types',
      'Créer des interfaces et types',
      'Intégrer TypeScript à React',
      'Configurer tsconfig.json'
    ],
    prerequisites: ['Maîtrise de JavaScript']
  },
  {
    id: '27',
    title: 'Git et GitHub - Versionning et collaboration',
    description:
      'Maîtrisez Git pour gérer vos projets. Branches, merge, pull requests : devenez expert du versionning.',
    category: 'Informatique',
    subcategory: 'Développement web',
    image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb',
    rating: 4.6,
    reviews: 3400,
    duration: '8h',
    level: 'Débutant',
    exercises: 32,
    lessons: [],
    objectives: [
      'Utiliser Git en ligne de commande',
      'Collaborer avec GitHub',
      'Gérer les branches et merge',
      'Résoudre les conflits'
    ],
    prerequisites: ['Aucune']
  },
  {
    id: '28',
    title: 'C++ moderne - Programmation système',
    description:
      'Apprenez le C++ moderne (C++17/20). De la programmation système aux applications haute performance.',
    category: 'Informatique',
    subcategory: 'Langages de programmation',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4',
    rating: 4.7,
    reviews: 1400,
    duration: '24h',
    level: 'Avancé',
    exercises: 88,
    lessons: [],
    objectives: [
      'Maîtriser la syntaxe C++',
      'Utiliser les smart pointers',
      'Comprendre la STL',
      'Optimiser les performances'
    ],
    prerequisites: ['Bases en programmation']
  },
  {
    id: '29',
    title: 'AWS Cloud Practitioner - Certification',
    description:
      'Préparez la certification AWS Cloud Practitioner. Maîtrisez les services cloud Amazon.',
    category: 'Informatique',
    subcategory: 'Réseaux',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    rating: 4.9,
    reviews: 4200,
    duration: '18h',
    level: 'Débutant',
    exercises: 120,
    lessons: [],
    objectives: [
      'Comprendre les services AWS',
      'Gérer EC2, S3, RDS',
      'Sécuriser le cloud',
      'Passer la certification'
    ],
    prerequisites: ['Bases en informatique']
  },
  {
    id: '30',
    title: 'Montage vidéo avec Premiere Pro',
    description:
      'Créez des vidéos professionnelles avec Adobe Premiere Pro. Du montage aux effets visuels.',
    category: 'Arts',
    subcategory: 'Cinéma',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d',
    rating: 4.8,
    reviews: 2900,
    duration: '15h',
    level: 'Débutant',
    exercises: 46,
    lessons: [],
    objectives: [
      'Maîtriser Premiere Pro',
      'Monter des vidéos dynamiques',
      'Ajouter des effets et transitions',
      'Exporter pour différents formats'
    ],
    prerequisites: ['Ordinateur avec Premiere Pro']
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Comment apprendre Java efficacement en 2026',
    excerpt:
      'Découvrez les meilleures stratégies pour maîtriser Java rapidement. Conseils pratiques, ressources et plan d\'apprentissage.',
    content:
      'Java reste l\'un des langages les plus demandés en 2026. Voici notre guide complet...',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    author: 'Dr. Ahmed Bennani',
    date: '2026-04-15',
    category: 'Programmation'
  },
  {
    id: '2',
    title: 'Les bases de données SQL : Guide complet pour débutants',
    excerpt:
      'Tout ce que vous devez savoir sur SQL. De la création de tables aux requêtes complexes.',
    content:
      'SQL est la pierre angulaire de la gestion de données. Dans cet article...',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d',
    author: 'Sara El Amrani',
    date: '2026-04-10',
    category: 'Base de données'
  },
  {
    id: '3',
    title: 'Cybersécurité : Protégez vos données en 5 étapes',
    excerpt:
      'Les cyberattaques sont en hausse. Voici comment protéger efficacement vos données personnelles et professionnelles.',
    content:
      'La cybersécurité n\'a jamais été aussi importante. Suivez ces 5 étapes...',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
    author: 'Youssef Khalil',
    date: '2026-04-05',
    category: 'Sécurité'
  },
  {
    id: '4',
    title: 'Développement Web : Les tendances 2026',
    excerpt:
      'React Server Components, Astro, Svelte... Découvrez les technologies qui façonnent le web moderne.',
    content:
      'Le développement web évolue rapidement. Voici les tendances à suivre...',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    author: 'Fatima Zahra',
    date: '2026-03-28',
    category: 'Développement web'
  },
  {
    id: '5',
    title: 'Intelligence Artificielle : Introduction pratique',
    excerpt:
      'L\'IA n\'est plus de la science-fiction. Apprenez les bases et créez votre premier modèle.',
    content:
      'L\'intelligence artificielle transforme tous les secteurs. Commencez ici...',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    author: 'Mehdi Alaoui',
    date: '2026-03-20',
    category: 'IA'
  },
  {
    id: '6',
    title: '10 conseils pour réussir vos études en ligne',
    excerpt:
      'L\'apprentissage en ligne demande de la discipline. Voici nos meilleurs conseils pour maximiser votre réussite.',
    content:
      'Étudier en ligne offre une flexibilité incroyable mais requiert organisation...',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
    author: 'Leila Benkirane',
    date: '2026-03-15',
    category: 'Éducation'
  },
  {
    id: '7',
    title: 'Les certifications IT les plus demandées en 2026',
    excerpt:
      'Boostez votre carrière avec ces certifications reconnues par les entreprises du monde entier.',
    content:
      'Les certifications IT peuvent transformer votre carrière. Voici notre sélection...',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
    author: 'Omar Idrissi',
    date: '2026-03-08',
    category: 'Carrière'
  },
  {
    id: '8',
    title: 'React vs Vue vs Angular : Quel framework choisir ?',
    excerpt:
      'Comparatif détaillé des trois frameworks JavaScript les plus populaires pour vous aider à faire le bon choix.',
    content:
      'Choisir le bon framework est crucial. Analysons les avantages de chacun...',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
    author: 'Karim Tazi',
    date: '2026-02-28',
    category: 'Développement web'
  }
];
