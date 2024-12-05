import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import VideoUploadForm from './VideoUploadForm';
import { ArrowLeft } from 'lucide-react';
import { addVideo } from '../lib/video-service';
import { useAuth } from '../lib/auth-context';
import Header from './common/Header';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const handleVideoUpload = async (
    title: string,
    description: string,
    videoId: string,
    tags: { [key: string]: string[] }
  ) => {
    if (!id) {
      alert('Gallery ID is required');
      return;
    }

    if (!user) {
      alert('You must be logged in to upload videos');
      return;
    }

    try {
      await addVideo(id, title, description, videoId, tags);
      // Navigate back to the gallery view
      navigate(`/gallery/${id}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload video');
    }
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-red-500">Error: Gallery ID is required</div>
          <Link to="/dashboard/galleries" className="text-blue-500 hover:text-blue-600 mt-4 inline-block">
            <ArrowLeft className="inline mr-2" size={20} />
            Back to Galleries
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link 
            to={`/gallery/${id}`}
            className="inline-flex items-center text-blue-500 hover:text-blue-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gallery
          </Link>
          <h1 className="text-3xl font-bold mt-2">Upload Video</h1>
        </div>
        <VideoUploadForm onVideoUpload={handleVideoUpload} galleryId={id} />
      </div>
    </div>
  );
};

export default UploadPage;