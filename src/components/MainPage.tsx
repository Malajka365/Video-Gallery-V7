import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { Gallery, Video } from '../lib/supabase-types';
import Header from './common/Header';

interface MainPageProps {
  galleries: Gallery[];
  videos: Video[];
}

const MainPage: React.FC<MainPageProps> = ({ galleries, videos }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Számoljuk ki a statisztikákat
  const stats = useMemo(() => {
    return {
      totalVideos: videos.length,
      totalGalleries: galleries.length,
      publicGalleries: galleries.filter(g => g.visibility === 'public').length,
      recentVideos: videos
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
    };
  }, [galleries, videos]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header showHome={false} />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Welcome to Video Gallery
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Discover and share amazing video collections
          </p>
        </div>

        {/* Galleries Grid */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Browse Galleries</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {user && (
              <button
                onClick={() => navigate('/dashboard/galleries/create')}
                className="group flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
              >
                <Folder className="w-16 h-16 text-white mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-semibold text-white">Create New Gallery</h3>
                <p className="mt-2 text-sm text-blue-100">
                  Start your own video collection
                </p>
              </button>
            )}
            
            {galleries.map((gallery) => (
              <button
                key={gallery.id}
                onClick={() => navigate(`/gallery/${gallery.id}`)}
                className="group flex flex-col text-left p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <Folder className="w-10 h-10 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                  <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                    {gallery.visibility}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {gallery.name}
                </h4>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {gallery.description}
                </p>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Folder className="w-4 h-4 mr-1" />
                  {videos.filter(v => v.gallery_id === gallery.id).length} videos
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Videos */}
        {stats.recentVideos.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Videos</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stats.recentVideos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => navigate(`/video/${video.id}`)}
                  className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={`https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`}
                      alt={video.title}
                      className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {video.title}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {video.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;