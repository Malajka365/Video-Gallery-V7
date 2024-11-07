import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';
import { LogOut, FolderPlus, Settings, Library, Home } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">My Gallery</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/dashboard/galleries"
            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="p-8">
              <Library className="w-12 h-12 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">My Galleries</h3>
              <p className="mt-2 text-gray-600">View and manage your video galleries</p>
            </div>
          </Link>

          <Link
            to="/dashboard/create"
            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="p-8">
              <FolderPlus className="w-12 h-12 text-green-500 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Create Gallery</h3>
              <p className="mt-2 text-gray-600">Create a new video gallery</p>
            </div>
          </Link>

          <Link
            to="/dashboard/settings"
            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="p-8">
              <Settings className="w-12 h-12 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Settings</h3>
              <p className="mt-2 text-gray-600">Manage your account settings</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;