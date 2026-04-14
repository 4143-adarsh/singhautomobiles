/**
 * Format price to Indian Rupee format
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Format kilometers driven
 */
export const formatKm = (km) => {
  return new Intl.NumberFormat('en-IN').format(km) + ' km';
};

/**
 * Get image URL from filename
 */
export const getImageUrl = (filename) => {
  if (!filename) return '/placeholder-car.jpg';
  if (filename.startsWith('http')) return filename;
  return `/uploads/${filename}`;
};

/**
 * Get ordinal suffix for number (1st, 2nd, etc.)
 */
export const getOrdinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

/**
 * Truncate text to given length
 */
export const truncate = (text, length = 100) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

/**
 * Format date
 */
export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};
