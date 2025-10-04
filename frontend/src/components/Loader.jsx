import { Droplet } from 'lucide-react';

const Loader = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="relative inline-block">
            <Droplet className="h-16 w-16 text-red-600 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="spinner"></div>
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="relative inline-block">
          <Droplet className="h-12 w-12 text-red-600 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="spinner"></div>
          </div>
        </div>
        <p className="mt-3 text-gray-600 font-semibold">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;