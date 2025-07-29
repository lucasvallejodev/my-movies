import { useState, useEffect } from 'react';
import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_POSTER_IMG_URL } from '../config/env-variables';

import type { CarouselItem } from '../components';
import type { Movie, MoviesResponse } from '../types/movies-api';

const ACTION_GENRE_ID = 28;
const COMEDY_GENRE_ID = 35;
const FANTASY_GENRE_ID = 14;

export const useMovies = () => {
  const [actionMovies, setActionMovies] = useState<CarouselItem[]>([]);
  const [comedyMovies, setComedyMovies] = useState<CarouselItem[]>([]);
  const [fantasyMovies, setFantasyMovies] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMoviesByGenre = async (genreId: number): Promise<Movie[]> => {
    try {
      let url = `${TMDB_BASE_URL}/discover/movie?sort_by=popularity.desc&with_genres=${genreId}&api_key=${TMDB_API_KEY}`;
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch movies: ${response.statusText}`);
      }
      const data: MoviesResponse = await response.json();
      return data.results;
    } catch (err) {
      throw new Error(`Error fetching movies: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const transformMovieData = (apiMovies: Movie[]): CarouselItem[] => {
    return apiMovies.map(movie => ({
      title: movie.title,
      desc: movie.overview || 'No description available',
      image: movie.poster_path ? `${TMDB_POSTER_IMG_URL}${movie.poster_path}` : '/placeholder-image.jpg',
      id: movie.id.toString(),
      year: movie.release_date ? new Date(movie.release_date).getFullYear().toString() : '',
      rating: Math.round(movie.vote_average * 10) / 10
    }));
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [actionMovies, comedyMovies, fantasyMovies] = await Promise.all([
          fetchMoviesByGenre(ACTION_GENRE_ID),
          fetchMoviesByGenre(COMEDY_GENRE_ID),
          fetchMoviesByGenre(FANTASY_GENRE_ID),
        ]);
        
        const transformedActionMovies = transformMovieData(actionMovies);
        const transformedComedyMovies = transformMovieData(comedyMovies);
        const transformedFantasyMovies = transformMovieData(fantasyMovies);

        setActionMovies(transformedActionMovies);
        setComedyMovies(transformedComedyMovies);
        setFantasyMovies(transformedFantasyMovies);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize data');
        setActionMovies([]);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  return {
    actionMovies,
    comedyMovies,
    fantasyMovies,
    loading,
    error,
  };
};