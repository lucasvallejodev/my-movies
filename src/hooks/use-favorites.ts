import { useState, useEffect, useCallback } from 'react';
import type { CarouselItem } from '../components';

const FAVORITES_STORAGE_KEY = 'my-movies-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<CarouselItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(parsedFavorites);
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
      setFavorites([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites, isLoaded]);

  const isFavorite = useCallback((id: string): boolean => {
    return favorites.some(item => item.id === id);
  }, [favorites]);

  const addToFavorites = useCallback((item: CarouselItem) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
  }, []);

  const removeFromFavorites = useCallback((id: string) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  }, []);

  const toggleFavorite = useCallback((item: CarouselItem) => {
    if (isFavorite(item.id)) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item);
    }
  }, [isFavorite, addToFavorites, removeFromFavorites]);

  const getAllFavorites = useCallback((): CarouselItem[] => {
    return favorites;
  }, [favorites]);

  const favoritesCount = favorites.length;

  return {
    favorites,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    getAllFavorites,
    favoritesCount,
    isLoaded,
  };
};