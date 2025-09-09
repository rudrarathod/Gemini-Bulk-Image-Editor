import React from 'react';
import { ImageResult } from '../types';
import ImageResultCard from './ImageResultCard';

interface ImageResultsGridProps {
  results: ImageResult[];
  onRedo: (id: string) => void;
}

const ImageResultsGrid: React.FC<ImageResultsGridProps> = ({ results, onRedo }) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold text-gem-mint mb-6">Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {results.map((result) => (
          <ImageResultCard key={result.id} result={result} onRedo={onRedo} />
        ))}
      </div>
    </div>
  );
};

export default ImageResultsGrid;