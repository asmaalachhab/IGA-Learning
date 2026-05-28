# IGA Learning - Guide de Déploiement Complet

## Configuration Requise

- **Java 17+**
- **Maven 3.6+**
- **Node.js 18+**
- **MySQL 8.0+** (XAMPP recommandé)
- **Tomcat 10+**

## 📋 Étapes de Déploiement

### 1. Configuration de la Base de Données MySQL

```bash
# Démarrer XAMPP MySQL
# Importer le fichier SQL via phpMyAdmin:
database/iga_learning.sql
```

**Configuration MySQL:**
- Host: `localhost`
- Port: `3306`
- Database: `iga_learning`
- User: `root`
- Password: `vide`

### 2. Compilation du Backend (Java EE)

```bash
cd backend
mvn clean package
```

Le fichier WAR sera généré dans: `backend/target/iga-learning-api.war`

### 3. Déploiement sur Tomcat 10

1. Copier `backend/target/iga-learning-api.war` dans `apache-tomcat-10.1.54/webapps/`
2. Démarrer Tomcat: `apache-tomcat-10.1.54/bin/startup.bat`
3. L'API sera disponible sur: `http://localhost:8080/iga-learning-api`

### 4. Installation et Lancement du Frontend

```bash
# Installation des dépendances
npm install

# Développement
npm run dev

# Production
npm run build
```

Le frontend sera disponible sur: `http://localhost:5173`

## 🔐 Comptes de Démonstration

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | admin@iga-learning.com | admin123 |
| Professeur | prof@iga-learning.com | prof123 |
| Étudiant | etudiant@iga-learning.com | etudiant123 |

## 🌐 URLs d'Accès

- **Frontend**: http://localhost:5173
- **API Backend**: http://localhost:8080/iga-learning-api
- **Admin Dashboard**: http://localhost:5173/admin
- **Teacher Dashboard**: http://localhost:5173/teacher
- **Student Dashboard**: http://localhost:5173/student

## 📊 API Endpoints Principaux

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription

### Utilisateurs
- `GET /api/users/me` - Profil utilisateur
- `PUT /api/users/me` - Mise à jour profil
- `GET /api/users` - Liste des utilisateurs (Admin)

### Cours
- `GET /api/courses` - Liste des cours
- `GET /api/courses/{id}` - Détail d'un cours
- `POST /api/courses` - Créer un cours

### Inscriptions
- `POST /api/enrollments` - S'inscrire à un cours
- `GET /api/dashboard?userId={id}` - Dashboard utilisateur

## 🛠️ Configuration de l'Environnement

### Variables d'Environnement (Backend)
```bash
DB_URL=jdbc:mysql://localhost:3306/iga_learning?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
DB_USER=root
DB_PASS=
```

### Variables d'Environnement (Frontend)
```bash
VITE_API_URL=http://localhost:8080/iga-learning-api/api
```

## 🔧 Vérification du Déploiement

1. **Base de données**: Vérifier que les tables sont créées et peuplées
2. **Backend**: Tester `http://localhost:8080/iga-learning-api/api/users`
3. **Frontend**: Vérifier l'interface et la connexion
4. **CORS**: Confirmer que le frontend communique avec le backend

## 🚨 Dépannage

### Problèmes Communs

1. **Erreur de connexion MySQL**
   - Vérifier que XAMPP MySQL est démarré
   - Confirmer les identifiants (root / vide)

2. **Erreur CORS**
   - Vérifier que le CorsFilter est bien configuré
   - Confirmer les URLs dans le frontend

3. **Build Maven échoue**
   - Vérifier Java 17+ installé
   - Confirmer les variables d'environnement JAVA_HOME

4. **Frontend ne démarre pas**
   - Supprimer node_modules et réinstaller: `npm install`
   - Vérifier Node.js 18+ installé

## 📝 Notes Techniques

- **Architecture**: React/Vite + Java Servlet + MySQL
- **Authentification**: Token-based avec localStorage
- **Sécurité**: BCrypt pour les mots de passe
- **CORS**: Configuré pour développement local
- **Build**: Maven pour backend, npm/Vite pour frontend
