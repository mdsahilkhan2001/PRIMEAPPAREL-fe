// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Backend base URL (without /api for images, uploads, etc.)
export const BACKEND_URL = API_BASE_URL.replace('/api', '');

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${BACKEND_URL}${imagePath}`;
};

// Helper function to get full file URL (for PDFs, videos, etc.)
export const getFileUrl = (filePath) => {
    if (!filePath) return null;
    if (filePath.startsWith('http')) return filePath;
    return `${BACKEND_URL}${filePath}`;
};
