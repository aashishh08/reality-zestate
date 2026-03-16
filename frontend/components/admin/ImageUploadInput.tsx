'use client';

import { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  /** If provided, renders a label above the input */
  label?: string;
  placeholder?: string;
  id?: string;
  /** Show image preview below the input (default: true) */
  showPreview?: boolean;
  /** Extra className on the root container */
  className?: string;
}

export function ImageUploadInput({
  value,
  onChange,
  label,
  placeholder,
  id,
  showPreview = true,
  className = '',
}: ImageUploadInputProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFile = async (file: File) => {
    setUploadError('');
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      onChange(json.url);
    } catch (e: any) {
      setUploadError(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-xs text-gray-400 mb-1 font-medium">
          {label}
        </label>
      )}

      <div className="flex gap-2">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2.5 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition"
        />

        {/* Hidden file picker */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            // reset so the same file can be re-selected
            e.target.value = '';
          }}
        />

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          title="Upload image from device"
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 bg-gray-700 border border-gray-600 text-gray-300 rounded-xl text-xs hover:bg-gray-600 hover:text-white transition disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </>
          )}
        </button>
      </div>

      {uploadError && (
        <p className="text-xs text-red-400 mt-1">{uploadError}</p>
      )}

      {showPreview && value && (
        <div className="mt-2 relative h-32 rounded-lg overflow-hidden border border-gray-700">
          <img src={value} alt="preview" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}
