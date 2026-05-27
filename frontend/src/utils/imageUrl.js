const BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000';

export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${BASE}${url}`;
};
