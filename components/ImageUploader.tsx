
import React, { useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onFilesSelected: (files: FileList | null) => void;
  disabled: boolean;
  fileCount: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFilesSelected, disabled, fileCount }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilesSelected(event.target.files);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gem-mint mb-2">
        1. Upload Your Images
      </label>
      <div
        onClick={handleClick}
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gem-shadow-blue border-dashed rounded-md transition-colors duration-300 ${disabled ? 'cursor-not-allowed bg-gem-deep-blue/50' : 'cursor-pointer bg-gem-deep-blue hover:border-gem-teal'}`}
      >
        <div className="space-y-1 text-center py-4">
          <UploadIcon className={`mx-auto h-12 w-12 ${disabled ? 'text-gray-500' : 'text-gem-shadow-blue group-hover:text-gem-teal'}`} />
          <div className="flex text-sm text-gray-400">
            <p className="pl-1">
              {fileCount > 0 ? `${fileCount} image(s) selected` : 'Click to upload or drag and drop'}
            </p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          <input
            ref={inputRef}
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
