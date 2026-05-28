# IGA Learning — Projet complet Frontend + Backend Java EE + MySQL

## Contenu du ZIP

- `src/` : frontend React + Vite avec style moderne IGA/Cursa.
- `backend/` : backend Java EE/Jakarta Servlets + JDBC + Gson.
- `database/iga_learning.sql` : base de données MySQL complète.
- `README_PROJET_COMPLET.md` : guide de lancement.

## Base de données incluse

La base contient :

- rôles
- utilisateurs
- catégories
- 30 cours
- 150 leçons
- 30 quiz
- 150 questions
- 600 réponses
- inscriptions
- progression
- certificats
- blog
- messages de contact

## Comptes de test

Admin :
- email : `admin@igalearning.ma`
- mot de passe : `admin123`

Étudiant :
- email : `student@igalearning.ma`
- mot de passe : `student123`

## 1. Importer la base MySQL

Dans phpMyAdmin ou MySQL Workbench, importe :

```sql
database/iga_learning.sql
```

Ou en ligne de commande :

```bash
mysql -u root -p < database/iga_learning.sql
```

## 2. Lancer le backend Java EE

Prérequis :
- JDK 17
- Maven
- Tomcat 10 ou 11
- MySQL

Configurer la connexion dans les variables d'environnement si besoin :

```bash
DB_URL=jdbc:mysql://localhost:3306/iga_learning?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
DB_USER=root
DB_PASS=
```

Compiler :

```bash
cd backend
mvn clean package
```

Puis déployer :

```text
backend/target/iga-learning-api.war
```

dans Tomcat.

L'API sera disponible ici :

```text
http://localhost:8080/iga-learning-api/api
```

Endpoints principaux :

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/courses`
- `GET /api/courses/{id}`
- `GET /api/categories`
- `POST /api/enrollments`
- `GET /api/dashboard?userId=2`
- `POST /api/progress`

## 3. Lancer le frontend

Installer les dépendances :

```bash
npm install
```

Lancer le projet :

```bash
npm run dev
```

Si ton backend n'est pas sur `http://localhost:8080/iga-learning-api/api`, crée un fichier `.env` :

```env
VITE_API_URL=http://localhost:8080/iga-learning-api/api
```

## Vérification réalisée

Le projet a été corrigé pour :
- utiliser la nouvelle base MySQL complète ;
- adapter les DAO Java à la structure réelle (`image`, `ordre`, `progress`) ;
- connecter login/register au backend ;
- connecter catalogue des cours au backend ;
- connecter détail cours + leçons au backend ;
- connecter dashboard/profil à MySQL ;
- conserver un fallback mock côté frontend si le backend n'est pas lancé.

Note : je n'ai pas pu compiler Maven ici, car Maven n'est pas installé dans l'environnement d'exécution.
