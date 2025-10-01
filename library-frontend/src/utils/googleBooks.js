// utils/googleBooks.js
const SEARCH_BASE_URL = import.meta.env.VITE_SEARCH_BASE_URL;

export async function fetchBookDetail(volumeId) {
  const res = await fetch(`${SEARCH_BASE_URL}/${volumeId}`);
  if (!res.ok) throw new Error(`Google Books fetch failed: ${res.status}`);
  return res.json();
}
