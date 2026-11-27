const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.businessessentia.net';

export interface UploadFileResponse {
  id: string;
  url: string;
  filename: string;
  size_bytes: number;
}

/**
 * Uploads a file to the backend (which forwards it to Cloudinary).
 * 
 * @param file - The File object from the input element
 * @param folder - The folder to store it in (e.g., 'profiles', 'logos', 'general')
 * @returns Promise resolving to the uploaded file data including the Cloudinary URL
 */
export const uploadFile = async (file: File, folder: string = 'general'): Promise<UploadFileResponse> => {
  const formData = new FormData();
  
  // The backend expects the file field to be named exactly 'file'
  formData.append('file', file);
  formData.append('folder', folder);

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/files/upload`, {
      method: 'POST',
      // Do NOT set 'Content-Type': 'multipart/form-data' here. 
      // The browser will set it automatically with the correct boundary.
      credentials: 'include', // CRITICAL: Sends the bep_session cookie for authentication
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Upload failed with status ${response.status}`);
    }

    const data: UploadFileResponse = await response.json();
    return data;
    
  } catch (error: any) {
    console.error('File upload service error:', error);
    throw new Error(error.message || 'An unexpected error occurred during file upload.');
  }
};
