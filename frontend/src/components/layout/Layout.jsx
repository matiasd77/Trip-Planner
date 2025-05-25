import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          © 2025 Interactive Trip Planner. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Layout;
