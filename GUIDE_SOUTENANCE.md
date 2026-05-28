# 🎓 Guide de Soutenance - IGA Learning

Ce guide a été conçu pour vous accompagner pas à pas le jour de votre soutenance. Gardez ce document sous les yeux pour un déroulement fluide et sans stress.

---

## 1. Ordre exact pour lancer le projet

Le jour J, vous devez impérativement lancer les éléments dans cet ordre :
1. **Base de données** (WAMP/XAMPP - MySQL)
2. **Backend** (Tomcat / Java EE)
3. **Frontend** (Node.js / React)

---

## 2. Commandes à exécuter

### Étape 1 : Base de données
Assurez-vous que WAMP/XAMPP est démarré. Vérifiez que la base `iga_learning` est bien importée.
*(Optionnel, si besoin de réimporter)*
```bash
mysql -u root -p < "database\iga_learning.sql"
```

### Étape 2 : Lancement du Backend (Java EE / Tomcat)
Ouvrez un terminal dans le dossier contenant votre `pom.xml` (Backend).
```bash
mvn clean package
mvn tomcat7:run
```
> [!IMPORTANT]
> Ne fermez pas ce terminal. Le serveur tourne sur le port **8080**.

### Étape 3 : Lancement du Frontend (React / Vite)
Ouvrez un **nouveau** terminal dans le dossier de votre projet React (`c:\Users\skylh\Downloads\iga figma 3`).
```bash
npm install
npm run dev
```
> [!IMPORTANT]
> Ne fermez pas ce terminal. L'interface s'ouvrira sur **http://localhost:5173**.

---

## 3. Comptes de Test

| Rôle | Email | Mot de passe |
| :--- | :--- | :--- |
| **Admin** | admin@iga-learning.com | `admin123` |
| **Professeur** | prof@iga-learning.com | `prof123` |
| **Étudiant** | etudiant@iga-learning.com | `etudiant123` |

---

## 4. Scénario de Démonstration (Étape par Étape)

### A. L'Administrateur (La vue globale)
1. Allez sur **http://localhost:5173** et cliquez sur "Connexion".
2. Connectez-vous avec `admin@iga-learning.com`.
3. Montrez le **Dashboard Admin** :
   - Expliquez que vous récupérez les vrais chiffres de la base (ex: 24 cours, 12 étudiants).
   - Montrez la liste des derniers inscrits.
4. Allez dans l'onglet **Cours** :
   - Montrez que l'admin peut voir tous les cours existants.
5. Allez dans l'onglet **Quiz** :
   - Montrez les quiz affectés aux cours.
6. Déconnectez-vous.

### B. Le Professeur (La création)
1. Connectez-vous avec `prof@iga-learning.com`.
2. Montrez le **Dashboard Professeur** :
   - Expliquez que le professeur ne voit que **ses propres cours** et **ses propres quiz**.
   - Montrez les statistiques (étudiants inscrits à ses cours).
3. Déconnectez-vous.

### C. L'Étudiant (L'apprentissage)
1. Connectez-vous avec `etudiant@iga-learning.com`.
2. Montrez le **Dashboard Étudiant** :
   - Montrez ses "Cours en cours", ses "Quiz disponibles" et surtout ses "Certificats".
3. Simulez l'accès à un cours :
   - Cliquez sur "Continuer" sur un cours.
   - Montrez la page de détail du cours avec les leçons vidéo.
4. L'évaluation et la réussite :
   - Cliquez sur l'onglet "Quiz" et montrez que l'étudiant peut répondre à un QCM.
   - Une fois le quiz validé, allez dans le Dashboard et cliquez sur **"Voir certificat"**.
   - Montrez le certificat généré dynamiquement.
5. Déconnectez-vous.

---

## 5. Erreurs Possibles et Solutions Rapides

> [!WARNING]
> Si une erreur survient pendant la présentation, pas de panique, voici comment réagir vite.

*   **Le frontend affiche "Erreur réseau" ou ne charge aucune donnée :**
    *   *Raison* : Le backend Java ne tourne pas ou un problème de CORS bloque.
    *   *Solution* : Vérifiez le terminal Tomcat (`mvn tomcat7:run`). S'il est planté, faites `Ctrl+C` et relancez-le.
*   **Connexion refusée à la base de données :**
    *   *Raison* : WAMP/XAMPP n'est pas allumé.
    *   *Solution* : Lancez WAMP/XAMPP et vérifiez que le service MySQL est vert.
*   **"Port 8080 already in use" :**
    *   *Raison* : Tomcat tourne déjà en arrière-plan.
    *   *Solution* : Arrêtez les processus Java, ou fermez les terminaux précédents.
*   **Déconnexion inattendue :**
    *   *Raison* : Cache ou localStorage corrompu.
    *   *Solution* : Appuyez sur `F12` (Outils de dev) > `Application` > `Local Storage` > Clic droit "Clear". Actualisez la page.

---

## 6. Discours Oral (3 à 5 minutes)

*(Lisez ce texte avec assurance, en regardant le jury. Vous pouvez adapter les mots à votre style).*

**[Introduction]**
"Bonjour à toutes et à tous, et merci de m'accueillir aujourd'hui. Je vais vous présenter mon projet de fin de cursus : **IGA Learning**.
IGA Learning est une plateforme d'e-learning moderne et complète que j'ai développée de A à Z. Mon objectif principal était de créer un système complet gérant trois types d'utilisateurs distincts : des administrateurs, des professeurs et des étudiants, avec un véritable suivi pédagogique allant du visionnage des cours jusqu'à l'obtention d'un certificat."

**[Architecture et Choix techniques]**
"Côté technique, j'ai opté pour une architecture distribuée, ce qu'on appelle un environnement Full-Stack.
Pour le **Backend**, j'ai utilisé **Java EE** avec des Servlets et l'API JDBC pour communiquer avec une base de données **MySQL**. J'ai développé cela sous forme d'API REST sécurisée déployée sur un serveur Apache Tomcat.
Pour le **Frontend**, j'ai voulu offrir une expérience utilisateur très fluide. J'ai donc choisi **React.js** avec **Vite** pour la rapidité, et **Tailwind CSS** pour concevoir une interface que vous verrez moderne, réactive et agréable à utiliser."

**[Présentation des Fonctionnalités]** *(Démarrez la démo en même temps)*
"Comme vous pouvez le voir sur l'interface, le système gère l'authentification avec un maintien de session sécurisé. 
Si je me connecte en tant qu'**Administrateur**, j'ai une vue globale sur l'ensemble de la plateforme : le nombre d'étudiants, l'intégralité des cours et la gestion des utilisateurs.
Si je passe sur le profil d'un **Professeur**, l'interface change. Le système filtre les données pour que le professeur ne puisse gérer que ses propres cours, consulter les statistiques de ses propres quiz, et voir les étudiants inscrits à ses formations.
Enfin, la partie la plus importante, l'espace **Étudiant**. L'étudiant dispose d'un tableau de bord personnalisé. Il peut suivre sa progression dans les leçons vidéo. À la fin d'un cours, il est évalué par un Quiz dynamique calculant son score. S'il réussit, le système génère instantanément un certificat numérique de complétion, garantissant qu'il a acquis les compétences."

**[Conclusion]**
"Ce projet m'a permis de relever plusieurs défis techniques majeurs, notamment la communication asynchrone entre React et Java via les règles CORS, ou encore la sécurisation et persistance des sessions utilisateurs avec des données dynamiques.
IGA Learning est aujourd'hui une plateforme stable et évolutive, prête à être déployée.
Je vous remercie pour votre attention et je suis maintenant à votre disposition pour vos questions."
