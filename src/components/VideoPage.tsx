import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Video } from '../lib/supabase-types';

interface VideoPageProps {
  videos: Video[];
}

const VideoPage: React.FC<VideoPageProps> = ({ videos }) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  // Find the video from the videos prop
  const video = videos.find(v => v.id === id);

  // Get the search params from the state passed through navigation
  const searchParams = location.state?.searchParams || '';

  // Create back link URL with preserved filters
  const backToGalleryUrl = `/gallery/${video?.gallery_id}${searchParams}`;

  if (!video) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: Video not found</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          to={backToGalleryUrl} 
          className="flex items-center text-blue-500 hover:text-blue-600 mb-4"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Gallery
        </Link>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${video.youtube_id}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
          </div>
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
            <p className="text-gray-700 mb-6 whitespace-pre-wrap">{video.description}</p>
            <div className="flex flex-wrap gap-4">
              {video.tags && Object.entries(video.tags).map(([group, tags]) => (
                <div key={group} className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">{group}</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(tags) && tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;