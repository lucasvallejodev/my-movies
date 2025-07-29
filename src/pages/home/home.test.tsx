import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { render, createMockCarouselItems } from '../../test/test-utils';
import Home from './home';

vi.mock('../../hooks/use-movies', () => ({
  useMovies: vi.fn(),
}));

vi.mock('../../components', () => ({
  Carousel: vi.fn(({ title, items }) => (
    <div data-testid={`carousel-${title.toLowerCase()}`}>
      <h2>{title}</h2>
      <div data-testid="carousel-items">{items?.length || 0} items</div>
    </div>
  )),
}));

import { useMovies } from '../../hooks/use-movies';

const mockUseMovies = useMovies as vi.MockedFunction<typeof useMovies>;

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    mockUseMovies.mockReturnValue({
      actionMovies: [],
      comedyMovies: [],
      fantasyMovies: [],
      loading: true,
      error: null,
    });

    render(<Home />);

    expect(screen.getByText('Loading movies...')).toBeInTheDocument();
    expect(screen.getByText('Loading movies...').closest('.home-page')).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    const errorMessage = 'Failed to fetch movies';
    mockUseMovies.mockReturnValue({
      actionMovies: [],
      comedyMovies: [],
      fantasyMovies: [],
      loading: false,
      error: errorMessage,
    });

    render(<Home />);

    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    expect(screen.getByText(`Error: ${errorMessage}`).closest('.home-page')).toBeInTheDocument();
  });

  it('renders movie carousels when data is loaded', () => {
    const mockActionMovies = createMockCarouselItems(5);
    const mockComedyMovies = createMockCarouselItems(3);
    const mockFantasyMovies = createMockCarouselItems(7);

    mockUseMovies.mockReturnValue({
      actionMovies: mockActionMovies,
      comedyMovies: mockComedyMovies,
      fantasyMovies: mockFantasyMovies,
      loading: false,
      error: null,
    });

    render(<Home />);

    expect(screen.getByText('Welcome to your list')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-action')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-comedy')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-fantasy')).toBeInTheDocument();
    
    // Check that mocked carousels receive the correct data
    expect(screen.getByText('5 items')).toBeInTheDocument(); // Action movies
    expect(screen.getByText('3 items')).toBeInTheDocument(); // Comedy movies
    expect(screen.getByText('7 items')).toBeInTheDocument(); // Fantasy movies
  });

  it('renders with empty movie arrays', () => {
    mockUseMovies.mockReturnValue({
      actionMovies: [],
      comedyMovies: [],
      fantasyMovies: [],
      loading: false,
      error: null,
    });

    render(<Home />);

    expect(screen.getByText('Welcome to your list')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-action')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-comedy')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-fantasy')).toBeInTheDocument();
    
    // Check that all carousels show 0 items
    const zeroItemsElements = screen.getAllByText('0 items');
    expect(zeroItemsElements).toHaveLength(3);
  });

  it('has correct CSS class structure', () => {
    mockUseMovies.mockReturnValue({
      actionMovies: [],
      comedyMovies: [],
      fantasyMovies: [],
      loading: false,
      error: null,
    });

    render(<Home />);

    const homePageElement = screen.getByText('Welcome to your list').closest('.home-page');
    expect(homePageElement).toHaveClass('home-page');
  });
});