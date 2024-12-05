import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useLocation, Link } from 'react-router-dom';
import { VideoData } from '../lib/supabase-types';
import { Search, Edit, Trash2, ArrowLeft } from 'lucide-react';
import EditVideoModal from './EditVideoModal';
import { getVideos, deleteVideo } from '../lib/video-service';
import Header from './common/Header';

const VIDEOS_PER_PAGE_OPTIONS = [20, 50, 100];

const ManageVideosPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [editingVideo, setEditingVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videosPerPage, setVideosPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!id) return;
    loadVideos();
  }, [id]);

  const loadVideos = async () => {
    try {
      const data = await getVideos(id!);
      setVideos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (video: VideoData) => {
    setEditingVideo(video);
  };

  const handleDelete = async (videoId: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await deleteVideo(videoId);
        setVideos(videos.filter((v) => v.id !== videoId));
        
        // Dispatch custom event for video deletion
        const event = new CustomEvent('videoDeleted', {
          detail: { videoId }
        });
        window.dispatchEvent(event);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete video');
      }
    }
  };

  const handleSave = async (updatedVideo: VideoData) => {
    try {
      const updatedVideos = videos.map((v) => 
        v.id === updatedVideo.id ? updatedVideo : v
      );
      setVideos(updatedVideos);
      setEditingVideo(null);

      // Dispatch custom event for video update
      const event = new CustomEvent('videoUpdated', {
        detail: { video: updatedVideo }
      });
      window.dispatchEvent(event);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update video');
    }
  };

  const handleVideosPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVideosPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Filter videos based on search term
  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const endIndex = startIndex + videosPerPage;
  const currentVideos = filteredVideos.slice(startIndex, endIndex);

  // Create back link URL with preserved filters
  const backToGalleryUrl = `/dashboard/galleries${location.search}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showHome={true} showManageButtons={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to={`/gallery/${id}`}
            className="inline-flex items-center text-blue-500 hover:text-blue-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gallery
          </Link>
          <h1 className="text-3xl font-bold mt-2">Manage Videos</h1>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search videos by title..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Videos per page:</span>
            <select
              value={videosPerPage}
              onChange={handleVideosPerPageChange}
              className="border border-gray-300 rounded-md px-2 py-1"
            >
              {VIDEOS_PER_PAGE_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredVideos.length)} of {filteredVideos.length} videos
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-280px)] rounded-lg shadow">
          <div className="space-y-1">
            {currentVideos.map((video) => (
              <div key={video.id} className="bg-white p-4 hover:bg-gray-50 transition-colors flex justify-between items-center border-b border-gray-100">
                <div className="flex-grow">
                  <h3 className="font-semibold">{video.title}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{video.description}</p>
                  <div className="mt-2">
                    {video.tags && Object.entries(video.tags).map(([group, tags]) => (
                      <p key={group} className="text-sm text-gray-500">
                        <span className="font-medium">{group}:</span> {Array.isArray(tags) ? tags.join(', ') : ''}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(video)}
                    className="text-blue-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredVideos.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            {searchTerm ? 'No videos found matching your search.' : 'No videos found. Add some videos to get started!'}
          </p>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
      {editingVideo && (
        <EditVideoModal video={editingVideo} onSave={handleSave} onClose={() => setEditingVideo(null)} />
      )}
    </div>
  );
};

export default ManageVideosPage;