const VITE_TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

if (!VITE_TMDB_API_KEY) {
  throw new Error('VITE_TMDB_API_KEY is required but not provided');
}

export const envVariables = {
  TMDB_API_KEY: VITE_TMDB_API_KEY,
  TMDB_BASE_URL: import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3",
  TMDB_POSTER_IMG_URL: import.meta.env.VITE_TMDB_POSTER_IMG_URL || "https://image.tmdb.org/t/p/w500",
  TMDB_ORIGINAL_IMG_URL: import.meta.env.VITE_TMDB_ORIGINAL_IMG_URL || "https://image.tmdb.org/t/p/original",
  TMDB_LOGO_URL: import.meta.env.VITE_TMDB_LOGO_URL || "https://image.tmdb.org/t/p/w200"
};

export const {
  TMDB_API_KEY,
  TMDB_BASE_URL,
  TMDB_POSTER_IMG_URL,
  TMDB_ORIGINAL_IMG_URL,
  TMDB_LOGO_URL
} = envVariables;