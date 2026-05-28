import { Outlet } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { Chatbot } from '../Chatbot';

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Chatbot />
      <Footer />
    </div>
  );
}
