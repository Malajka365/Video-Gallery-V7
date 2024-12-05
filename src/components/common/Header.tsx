import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Home, Settings, LogOut, UserPlus, LogIn, Video as VideoIcon, Upload, Tags, LayoutDashboard, Film } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';

interface HeaderProps {
  showManageButtons?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showManageButtons = false }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { id } = useParams<{ id: string }>();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <VideoIcon className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-2xl font-bold text-gray-900">Video Gallery</h1>
          </div>
          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <button
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </button>
              </>
            ) : (
              <>
                {/* Alap navigációs gombok bejelentkezett felhasználóknak */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Home className="w-4 h-4 mr-1" />
                    Home
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-1" />
                    Dashboard
                  </button>
                </div>

                {/* Galéria kezelő gombok */}
                {showManageButtons && id && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/dashboard/galleries/${id}/upload`)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Upload
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/galleries/${id}/manage`)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Film className="w-4 h-4 mr-1" />
                      Manage Videos
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/galleries/${id}/tags`)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Tags className="w-4 h-4 mr-1" />
                      Manage Tags
                    </button>
                  </div>
                )}

                {/* Felhasználói műveletek */}
                <div className="flex items-center gap-3 ml-3 pl-3 border-l border-gray-200">
                  <span className="text-gray-700">{user.email}</span>
                  <button
                    onClick={() => navigate('/dashboard/settings')}
                    className="inline-flex items-center p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
