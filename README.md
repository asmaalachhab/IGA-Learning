# IGA Learning Final

Plateforme e-learning React + Vite + TypeScript + Tailwind avec backend Java Servlet/Tomcat/MySQL.

## Fonctionnalités principales
- Interface moderne inspirée Cursa avec logo IGA intégré.
- Catalogue de cours, détails, dashboard étudiant, certificats.
- Route d'apprentissage `/cours/:id/learn` avec lecteur vidéo, playlist, progression, notes et quiz.
- API progression, favoris, avis et notifications.
- Nouvelles tables SQL : `course_progress`, `favorites`, `course_reviews`, `notifications`.

## Lancement rapide
```bash
npm install
npm run dev
```
Backend :
```bash
cd backend
mvn clean package
```
