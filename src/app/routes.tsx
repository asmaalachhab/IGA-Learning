import { createBrowserRouter } from 'react-router';
import { RootLayout } from './components/layouts/RootLayout';
import { Home } from './pages/Home';
import { ExploreCourses } from './pages/ExploreCourses';
import { CourseList } from './pages/CourseList';
import { CourseDetail } from './pages/CourseDetail';
import { CourseLearning } from './pages/CourseLearning';
import { Certificate } from './pages/Certificate';
import { VerifyCertificate } from './pages/VerifyCertificate';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import Profile from '@/app/pages/Profile';
import { NotFound } from './pages/NotFound';

import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { TeacherDashboard } from './pages/dashboards/TeacherDashboard';
import { StudentDashboard } from './pages/dashboards/StudentDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { CourseManagement } from './pages/admin/CourseManagement';
import { QuizManagement } from './pages/admin/QuizManagement';
import { QuizResult } from './pages/student/QuizResult';
import { Quiz } from './pages/student/Quiz';
import { AuthGuard } from './components/AuthGuard';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: 'explorer', Component: ExploreCourses },
      { path: 'cours', Component: CourseList },
      { path: 'cours/:id', Component: CourseDetail },
      { path: 'cours/:id/learn', element: <AuthGuard><CourseLearning /></AuthGuard> },
      { path: 'blog', Component: Blog },
      { path: 'blog/:id', Component: BlogPost },
      { path: 'a-propos', Component: About },
      { path: 'contact', Component: Contact },
      { path: 'connexion', Component: Login },
      { path: 'inscription', Component: Register },
      { path: '*', Component: NotFound },
      
      // Protected Routes for STUDENT (or any logged in user for profile/cert)
      { path: 'profil', element: <AuthGuard><Profile /></AuthGuard> },
      { path: 'certificat', element: <AuthGuard><Certificate /></AuthGuard> },
      { path: 'certificat/verifier', element: <AuthGuard><VerifyCertificate /></AuthGuard> },
      { path: 'cours/:id/quiz', element: <AuthGuard><Quiz /></AuthGuard> },
      { path: 'quiz-result', element: <AuthGuard><QuizResult /></AuthGuard> },
      { path: 'student', element: <AuthGuard allowedRoles={['STUDENT']}><StudentDashboard /></AuthGuard> },

      // Protected Routes for TEACHER
      { path: 'teacher', element: <AuthGuard allowedRoles={['TEACHER', 'ADMIN']}><TeacherDashboard /></AuthGuard> },

      // Protected Routes for ADMIN
      { path: 'admin', element: <AuthGuard allowedRoles={['ADMIN']}><AdminDashboard /></AuthGuard> },
      { path: 'admin/users', element: <AuthGuard allowedRoles={['ADMIN']}><UserManagement /></AuthGuard> },
      { path: 'admin/courses', element: <AuthGuard allowedRoles={['ADMIN', 'TEACHER']}><CourseManagement /></AuthGuard> },
      { path: 'admin/quizzes', element: <AuthGuard allowedRoles={['ADMIN', 'TEACHER']}><QuizManagement /></AuthGuard> },
    ]
  }
]);
