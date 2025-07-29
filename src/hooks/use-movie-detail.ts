import { useState, useEffect } from 'react';
import type { MovieDetail } from '../types/movies-api';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

export const useMovieDetail = (movieId: string | undefined) => {
  const [movieData, setMovieData] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!movieId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch movie details: ${response.statusText}`);
        }
        
        const data: MovieDetail = await response.json();
        setMovieData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch movie details');
        setMovieData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  return {
    movieData,
    loading,
    error,
  };
};