import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Play, Plus, Tag } from 'lucide-react';
import { getGalleries, deleteGallery } from '../../lib/gallery-service';
import { useAuth } from '../../lib/auth-context';
import type { Gallery } from '../../lib/supabase-types';
import Header from '../common/Header';

const GalleriesPage: React.FC = () => {
  const { user } = useAuth();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Galériák betöltése
  const loadGalleries = async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');
    try {
      const data = await getGalleries(user.id, true); // Set onlyUserGalleries to true
      setGalleries(data);
    } catch (err) {
      console.error('Error loading galleries:', err);
      setError('Failed to load galleries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGalleries();
  }, [user]);

  const handleDelete = async (galleryId: string) => {
    if (!confirm('Are you sure you want to delete this gallery?')) return;

    try {
      await deleteGallery(galleryId);
      setGalleries(galleries.filter(g => g.id !== galleryId));
      
      // Dispatch custom event for gallery deletion
      const event = new CustomEvent('galleryDeleted', {
        detail: { galleryId }
      });
      window.dispatchEvent(event);
    } catch (err) {
      console.error('Error deleting gallery:', err);
      setError('Failed to delete gallery');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header showHome={true} />
        <div className="flex h-[calc(100vh-64px)] items-center justify-center">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 animate-spin text-gray-600"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="mt-4 text-lg text-gray-600">Loading galleries...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header showHome={true} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          to="/dashboard"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Vissza a Dashboard-ra
        </Link>

        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Galleries</h1>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {galleries.length === 0 ? (
          <div className="rounded-lg bg-white shadow-md p-8 text-center">
            <p className="text-lg text-gray-600">
              You haven't created any galleries yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleries.map((gallery) => (
              <div
                key={gallery.id}
                className="overflow-hidden rounded-lg bg-white shadow-md"
              >
                <div className="p-6">
                  <h2 className="mb-2 text-xl font-semibold">{gallery.name}</h2>
                  <p className="mb-4 text-gray-600">{gallery.description}</p>
                  <div className="mb-4 flex items-center text-sm text-gray-500">
                    <Tag className="mr-2 h-4 w-4" />
                    {gallery.visibility}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Link
                      to={`/dashboard/galleries/${gallery.id}/manage`}
                      className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                    >
                      <Play className="h-5 w-5" />
                    </Link>
                    <Link
                      to={`/dashboard/galleries/${gallery.id}/edit`}
                      className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(gallery.id)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleriesPage;
