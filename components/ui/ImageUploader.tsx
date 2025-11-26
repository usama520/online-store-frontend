"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useDirectUpload } from "@/lib/hooks/useDirectUpload";
import { useToast } from "@/lib/hooks/useToast";
import { UploadProgress } from "@/lib/types";

interface ImageUploaderProps {
  onUploadComplete: (signedIds: string[]) => void;
  multiple?: boolean;
  maxSize?: number; // bytes, default 5MB
  accept?: string; // default 'image/*'
  className?: string;
}

interface FileWithPreview {
  file: File;
  preview: string;
  progress?: UploadProgress;
  signedId?: string;
  error?: string;
}

export default function ImageUploader({
  onUploadComplete,
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = "image/jpeg,image/png",
  className = "",
}: ImageUploaderProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef<FileWithPreview[]>([]);
  const { uploadFile } = useDirectUpload({
    onProgress: (progress) => {
      // Update progress for the current file being uploaded
      setFiles((prev) => {
        const updated = prev.map((f) => (f.signedId ? f : { ...f, progress }));
        filesRef.current = updated;
        return updated;
      });
    },
  });
  const { showError, showSuccess } = useToast();

  const validateFile = (file: File): string | null => {
    // Validate file type (JPEG and PNG only)
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      return "Only JPEG and PNG images are allowed";
    }

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      return `File size must be less than ${maxSizeMB}MB`;
    }

    return null;
  };

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;

      const newFiles: FileWithPreview[] = [];
      const errors: string[] = [];

      Array.from(fileList).forEach((file) => {
        const error = validateFile(file);
        if (error) {
          errors.push(`${file.name}: ${error}`);
          return;
        }

        // Check if multiple is false and we already have a file
        if (!multiple && files.length > 0) {
          errors.push("Only one file is allowed");
          return;
        }

        newFiles.push({
          file,
          preview: URL.createObjectURL(file),
        });
      });

      if (errors.length > 0) {
        showError(errors.join("; "));
      }

      if (newFiles.length > 0) {
        setFiles((prev) => {
          const updated = multiple ? [...prev, ...newFiles] : newFiles;
          filesRef.current = updated;
          return updated;
        });
      }
    },
    [multiple, maxSize, files.length, showError]
  );

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const file = prev[index];
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
      const updated = prev.filter((_, i) => i !== index);
      filesRef.current = updated;
      return updated;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      showError("Please select at least one file");
      return;
    }

    setIsUploading(true);
    const signedIds: string[] = [];
    const errors: string[] = [];

    try {
      // Upload files sequentially to avoid overwhelming the server
      for (let i = 0; i < files.length; i++) {
        const fileWithPreview = files[i];

        // Skip if already uploaded
        if (fileWithPreview.signedId) {
          signedIds.push(fileWithPreview.signedId);
          continue;
        }

        // Skip if there's an error
        if (fileWithPreview.error) {
          continue;
        }

        try {
          const result = await uploadFile(fileWithPreview.file);
          signedIds.push(result.signedBlobId);

          // Update file with signed ID
          setFiles((prev) => {
            const updated = prev.map((f, idx) =>
              idx === i ? { ...f, signedId: result.signedBlobId } : f
            );
            filesRef.current = updated;
            return updated;
          });
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Upload failed";
          errors.push(`${fileWithPreview.file.name}: ${errorMessage}`);

          // Update file with error
          setFiles((prev) => {
            const updated = prev.map((f, idx) =>
              idx === i ? { ...f, error: errorMessage } : f
            );
            filesRef.current = updated;
            return updated;
          });
        }
      }

      if (errors.length > 0) {
        showError(`Some uploads failed: ${errors.join("; ")}`);
      }

      if (signedIds.length > 0) {
        onUploadComplete(signedIds);
        if (errors.length === 0) {
          showSuccess(
            `Successfully uploaded ${signedIds.length} file${
              signedIds.length > 1 ? "s" : ""
            }`
          );
        }
      } else {
        showError("All uploads failed");
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    files.forEach((f) => {
      if (f.preview) {
        URL.revokeObjectURL(f.preview);
      }
    });
    setFiles([]);
    filesRef.current = [];
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      filesRef.current.forEach((f) => {
        if (f.preview) {
          URL.revokeObjectURL(f.preview);
        }
      });
    };
  }, []);

  return (
    <div className={className}>
      {/* Drag and Drop Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50 hover:border-gray-400"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
          disabled={isUploading}
        />

        <div className="space-y-4">
          <div>
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            <p className="text-sm text-gray-600">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-700 font-medium"
                disabled={isUploading}
              >
                Click to upload
              </button>
              {" or drag and drop"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              JPEG and PNG only, max {maxSize / (1024 * 1024)}MB per file
            </p>
          </div>
        </div>
      </div>

      {/* File Previews */}
      {files.length > 0 && (
        <div className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">
              Selected Files ({files.length})
            </h3>
            <button
              type="button"
              onClick={handleClear}
              className="text-sm text-red-600 hover:text-red-700"
              disabled={isUploading}
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {files.map((fileWithPreview, index) => (
              <div key={index} className="relative group">
                <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-300 bg-gray-100">
                  <img
                    src={fileWithPreview.preview}
                    alt={fileWithPreview.file.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Progress Overlay */}
                  {fileWithPreview.progress && !fileWithPreview.signedId && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-sm font-semibold mb-1">
                          {fileWithPreview.progress.percentage}%
                        </div>
                        <div className="w-32 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${fileWithPreview.progress.percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Success Indicator */}
                  {fileWithPreview.signedId && (
                    <div className="absolute inset-0 bg-green-500 bg-opacity-75 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Error Indicator */}
                  {fileWithPreview.error && (
                    <div className="absolute inset-0 bg-red-500 bg-opacity-75 flex items-center justify-center p-2">
                      <div className="text-center text-white text-xs">
                        <svg
                          className="w-6 h-6 mx-auto mb-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        <p className="font-semibold">Error</p>
                      </div>
                    </div>
                  )}

                  {/* Remove Button */}
                  {!isUploading && (
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* File Name */}
                <p
                  className="mt-1 text-xs text-gray-600 truncate"
                  title={fileWithPreview.file.name}
                >
                  {fileWithPreview.file.name}
                </p>

                {/* File Size */}
                <p className="text-xs text-gray-500">
                  {(fileWithPreview.file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading || files.every((f) => f.signedId)}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isUploading
                ? "Uploading..."
                : files.every((f) => f.signedId)
                ? "All Uploaded"
                : `Upload ${files.filter((f) => !f.signedId).length} File${
                    files.filter((f) => !f.signedId).length !== 1 ? "s" : ""
                  }`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
