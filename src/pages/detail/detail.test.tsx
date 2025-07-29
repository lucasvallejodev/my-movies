import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import { render } from '../../test/test-utils';
import Detail from './detail';

// Mock the hooks and router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

vi.mock('../../hooks/use-movie-detail', () => ({
  useMovieDetail: vi.fn(),
}));

vi.mock('../../hooks/use-favorites', () => ({
  useFavorites: vi.fn(),
}));

// Mock all the UI components
vi.mock('../../components', () => ({
  Rating: vi.fn(({ rating, votes }) => (
    <div data-testid="rating">Rating: {rating} ({votes} votes)</div>
  )),
  Pill: vi.fn(({ children }) => (
    <span data-testid="pill">{children}</span>
  )),
  ProductionCompany: vi.fn(({ name }) => (
    <div data-testid="production-company">{name}</div>
  )),
  CollectionItem: vi.fn(({ name }) => (
    <div data-testid="collection-item">{name}</div>
  )),
  AnchorButton: vi.fn(({ href, children }) => (
    <a data-testid="anchor-button" href={href}>{children}</a>
  )),
  FavoriteButton: vi.fn(({ isFavorite, onToggle }) => (
    <button data-testid="favorite-button" onClick={onToggle}>
      {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
    </button>
  )),
}));

import { useMovieDetail } from '../../hooks/use-movie-detail';
import { useFavorites } from '../../hooks/use-favorites';

const mockUseParams = useParams as vi.MockedFunction<typeof useParams>;
const mockUseMovieDetail = useMovieDetail as vi.MockedFunction<typeof useMovieDetail>;
const mockUseFavorites = useFavorites as vi.MockedFunction<typeof useFavorites>;

const mockMovieData = {
  id: 123,
  title: 'Test Movie',
  tagline: 'An amazing test movie',
  overview: 'This is a test movie description',
  release_date: '2023-01-15',
  vote_average: 8.5,
  vote_count: 1000,
  runtime: 120,
  status: 'Released',
  budget: 50000000,
  revenue: 150000000,
  homepage: 'https://testmovie.com',
  poster_path: '/test-poster.jpg',
  genres: [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Adventure' }
  ],
  production_companies: [
    { id: 1, name: 'Test Studios', logo_path: '/test-logo.jpg', origin_country: 'US' }
  ],
  production_countries: [
    { iso_3166_1: 'US', name: 'United States' }
  ],
  spoken_languages: [
    { iso_639_1: 'en', english_name: 'English' }
  ],
  belongs_to_collection: {
    id: 1,
    name: 'Test Collection',
    poster_path: '/collection-poster.jpg'
  }
};

describe('Detail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ id: '123' });
    mockUseFavorites.mockReturnValue({
      isFavorite: vi.fn(() => false),
      toggleFavorite: vi.fn(),
      getAllFavorites: vi.fn(),
      favoritesCount: 0,
      addToFavorites: vi.fn(),
      removeFromFavorites: vi.fn(),
    });
  });

  it('renders loading state correctly', () => {
    mockUseMovieDetail.mockReturnValue({
      movieData: null,
      loading: true,
      error: null,
    });

    render(<Detail />);

    expect(screen.getByText('Loading movie details...')).toBeInTheDocument();
    expect(screen.getByText('Loading movie details...').closest('.detail-page')).toHaveClass('detail-page');
  });

  it('renders error state correctly', () => {
    const errorMessage = 'Failed to fetch movie details';
    mockUseMovieDetail.mockReturnValue({
      movieData: null,
      loading: false,
      error: errorMessage,
    });

    render(<Detail />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(errorMessage).closest('.detail-page')).toHaveClass('detail-page');
  });

  it('renders movie not found when no data and no error', () => {
    mockUseMovieDetail.mockReturnValue({
      movieData: null,
      loading: false,
      error: null,
    });

    render(<Detail />);

    expect(screen.getByText('Movie not found')).toBeInTheDocument();
  });

  it('renders movie details correctly when data is loaded', () => {
    mockUseMovieDetail.mockReturnValue({
      movieData: mockMovieData,
      loading: false,
      error: null,
    });

    render(<Detail />);

    // Check main movie information
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('"An amazing test movie"')).toBeInTheDocument();
    expect(screen.getByText('This is a test movie description')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    
    // Check movie stats
    expect(screen.getByText('Runtime: 120 minutes')).toBeInTheDocument();
    expect(screen.getByText('Status: Released')).toBeInTheDocument();
    expect(screen.getByText('Budget: $50,000,000')).toBeInTheDocument();
    expect(screen.getByText('Revenue: $150,000,000')).toBeInTheDocument();
    
    // Check components are rendered
    expect(screen.getByTestId('rating')).toBeInTheDocument();
    expect(screen.getByTestId('anchor-button')).toBeInTheDocument();
    expect(screen.getByTestId('favorite-button')).toBeInTheDocument();
  });

  it('renders genres correctly', () => {
    mockUseMovieDetail.mockReturnValue({
      movieData: mockMovieData,
      loading: false,
      error: null,
    });

    render(<Detail />);

    const pills = screen.getAllByTestId('pill');
    expect(pills).toHaveLength(4); // 2 genres + 1 country + 1 language
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Adventure')).toBeInTheDocument();
  });

  it('renders additional information sections', () => {
    mockUseMovieDetail.mockReturnValue({
      movieData: mockMovieData,
      loading: false,
      error: null,
    });

    render(<Detail />);

    expect(screen.getByText('Additional Information')).toBeInTheDocument();
    expect(screen.getByText('Part of Collection')).toBeInTheDocument();
    expect(screen.getByText('Production Companies')).toBeInTheDocument();
    expect(screen.getByText('Production Countries')).toBeInTheDocument();
    expect(screen.getByText('Spoken Languages')).toBeInTheDocument();
    
    expect(screen.getByTestId('collection-item')).toBeInTheDocument();
    expect(screen.getByTestId('production-company')).toBeInTheDocument();
  });

  it('handles favorite button correctly when movie is not favorite', () => {
    mockUseMovieDetail.mockReturnValue({
      movieData: mockMovieData,
      loading: false,
      error: null,
    });

    render(<Detail />);

    expect(screen.getByText('Add to Favorites')).toBeInTheDocument();
  });

  it('handles favorite button correctly when movie is favorite', () => {
    mockUseMovieDetail.mockReturnValue({
      movieData: mockMovieData,
      loading: false,
      error: null,
    });

    mockUseFavorites.mockReturnValue({
      isFavorite: vi.fn(() => true),
      toggleFavorite: vi.fn(),
      getAllFavorites: vi.fn(),
      favoritesCount: 1,
      addToFavorites: vi.fn(),
      removeFromFavorites: vi.fn(),
    });

    render(<Detail />);

    expect(screen.getByText('Remove from Favorites')).toBeInTheDocument();
  });

  it('handles missing optional data gracefully', () => {
    const minimalMovieData = {
      id: 123,
      title: 'Minimal Movie',
      overview: 'Basic description',
      release_date: '2023-01-15',
      vote_average: 7.0,
      vote_count: 500,
      status: 'Released',
      budget: 0,
      revenue: 0,
      poster_path: null,
      genres: [],
      production_companies: [],
      production_countries: [],
      spoken_languages: [],
      belongs_to_collection: null,
      homepage: null,
      tagline: null,
      runtime: null,
    };

    mockUseMovieDetail.mockReturnValue({
      movieData: minimalMovieData,
      loading: false,
      error: null,
    });

    render(<Detail />);

    expect(screen.getByText('Minimal Movie')).toBeInTheDocument();
    expect(screen.getByText('Basic description')).toBeInTheDocument();
    expect(screen.queryByText('Visit Official Website')).not.toBeInTheDocument();
    expect(screen.queryByText('Runtime:')).not.toBeInTheDocument();
    expect(screen.queryByText('Budget:')).not.toBeInTheDocument();
    expect(screen.queryByText('Revenue:')).not.toBeInTheDocument();
  });

  it('has correct CSS class structure', () => {
    mockUseMovieDetail.mockReturnValue({
      movieData: mockMovieData,
      loading: false,
      error: null,
    });

    render(<Detail />);

    const detailPageElement = screen.getByText('Test Movie').closest('.detail-page');
    expect(detailPageElement).toHaveClass('detail-page');
  });
});