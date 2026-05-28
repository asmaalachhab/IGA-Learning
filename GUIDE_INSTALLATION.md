# Guide d'installation IGA Learning Final

## Prérequis
- Node.js 18+
- Java 17+
- Maven 3.9+
- MySQL 8+
- Tomcat 10+

## Base de données
1. Créer une base MySQL nommée `iga_learning`.
2. Importer le fichier `database/iga_learning.sql`.

## Frontend
```bash
npm install
npm run typecheck
npm run build
npm run dev
```

## Backend
```bash
cd backend
mvn clean package
```
Déployer `backend/target/iga-learning-api.war` dans Tomcat 10.

## Variables d'environnement
Copier `.env.example` puis adapter `VITE_API_URL`, `DB_URL`, `DB_USER`, `DB_PASS`.
