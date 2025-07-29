import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { render, createMockCarouselItems } from '../../test/test-utils';
import Favorites from './favorites';

vi.mock('../../hooks/use-favorites', () => ({
  useFavorites: vi.fn(),
}));

vi.mock('../../components', () => ({
  Carousel: vi.fn(({ title, items }) => (
    <div data-testid="favorites-carousel">
      <h2>{title}</h2>
      <div data-testid="carousel-items">{items?.length || 0} items</div>
    </div>
  )),
}));

import { useFavorites } from '../../hooks/use-favorites';

const mockUseFavorites = useFavorites as vi.MockedFunction<typeof useFavorites>;

describe('Favorites Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state when no favorites exist', () => {
    mockUseFavorites.mockReturnValue({
      getAllFavorites: vi.fn(() => []),
      favoritesCount: 0,
      isFavorite: vi.fn(),
      addToFavorites: vi.fn(),
      removeFromFavorites: vi.fn(),
      toggleFavorite: vi.fn(),
    });

    render(<Favorites />);

    expect(screen.getByText('Your Favorite Movies')).toBeInTheDocument();
    expect(screen.getByText('No favorite movies yet')).toBeInTheDocument();
    expect(screen.getByText('Browse movies and click the heart icon to add them to your favorites!')).toBeInTheDocument();
    expect(screen.getByText('Your Favorite Movies').closest('.favorites-page')).toHaveClass('favorites-page');
    expect(screen.queryByTestId('favorites-carousel')).not.toBeInTheDocument();
  });

  it('renders favorites carousel when favorites exist', () => {
    const mockFavorites = createMockCarouselItems(4);
    
    mockUseFavorites.mockReturnValue({
      getAllFavorites: vi.fn(() => mockFavorites),
      favoritesCount: 4,
      isFavorite: vi.fn(),
      addToFavorites: vi.fn(),
      removeFromFavorites: vi.fn(),
      toggleFavorite: vi.fn(),
    });

    render(<Favorites />);

    expect(screen.getByText('Your Favorite Movies (4)')).toBeInTheDocument();
    expect(screen.getByTestId('favorites-carousel')).toBeInTheDocument();
    expect(screen.getByText('4 items')).toBeInTheDocument();
    expect(screen.queryByText('No favorite movies yet')).not.toBeInTheDocument();
  });

  it('displays correct count in heading', () => {
    const mockFavorites = createMockCarouselItems(10);
    
    mockUseFavorites.mockReturnValue({
      getAllFavorites: vi.fn(() => mockFavorites),
      favoritesCount: 10,
      isFavorite: vi.fn(),
      addToFavorites: vi.fn(),
      removeFromFavorites: vi.fn(),
      toggleFavorite: vi.fn(),
    });

    render(<Favorites />);

    expect(screen.getByText('Your Favorite Movies (10)')).toBeInTheDocument();
    expect(screen.getByText('10 items')).toBeInTheDocument();
  });

  it('renders with single favorite movie', () => {
    const mockFavorites = createMockCarouselItems(1);
    
    mockUseFavorites.mockReturnValue({
      getAllFavorites: vi.fn(() => mockFavorites),
      favoritesCount: 1,
      isFavorite: vi.fn(),
      addToFavorites: vi.fn(),
      removeFromFavorites: vi.fn(),
      toggleFavorite: vi.fn(),
    });

    render(<Favorites />);

    expect(screen.getByText('Your Favorite Movies (1)')).toBeInTheDocument();
    expect(screen.getByTestId('favorites-carousel')).toBeInTheDocument();
    expect(screen.getByText('1 items')).toBeInTheDocument();
  });

  it('has correct CSS class structure', () => {
    mockUseFavorites.mockReturnValue({
      getAllFavorites: vi.fn(() => []),
      favoritesCount: 0,
      isFavorite: vi.fn(),
      addToFavorites: vi.fn(),
      removeFromFavorites: vi.fn(),
      toggleFavorite: vi.fn(),
    });

    render(<Favorites />);

    const favoritesPageElement = screen.getByText('Your Favorite Movies').closest('.favorites-page');
    expect(favoritesPageElement).toHaveClass('favorites-page');
  });
});