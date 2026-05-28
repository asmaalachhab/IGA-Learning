# Backend Java EE - IGA Learning

## Technologies
- Java 17
- Jakarta Servlet API 6
- JDBC
- MySQL
- Maven
- Gson
- BCrypt

## Installation
1. Créer la base de données avec `database/iga_learning.sql` dans MySQL Workbench ou phpMyAdmin.
2. Modifier les identifiants si besoin :
   - `DB_URL=jdbc:mysql://localhost:3306/iga_learning?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true`
   - `DB_USER=root`
   - `DB_PASS=`
3. Compiler :
   ```bash
   cd backend
   mvn clean package
   ```
4. Copier `target/iga-learning-api.war` dans Tomcat 10+.
5. API disponible sur : `http://localhost:8080/iga-learning-api/api`

## Comptes test
- Admin : `admin@iga.ma` / `password`
- Étudiant : `student@iga.ma` / `password`

## Endpoints principaux
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/courses`
- `GET /api/courses/{id}`
- `POST /api/courses`
- `PUT /api/courses/{id}`
- `DELETE /api/courses/{id}`
- `GET /api/categories`
- `POST /api/enrollments`
- `GET /api/enrollments?userId=2`
- `POST /api/progress`
- `GET /api/dashboard?userId=2`
