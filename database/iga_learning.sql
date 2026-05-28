DROP DATABASE IF EXISTS iga_learning;
CREATE DATABASE iga_learning CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE iga_learning;

CREATE TABLE roles(id BIGINT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(30) UNIQUE NOT NULL);
CREATE TABLE users(id BIGINT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(120) NOT NULL, first_name VARCHAR(120), last_name VARCHAR(120), profile_image TEXT, phone VARCHAR(40), bio TEXT, email VARCHAR(180) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, role VARCHAR(30) NOT NULL DEFAULT 'STUDENT', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE categories(id BIGINT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(120) NOT NULL, description TEXT);
CREATE TABLE courses(id BIGINT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(180) NOT NULL, description TEXT, objectives TEXT, prerequisites TEXT, category_id BIGINT, teacher_id BIGINT, level VARCHAR(80), duration VARCHAR(80), image TEXT, rating DECIMAL(3,1) DEFAULT 0, students_count INT DEFAULT 0, CONSTRAINT fk_courses_category FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL, CONSTRAINT fk_courses_teacher FOREIGN KEY(teacher_id) REFERENCES users(id) ON DELETE SET NULL);
CREATE TABLE lessons(id BIGINT PRIMARY KEY AUTO_INCREMENT, course_id BIGINT NOT NULL, title VARCHAR(180) NOT NULL, content TEXT, video_url TEXT, ordre INT DEFAULT 1, CONSTRAINT fk_lessons_course FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE);
CREATE TABLE quizzes(id BIGINT PRIMARY KEY AUTO_INCREMENT, course_id BIGINT NOT NULL, title VARCHAR(180), passing_score INT DEFAULT 70, CONSTRAINT fk_quizzes_course FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE);
CREATE TABLE questions(id BIGINT PRIMARY KEY AUTO_INCREMENT, quiz_id BIGINT NOT NULL, question TEXT NOT NULL, CONSTRAINT fk_questions_quiz FOREIGN KEY(quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE);
CREATE TABLE answers(id BIGINT PRIMARY KEY AUTO_INCREMENT, question_id BIGINT NOT NULL, answer_text VARCHAR(255), is_correct BOOLEAN DEFAULT FALSE, CONSTRAINT fk_answers_question FOREIGN KEY(question_id) REFERENCES questions(id) ON DELETE CASCADE);
CREATE TABLE enrollments(id BIGINT PRIMARY KEY AUTO_INCREMENT, user_id BIGINT, course_id BIGINT, enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, status VARCHAR(30) DEFAULT 'ACTIVE', UNIQUE KEY uq_enrollment(user_id, course_id), CONSTRAINT fk_enrollments_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE, CONSTRAINT fk_enrollments_course FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE);
CREATE TABLE progress(id BIGINT PRIMARY KEY AUTO_INCREMENT, user_id BIGINT, course_id BIGINT, lesson_id BIGINT, completed BOOLEAN DEFAULT FALSE, completed_at TIMESTAMP NULL, UNIQUE KEY uq_progress(user_id, lesson_id), CONSTRAINT fk_progress_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE, CONSTRAINT fk_progress_course FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE, CONSTRAINT fk_progress_lesson FOREIGN KEY(lesson_id) REFERENCES lessons(id) ON DELETE CASCADE);
CREATE TABLE certificates(id BIGINT PRIMARY KEY AUTO_INCREMENT, user_id BIGINT, course_id BIGINT, student_name VARCHAR(180), course_name VARCHAR(180), issue_date DATE, score INT, verification_code VARCHAR(80) UNIQUE, qr_code TEXT, CONSTRAINT fk_certificates_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE, CONSTRAINT fk_certificates_course FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE);
CREATE TABLE quiz_results(id BIGINT PRIMARY KEY AUTO_INCREMENT, user_id BIGINT, quiz_id BIGINT, score INT, passed BOOLEAN, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, CONSTRAINT fk_quiz_results_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE, CONSTRAINT fk_quiz_results_quiz FOREIGN KEY(quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE);
CREATE TABLE grades(id BIGINT PRIMARY KEY AUTO_INCREMENT, student_id BIGINT, course_id BIGINT, teacher_id BIGINT, grade DECIMAL(5,2), comments TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, CONSTRAINT fk_grades_student FOREIGN KEY(student_id) REFERENCES users(id) ON DELETE CASCADE, CONSTRAINT fk_grades_course FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE, CONSTRAINT fk_grades_teacher FOREIGN KEY(teacher_id) REFERENCES users(id) ON DELETE CASCADE);
CREATE TABLE blog_posts(id BIGINT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(180), summary TEXT, content TEXT, image TEXT, created_at DATE);
CREATE TABLE contact_messages(id BIGINT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(120), email VARCHAR(180), subject VARCHAR(180), message TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

-- Insert roles
INSERT INTO roles(name) VALUES ('ADMIN'),('TEACHER'),('STUDENT');

-- Insert users with proper IDs for teacher assignments
INSERT INTO users(id,name,email,password,role) VALUES 
(1,'Admin IGA','admin@iga-learning.com','admin123','ADMIN'),
(2,'Prof React','prof@iga-learning.com','prof123','TEACHER'),
(3,'Prof Java','prof2@iga-learning.com','prof123','TEACHER'),
(4,'Prof Design','prof3@iga-learning.com','prof123','TEACHER'),
(5,'Etudiant Demo','etudiant@iga-learning.com','etudiant123','STUDENT'),
(6,'Alice Dupont','alice@iga-learning.com','etudiant123','STUDENT'),
(7,'Bob Martin','bob@iga-learning.com','etudiant123','STUDENT'),
(8,'Charlie Dubois','charlie@iga-learning.com','etudiant123','STUDENT'),
(9,'David Leroy','david@iga-learning.com','etudiant123','STUDENT'),
(10,'Emma Moreau','emma@iga-learning.com','etudiant123','STUDENT'),
(11,'Florian Simon','florian@iga-learning.com','etudiant123','STUDENT'),
(12,'Grace Laurent','grace@iga-learning.com','etudiant123','STUDENT');

-- Insert categories
INSERT INTO categories(id,name,description) VALUES 
(1,'Programmation Web','Cours pour Programmation Web'),
(2,'Java','Cours pour Java'),
(3,'Python','Cours pour Python'),
(4,'Base de donnees','Cours pour Base de donnees'),
(5,'Reseaux informatiques','Cours pour Reseaux informatiques'),
(6,'Cybersecurite','Cours pour Cybersecurite'),
(7,'Bureautique','Cours pour Bureautique'),
(8,'Intelligence Artificielle','Cours pour Intelligence Artificielle'),
(9,'Developpement Mobile','Cours pour Developpement Mobile'),
(10,'Design UI UX','Cours pour Design UI UX');

-- Insert courses with correct column order
INSERT INTO courses(id,title,description,objectives,prerequisites,category_id,teacher_id,level,duration,image,rating,students_count) VALUES 
(1,'HTML CSS de zero','Cours complet et pratique pour maitriser HTML CSS de zero.','Comprendre; pratiquer; projet; QCM; certificat','Ordinateur; bases; motivation',1,2,'Debutant','3h7min','https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900',4.2,233),
(2,'JavaScript pour debutants','Cours complet et pratique pour maitriser JavaScript pour debutants.','Comprendre; pratiquer; projet; QCM; certificat','Ordinateur; bases; motivation',2,3,'Debutant','4h14min','https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900',4.3,316),
(3,'React avec Vite','Cours complet et pratique pour maitriser React avec Vite.','Comprendre; pratiquer; projet; QCM; certificat','Ordinateur; bases; motivation',3,2,'Debutant','5h21min','https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900',4.4,399),
(4,'Java POO complet','Cours complet et pratique pour maitriser Java POO complet.','Comprendre; pratiquer; projet; QCM; certificat','Ordinateur; bases; motivation',2,3,'Debutant','6h28min','https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900',4.5,482),
(5,'React Native','Cours complet et pratique pour maitriser React Native.','Comprendre; pratiquer; projet; QCM; certificat','Ordinateur; bases; motivation',9,2,'Intermediaire','7h35min','https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900',4.6,565),
(6,'Python de A a Z','Cours complet et pratique pour maitriser Python de A a Z.','Comprendre; pratiquer; projet; QCM; certificat','Ordinateur; bases; motivation',3,4,'Debutant','8h42min','https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900',4.7,648),
(7,'MySQL complet','Cours complet et pratique pour maitriser MySQL complet.','Comprendre; pratiquer; projet; QCM; certificat','Ordinateur; bases; motivation',4,3,'Debutant','9h49min','https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900',4.8,731),
(8,'MongoDB introduction','Cours complet et pratique pour maitriser MongoDB introduction.','Comprendre; pratiquer; projet; QCM; certificat','Ordinateur; bases; motivation',4,4,'Debutant','10h56min','https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900',4.9,814),
(9,'Reseaux informatiques','Cours complet et pratique pour maitriser Reseaux informatiques.','Comprendre; pratiquer; projet; QCM; certificat','Ordinateur; bases; motivation',5,2,'Debutant','2h3min','https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900',4.1,897),
(10,'Cybersecurite basics','Cours complet et pratique pour maitriser Cybersecurite basics.','Comprendre; pratiquer; projet; QCM; certificat','Ordinateur; bases; motivation',6,4,'Intermediaire','3h12min','https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900',4.3,980);

-- Insert quizzes
INSERT INTO quizzes(id,course_id,title,passing_score) VALUES 
(1,1,'QCM final HTML CSS de zero',70),
(2,2,'QCM final JavaScript pour debutants',70),
(3,3,'QCM final React avec Vite',70),
(4,4,'QCM final Java POO complet',70),
(5,5,'QCM final React Native',70),
(6,6,'QCM final Python de A a Z',70),
(7,7,'QCM final MySQL complet',70),
(8,8,'QCM final MongoDB introduction',70),
(9,9,'QCM final Reseaux informatiques',70),
(10,10,'QCM final Cybersecurite basics',70);

-- Insert lessons for each course
INSERT INTO lessons(course_id,title,content,video_url,ordre) VALUES 
(1,'Lecon 1 - HTML CSS de zero','Contenu detaille et exercices pratiques.','https://www.youtube.com/embed/dQw4w9WgXcQ',1),
(1,'Lecon 2 - HTML CSS de zero','Contenu detaille et exercices pratiques.','https://www.youtube.com/embed/dQw4w9WgXcQ',2),
(1,'Lecon 3 - HTML CSS de zero','Contenu detaille et exercices pratiques.','https://www.youtube.com/embed/dQw4w9WgXcQ',3),
(1,'Lecon 4 - HTML CSS de zero','Contenu detaille et exercices pratiques.','https://www.youtube.com/embed/dQw4w9WgXcQ',4),
(1,'Lecon 5 - HTML CSS de zero','Contenu detaille et exercices pratiques.','https://www.youtube.com/embed/dQw4w9WgXcQ',5),

(2,'Lecon 1 - JavaScript pour debutants','Contenu detaille et exercices pratiques.','https://www.youtube.com/embed/dQw4w9WgXcQ',1),
(2,'Lecon 2 - JavaScript pour debutants','Contenu detaille et exercices pratiques.','https://www.youtube.com/embed/dQw4w9WgXcQ',2),
(2,'Lecon 3 - JavaScript pour debutants','Contenu detaille et exercices pratiques.','https://www.youtube.com/embed/dQw4w9WgXcQ',3),
(2,'Lecon 4 - JavaScript pour debutants','Contenu detaille et exercices pratiques.','https://www.youtube.com/embed/dQw4w9WgXcQ',4),
(2,'Lecon 5 - JavaScript pour debutants','Contenu detaille et exercices pratiques.','https://www.youtube.com/embed/dQw4w9WgXcQ',5),

(3,'Lecon 1 - React avec Vite','Contenu detaille et exercices pratiques.','https://www.youtube.com/embed/dQw4w9WgXcQ',1),
(3,'Lecon 2 - React avec Vite','Contenu detaille et exercices pratiques.','https://www.youtube.com/embed/dQw4w9WgXcQ',2),
(3,'Lecon 3 - React avec Vite','Contenu detaille et exercices pratiques.','https://www.youtube.com/embed/dQw4w9WgXcQ',3),
(3,'Lecon 4 - React avec Vite','Contenu detaille et exercices pratiques.','https://www.youtube.com/embed/dQw4w9WgXcQ',4),
(3,'Lecon 5 - React avec Vite','Contenu detaille et exercices pratiques.','https://www.youtube.com/embed/dQw4w9WgXcQ',5);

-- Insert questions and answers for first 3 courses as examples
INSERT INTO questions(id,quiz_id,question) VALUES 
(1,1,'Question 1 sur HTML CSS de zero ?'),
(2,1,'Question 2 sur HTML CSS de zero ?'),
(3,1,'Question 3 sur HTML CSS de zero ?'),
(4,1,'Question 4 sur HTML CSS de zero ?'),
(5,1,'Question 5 sur HTML CSS de zero ?'),
(6,2,'Question 1 sur JavaScript pour debutants ?'),
(7,2,'Question 2 sur JavaScript pour debutants ?'),
(8,2,'Question 3 sur JavaScript pour debutants ?'),
(9,2,'Question 4 sur JavaScript pour debutants ?'),
(10,2,'Question 5 sur JavaScript pour debutants ?'),
(11,3,'Question 1 sur React avec Vite ?'),
(12,3,'Question 2 sur React avec Vite ?'),
(13,3,'Question 3 sur React avec Vite ?'),
(14,3,'Question 4 sur React avec Vite ?'),
(15,3,'Question 5 sur React avec Vite ?');

INSERT INTO answers(id,question_id,answer_text,is_correct) VALUES 
(1,1,'Reponse 1',FALSE),
(2,1,'Reponse 2',TRUE),
(3,1,'Reponse 3',FALSE),
(4,1,'Reponse 4',FALSE),
(5,2,'Reponse 1',FALSE),
(6,2,'Reponse 2',FALSE),
(7,2,'Reponse 3',TRUE),
(8,2,'Reponse 4',FALSE),
(9,3,'Reponse 1',FALSE),
(10,3,'Reponse 2',FALSE),
(11,3,'Reponse 3',FALSE),
(12,3,'Reponse 4',TRUE),
(13,4,'Reponse 1',TRUE),
(14,4,'Reponse 2',FALSE),
(15,4,'Reponse 3',FALSE),
(16,4,'Reponse 4',FALSE),
(17,5,'Reponse 1',FALSE),
(18,5,'Reponse 2',TRUE),
(19,5,'Reponse 3',FALSE),
(20,5,'Reponse 4',FALSE),
(21,6,'Reponse 1',FALSE),
(22,6,'Reponse 2',TRUE),
(23,6,'Reponse 3',FALSE),
(24,6,'Reponse 4',FALSE),
(25,7,'Reponse 1',FALSE),
(26,7,'Reponse 2',FALSE),
(27,7,'Reponse 3',TRUE),
(28,7,'Reponse 4',FALSE),
(29,8,'Reponse 1',FALSE),
(30,8,'Reponse 2',FALSE),
(31,8,'Reponse 3',FALSE),
(32,8,'Reponse 4',TRUE),
(33,9,'Reponse 1',TRUE),
(34,9,'Reponse 2',FALSE),
(35,9,'Reponse 3',FALSE),
(36,9,'Reponse 4',FALSE),
(37,10,'Reponse 1',FALSE),
(38,10,'Reponse 2',TRUE),
(39,10,'Reponse 3',FALSE),
(40,10,'Reponse 4',FALSE),
(41,11,'Reponse 1',FALSE),
(42,11,'Reponse 2',TRUE),
(43,11,'Reponse 3',FALSE),
(44,11,'Reponse 4',FALSE),
(45,12,'Reponse 1',FALSE),
(46,12,'Reponse 2',FALSE),
(47,12,'Reponse 3',TRUE),
(48,12,'Reponse 4',FALSE),
(49,13,'Reponse 1',FALSE),
(50,13,'Reponse 2',FALSE),
(51,13,'Reponse 3',FALSE),
(52,13,'Reponse 4',TRUE),
(53,14,'Reponse 1',TRUE),
(54,14,'Reponse 2',FALSE),
(55,14,'Reponse 3',FALSE),
(56,14,'Reponse 4',FALSE),
(57,15,'Reponse 1',FALSE),
(58,15,'Reponse 2',TRUE),
(59,15,'Reponse 3',FALSE),
(60,15,'Reponse 4',FALSE);

-- Sample blog posts
INSERT INTO blog_posts(id,title,summary,content,image,created_at) VALUES 
(1,'Les meilleures pratiques React en 2024','Découvrez les dernières tendances et meilleures pratiques pour développer avec React.','Contenu complet de l''article sur les meilleures pratiques React...','https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=900','2024-01-15'),
(2,'Introduction à TypeScript','Apprenez les bases de TypeScript et comment l''utiliser dans vos projets JavaScript.','Contenu complet de l''article sur TypeScript...','https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=900','2024-01-20');

-- Sample contact messages
INSERT INTO contact_messages(id,name,email,subject,message,created_at) VALUES 
(1,'Jean Dupont','jean@example.com','Question sur les cours','Bonjour, je voudrais plus d''informations sur les cours React.','2024-01-25 10:30:00'),
(2,'Marie Martin','marie@example.com','Problème technique','Je n''arrive pas à accéder à mon tableau de bord.','2024-01-26 14:15:00');

-- Demo Enrollments
INSERT INTO enrollments(user_id, course_id, status) VALUES (5, 1, 'ACTIVE'), (5, 2, 'ACTIVE'), (6, 1, 'ACTIVE');

-- Demo Progress
INSERT INTO progress(user_id, course_id, lesson_id, completed) VALUES (5, 1, 1, TRUE), (5, 1, 2, TRUE), (5, 1, 3, FALSE);

-- Demo Quiz Results
INSERT INTO quiz_results(user_id, quiz_id, score, passed) VALUES (5, 1, 85, TRUE), (6, 1, 90, TRUE);

-- Demo Certificates
INSERT INTO certificates(user_id, course_id, student_name, course_name, issue_date, score, verification_code) VALUES 
(5, 1, 'Etudiant Demo', 'HTML CSS de zero', '2024-05-10', 85, 'IGA-5-1-2024'),
(6, 1, 'Alice Dupont', 'HTML CSS de zero', '2024-05-12', 90, 'IGA-6-1-2024');

-- Demo Grades
INSERT INTO grades(student_id, course_id, teacher_id, grade, comments) VALUES 
(5, 1, 2, 17.5, 'Excellent travail'),
(6, 1, 2, 18, 'Parfait');

-- Modern IGA Learning extensions: progress, favorites, reviews, notifications
CREATE TABLE IF NOT EXISTS course_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  lesson_id INT NOT NULL DEFAULT 0,
  last_position INT NOT NULL DEFAULT 0,
  watched_seconds INT NOT NULL DEFAULT 0,
  completed TINYINT(1) NOT NULL DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_progress_user_course_lesson (user_id, course_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_favorite_user_course (user_id, course_id)
);

CREATE TABLE IF NOT EXISTS course_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL DEFAULT 5,
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
