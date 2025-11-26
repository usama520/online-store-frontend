import { useMutation } from '@apollo/client';
import { CREATE_DIRECT_UPLOAD } from '../graphql/mutations';
import { DirectUploadInput, DirectUploadResponse, UploadProgress } from '../types';
import { generateMD5Checksum } from '../utils/md5';

interface UseDirectUploadOptions {
  onProgress?: (progress: UploadProgress) => void;
}

interface UploadFileResult {
  signedBlobId: string;
}

/**
 * Custom hook for handling direct file uploads
 * Implements the complete flow: MD5 checksum → GraphQL mutation → PUT upload
 */
export const useDirectUpload = (options?: UseDirectUploadOptions) => {
  const [createDirectUpload, { loading, error }] = useMutation<{
    createDirectUpload: {
      directUpload?: DirectUploadResponse;
      errors?: string[];
    };
  }>(CREATE_DIRECT_UPLOAD);

  const uploadFile = async (file: File): Promise<UploadFileResult> => {
    try {
      // Step 1: Generate MD5 checksum (chunked)
      const checksum = await generateMD5Checksum(file);

      // Step 2: Call GraphQL mutation to get signed URL
      const input: DirectUploadInput = {
        filename: file.name,
        byteSize: file.size,
        contentType: file.type,
        checksum,
      };

      const { data } = await createDirectUpload({
        variables: { input },
      });

      if (!data?.createDirectUpload) {
        throw new Error('Failed to get upload URL');
      }

      const { directUpload, errors } = data.createDirectUpload;

      if (errors && errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      if (!directUpload) {
        throw new Error('Invalid response from server');
      }

      const { directUploadUrl, signedBlobId, uploadHeaders } = directUpload;

      if (!directUploadUrl || !signedBlobId) {
        throw new Error('Invalid response from server');
      }

      // Parse uploadHeaders if it's a JSON string
      let parsedHeaders: Record<string, string> = {};
      if (uploadHeaders) {
        if (typeof uploadHeaders === 'string') {
          parsedHeaders = JSON.parse(uploadHeaders);
        } else {
          parsedHeaders = uploadHeaders as Record<string, string>;
        }
      }

      // Step 3: PUT upload to signed URL with progress tracking
      await uploadToSignedUrl(file, directUploadUrl, parsedHeaders, options?.onProgress);

      return { signedBlobId };
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Upload failed');
    }
  };

  return {
    uploadFile,
    loading,
    error,
  };
};

/**
 * Upload file to signed URL using PUT request with progress tracking
 */
async function uploadToSignedUrl(
  file: File,
  signedUrl: string,
  headers: Record<string, string>,
  onProgress?: (progress: UploadProgress) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const progress: UploadProgress = {
          loaded: e.loaded,
          total: e.total,
          percentage: Math.round((e.loaded / e.total) * 100),
        };
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload aborted'));
    });

    xhr.open('PUT', signedUrl);

    // Set headers from server response
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    // Set content type if not provided in headers
    if (!headers['Content-Type'] && !headers['content-type']) {
      xhr.setRequestHeader('Content-Type', file.type);
    }

    xhr.send(file);
  });
}

