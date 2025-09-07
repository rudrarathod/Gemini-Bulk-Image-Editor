
import React, { useState } from 'react';
import { ImageResult } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';

interface ImageResultCardProps {
  result: ImageResult;
}

const ImageComparator: React.FC<{ original: string; edited: string }> = ({ original, edited }) => {
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <div className="relative w-full aspect-square rounded-lg overflow-hidden select-none">
      {/* Edited image (bottom layer) */}
      <img
        src={edited}
        alt="Edited"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable="false"
      />
      {/* Original image (top layer, clipped) */}
      <div
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={original}
          alt="Original"
          className="absolute inset-0 w-full h-full object-cover"
          draggable="false"
        />
      </div>
      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 bg-gem-mint/80 w-0.5 pointer-events-none"
        style={{ left: `calc(${sliderPosition}% - 1px)` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -left-4 bg-gem-mint p-1 rounded-full shadow-lg border-2 border-gem-space-cadet">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gem-deep-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7l4-4m0 0l4 4m-4-4v18" transform="rotate(90 12 12)" />
           </svg>
        </div>
      </div>
      {/* Range input (the actual slider control) */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onInput={(e) => setSliderPosition(Number((e.target as HTMLInputElement).value))}
        className="absolute inset-0 w-full h-full cursor-col-resize opacity-0"
        aria-label="Image comparison slider"
      />
    </div>
  );
};


const ImageResultCard: React.FC<ImageResultCardProps> = ({ result }) => {

  const handleDownload = () => {
    if (!result.editedUrl) return;
    const link = document.createElement('a');
    link.href = result.editedUrl;
    link.download = `edited-${result.originalFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const StatusIndicator = () => {
    switch(result.status) {
      case 'processing':
        return <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse z-10">Processing...</div>;
      case 'completed':
        return <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">Completed</div>;
      case 'error':
        return <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">Error</div>;
      default:
        return null;
    }
  };

  const ResultContent = () => {
    switch (result.status) {
      case 'processing':
        return (
          <div className="w-full aspect-square bg-gem-deep-blue/50 flex items-center justify-center rounded-lg animate-pulse">
            <svg className="w-10 h-10 text-gem-teal animate-spinner-ease-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        );
      case 'completed':
        return result.editedUrl ? (
          <ImageComparator original={result.originalUrl} edited={result.editedUrl} />
        ) : (
          <div className="w-full aspect-square bg-gem-deep-blue/50 flex items-center justify-center rounded-lg text-gray-400">Preview not available</div>
        );
      case 'error':
        return <div className="w-full aspect-square bg-red-900/50 flex items-center justify-center rounded-lg p-4 text-center text-red-300 text-sm">{result.error}</div>;
      default:
        return <div className="w-full aspect-square bg-gem-deep-blue/50 flex items-center justify-center rounded-lg text-gray-500">Awaiting Edits</div>;
    }
  };

  return (
    <div className="bg-gem-space-cadet p-4 rounded-xl shadow-lg border border-gem-shadow-blue/30 space-y-4 relative overflow-hidden">
      <StatusIndicator />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gem-mint mb-2 text-center">Original</h3>
          <img src={result.originalUrl} alt={result.originalFile.name} className="w-full aspect-square object-cover rounded-lg" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gem-mint mb-2 text-center">Edited</h3>
          <div className="w-full aspect-square">
            <ResultContent />
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400 truncate text-center" title={result.originalFile.name}>{result.originalFile.name}</p>
      {result.status === 'completed' && (
        <button 
          onClick={handleDownload}
          className="w-full mt-2 inline-flex items-center justify-center px-4 py-2 border border-gem-shadow-blue text-sm font-medium rounded-md text-gem-mint hover:bg-gem-shadow-blue/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gem-teal focus:ring-offset-gem-space-cadet transition-colors"
        >
          <DownloadIcon className="w-4 h-4 mr-2" />
          Download
        </button>
      )}
    </div>
  );
};

export default ImageResultCard;
