
import React, { useState, useCallback, useRef } from 'react';
import { ImageResult } from './types';
import { fileToBase64 } from './utils/fileUtils';
import { editImage } from './services/geminiService';

import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ImageResultsGrid from './components/ImageResultsGrid';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { DownloadIcon } from './components/icons/DownloadIcon';
import { StopIcon } from './components/icons/StopIcon';

export default function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [imageResults, setImageResults] = useState<ImageResult[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const isStoppingRef = useRef(false);

  const handleFilesSelected = (files: FileList | null) => {
    if (files) {
      setGlobalError(null);
      const newImageResults = Array.from(files).map((file) => ({
        id: `${file.name}-${Date.now()}`,
        originalFile: file,
        originalUrl: URL.createObjectURL(file),
        status: 'pending' as const,
      }));
      setImageResults(newImageResults);
    }
  };

  const processImages = useCallback(async () => {
    if (!prompt.trim() || imageResults.length === 0) {
      setGlobalError('Please select images and provide an editing prompt.');
      return;
    }
    
    isStoppingRef.current = false;
    setIsProcessing(true);
    setGlobalError(null);

    // Process images sequentially to avoid hitting API rate limits.
    for (const result of imageResults) {
      if (isStoppingRef.current) {
        break;
      }

      // Only process images that are pending. Allows for reprocessing after stopping.
      if (result.status !== 'pending') {
        continue;
      }
      
      // Mark as processing
      setImageResults(prev => prev.map(r => r.id === result.id ? { ...r, status: 'processing' } : r));
      
      try {
        const { base64, mimeType } = await fileToBase64(result.originalFile);
        const editedImageBase64 = await editImage(base64, mimeType, prompt);
        
        setImageResults(prev => prev.map(r => r.id === result.id ? { ...r, status: 'completed', editedUrl: `data:${mimeType};base64,${editedImageBase64}` } : r));
      } catch (error) {
        console.error(`Failed to process ${result.originalFile.name}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        setImageResults(prev => prev.map(r => r.id === result.id ? { ...r, status: 'error', error: errorMessage } : r));
      }
    }

    // After loop, clean up any items that were 'processing' and reset them to 'pending'.
    // This handles the case where the user stopped the process.
    setImageResults(prev => prev.map(r => r.status === 'processing' ? { ...r, status: 'pending' } : r));

    setIsProcessing(false);
    isStoppingRef.current = false;

  }, [prompt, imageResults]);

  const handleStopProcessing = () => {
    isStoppingRef.current = true;
  };

  const clearAll = () => {
    setImageResults([]);
    setPrompt('');
    setGlobalError(null);
    setIsProcessing(false);
    isStoppingRef.current = false;
  };

  const handleDownloadAll = () => {
    const completedImages = imageResults.filter(r => r.status === 'completed' && r.editedUrl);
    completedImages.forEach((result, index) => {
      // Add a small delay to help browsers handle multiple downloads without being blocked.
      setTimeout(() => {
        if (!result.editedUrl) return;
        const link = document.createElement('a');
        link.href = result.editedUrl;
        link.download = `edited-${result.originalFile.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 300);
    });
  };

  const hasCompletedImages = imageResults.some(r => r.status === 'completed');

  return (
    <div className="min-h-screen bg-gem-deep-blue font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-gem-space-cadet p-8 rounded-2xl shadow-2xl border border-gem-shadow-blue/50">
          <div className="space-y-6">
            <ImageUploader onFilesSelected={handleFilesSelected} disabled={isProcessing} fileCount={imageResults.length} />

            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gem-mint mb-2">
                2. Enter Editing Instruction
              </label>
              <textarea
                id="prompt"
                rows={3}
                className="w-full bg-gem-deep-blue border border-gem-shadow-blue rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-gem-teal focus:border-gem-teal transition duration-300 disabled:opacity-50"
                placeholder="e.g., 'Add a birthday hat to each person', 'Convert to a watercolor painting', 'Make the background snowy'..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isProcessing}
              />
            </div>
            
            {globalError && (
              <div className="text-red-400 bg-red-900/50 p-3 rounded-lg text-center">
                {globalError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
               <button
                onClick={isProcessing ? handleStopProcessing : processImages}
                disabled={!isProcessing && (imageResults.length === 0 || !prompt.trim())}
                className={`flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm transition-all duration-300 group
                  ${isProcessing 
                      ? 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                      : 'text-gem-deep-blue bg-gem-mint hover:bg-gem-teal focus:ring-gem-teal'
                  }
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gem-space-cadet
                  disabled:bg-gem-shadow-blue disabled:cursor-not-allowed disabled:text-gray-400
                `}
              >
                {isProcessing ? (
                   <>
                     <StopIcon className="w-5 h-5 mr-3" />
                     Stop Processing
                   </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5 mr-2 text-gem-deep-blue group-hover:animate-pulse-fast"/>
                    Apply Edits to {imageResults.length} Images
                  </>
                )}
              </button>
              <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownloadAll}
                  disabled={isProcessing || !hasCompletedImages}
                  className="inline-flex items-center justify-center px-6 py-3 border border-gem-teal text-base font-medium rounded-md text-gem-mint bg-gem-teal/20 hover:bg-gem-teal/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gem-teal focus:ring-offset-gem-space-cadet transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-transparent disabled:border-gem-shadow-blue disabled:text-gray-500"
                  aria-label="Download all edited images"
                >
                  <DownloadIcon className="w-5 h-5 mr-2" />
                  Download All
                </button>
                <button
                  onClick={clearAll}
                  disabled={isProcessing}
                  className="px-6 py-3 border border-gem-shadow-blue text-base font-medium rounded-md text-gem-mint hover:bg-gem-shadow-blue/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gem-shadow-blue focus:ring-offset-gem-space-cadet transition-colors duration-300 disabled:opacity-50"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>

        {imageResults.length > 0 && <ImageResultsGrid results={imageResults} />}
      </main>
    </div>
  );
}
