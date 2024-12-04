import React, { useState } from 'react';
import { Cloud, Upload, CheckCircle, AlertCircle, FileSpreadsheet, Database } from 'lucide-react';

const ImageUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState('nextdrought@gmail.com');
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | '';
    message: string;
  }>({ type: '', message: '' });

  const isImage = (file: File) => file.type.startsWith('image/');
  const isCsv = (file: File) => file.type === 'text/csv' || file.name.endsWith('.csv');
  const isNetCDF = (file: File) => file.name.toLowerCase().endsWith('.nc');
  const isHDF5 = (file: File) => file.name.toLowerCase().endsWith('.h5');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!isImage(selectedFile) && !isCsv(selectedFile) && !isNetCDF(selectedFile) && !isHDF5(selectedFile)) {
        setStatus({
          type: 'error',
          message: 'Please select an image, CSV, NetCDF, or HDF5 file.'
        });
        return;
      }

      setFile(selectedFile);
      
      if (isImage(selectedFile)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview('');
      }
      
      setStatus({ type: '', message: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatus({
        type: 'error',
        message: 'Please select a file to upload.'
      });
      return;
    }

    setUploading(true);
    setStatus({ type: '', message: '' });

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file:', file.name);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Upload response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      const event = new CustomEvent('dataUploaded', {
        detail: { 
          filename: data.filename || file.name,
          analysisFile: (data.filename || file.name).replace(/\.[^/.]+$/, ".json")
        }
      });
      document.dispatchEvent(event);

      setStatus({
        type: 'success',
        message: `${file.name} uploaded successfully! Analysis report will appear shortly.`
      });

      setFile(null);
      setPreview('');
    } catch (error) {
      console.error('Upload error:', error);
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Upload failed'
      });
    } finally {
      setUploading(false);
    }
  };

  const getUploadIcon = () => {
    if (file) {
      if (isCsv(file)) return <FileSpreadsheet className="h-12 w-12 text-blue-500" />;
      if (isNetCDF(file) || isHDF5(file)) return <Database className="h-12 w-12 text-blue-500" />;
      return null;
    }
    return <Cloud className="h-12 w-12 text-gray-400" />;
  };

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Upload Environmental Data (Image, CSV, NetCDF, or HDF5)
          </label>
          <div className="relative">
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*,.csv,.nc,.h5"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className={`relative cursor-pointer rounded-lg border-2 border-dashed p-6 flex flex-col items-center justify-center space-y-2
                ${file ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'}
                hover:border-blue-500 transition-colors`}
            >
              {preview ? (
                <div className="relative w-full aspect-video">
                  <img
                    src={preview}
                    alt="Preview"
                    className="rounded absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              ) : (
                <>
                  {getUploadIcon()}
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    Supported formats: JPG, PNG, CSV, NetCDF, HDF5
                  </div>
                </>
              )}
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={!file || uploading}
          className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
            ${
              uploading || !file
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
        >
          {uploading ? (
            <>
              <Upload className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Processing...
            </>
          ) : (
            'Analyze Data'
          )}
        </button>

        {status.type && (
          <div
            className={`p-4 rounded-md ${
              status.type === 'success'
                ? 'bg-blue-50 dark:bg-blue-900'
                : 'bg-red-50 dark:bg-red-900'
            }`}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                {status.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm ${
                    status.type === 'success'
                      ? 'text-blue-800 dark:text-blue-200'
                      : 'text-red-800 dark:text-red-200'
                  }`}
                >
                  {status.message}
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ImageUploader;
