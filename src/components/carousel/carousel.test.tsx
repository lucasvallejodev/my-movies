import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Carousel from './carousel';
import type { CarouselItem } from './carousel.types';

vi.mock('./use-carousel', () => ({
  useCarousel: vi.fn(),
}));

import { useCarousel } from './use-carousel';

const mockUseCarousel = useCarousel as vi.MockedFunction<typeof useCarousel>;

const mockItems: CarouselItem[] = [
  { id: '1', title: 'Movie 1', desc: 'Description 1', image: 'image1.jpg', year: '2021', rating: 8.5 },
  { id: '2', title: 'Movie 2', desc: 'Description 2', image: 'image2.jpg', year: '2022', rating: 7.8 },
  { id: '3', title: 'Movie 3', desc: 'Description 3', image: 'image3.jpg', year: '2023', rating: 9.1 },
  { id: '4', title: 'Movie 4', desc: 'Description 4', image: 'image4.jpg', year: '2024', rating: 8.2 },
  { id: '5', title: 'Movie 5', desc: 'Description 5', image: 'image5.jpg', year: '2025', rating: 7.5 },
];

const mockCarouselHookReturn = {
  activeIndex: 0,
  maxIndex: 2,
  itemsPerView: 3,
  updateIndex: vi.fn(),
  shouldEnableNavigation: true,
};

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Carousel Component', () => {
  beforeEach(() => {
    mockUseCarousel.mockReturnValue(mockCarouselHookReturn);
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render carousel with title', () => {
      render(
        <RouterWrapper>
          <Carousel items={mockItems} title="Test Movies" />
        </RouterWrapper>
      );

      expect(screen.getByText('Test Movies')).toBeInTheDocument();
    });

    it('should render all carousel items', () => {
      render(
        <RouterWrapper>
          <Carousel items={mockItems} title="Test Movies" />
        </RouterWrapper>
      );

      mockItems.forEach(item => {
        expect(screen.getByText(item.title)).toBeInTheDocument();
        expect(screen.getByText(item.year!)).toBeInTheDocument();
        expect(screen.getByText(item.rating!.toString())).toBeInTheDocument();
      });
    });

    it('should render images with correct src and alt attributes', () => {
      render(
        <RouterWrapper>
          <Carousel items={mockItems} title="Test Movies" />
        </RouterWrapper>
      );

      mockItems.forEach(item => {
        const image = screen.getByAltText(item.title);
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', item.image);
      });
    });

    it('should render navigation buttons when navigation is enabled', () => {
      render(
        <RouterWrapper>
          <Carousel items={mockItems} title="Test Movies" />
        </RouterWrapper>
      );

      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    it('should not render navigation buttons when navigation is disabled', () => {
      mockUseCarousel.mockReturnValue({
        ...mockCarouselHookReturn,
        shouldEnableNavigation: false,
      });

      render(
        <RouterWrapper>
          <Carousel items={mockItems} title="Test Movies" />
        </RouterWrapper>
      );

      expect(screen.queryByRole('button', { name: /previous/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('should call updateIndex with correct value when next button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <RouterWrapper>
          <Carousel items={mockItems} title="Test Movies" />
        </RouterWrapper>
      );

      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      expect(mockCarouselHookReturn.updateIndex).toHaveBeenCalledWith(1);
    });

    it('should call updateIndex with correct value when prev button is clicked', async () => {
      const user = userEvent.setup();
      mockUseCarousel.mockReturnValue({
        ...mockCarouselHookReturn,
        activeIndex: 1,
      });

      render(
        <RouterWrapper>
          <Carousel items={mockItems} title="Test Movies" />
        </RouterWrapper>
      );

      const prevButton = screen.getByRole('button', { name: /previous/i });
      await user.click(prevButton);

      expect(mockCarouselHookReturn.updateIndex).toHaveBeenCalledWith(0);
    });

    it('should disable prev button when at first index', () => {
      mockUseCarousel.mockReturnValue({
        ...mockCarouselHookReturn,
        activeIndex: 0,
      });

      render(
        <RouterWrapper>
          <Carousel items={mockItems} title="Test Movies" />
        </RouterWrapper>
      );

      const prevButton = screen.getByRole('button', { name: /previous/i });
      expect(prevButton).toBeDisabled();
    });

    it('should disable next button when at last index', () => {
      mockUseCarousel.mockReturnValue({
        ...mockCarouselHookReturn,
        activeIndex: 2,
      });

      render(
        <RouterWrapper>
          <Carousel items={mockItems} title="Test Movies" />
        </RouterWrapper>
      );

      const nextButton = screen.getByRole('button', { name: /next/i });
      expect(nextButton).toBeDisabled();
    });
  });

  describe('carousel transform', () => {
    it('should apply correct transform style based on activeIndex and itemsPerView', () => {
      mockUseCarousel.mockReturnValue({
        ...mockCarouselHookReturn,
        activeIndex: 1,
        itemsPerView: 3,
      });

      render(
        <RouterWrapper>
          <Carousel items={mockItems} title="Test Movies" />
        </RouterWrapper>
      );

      const carouselInner = document.querySelector('.carousel-inner');
      expect(carouselInner).toHaveStyle('transform: translateX(-33.333333333333336%)');
    });

    it('should apply zero transform when activeIndex is 0', () => {
      render(
        <RouterWrapper>
          <Carousel items={mockItems} title="Test Movies" />
        </RouterWrapper>
      );

      const carouselInner = document.querySelector('.carousel-inner');
      expect(carouselInner).toHaveStyle('transform: translateX(-0%)');
    });
  });

  describe('links', () => {
    it('should create correct links for each item', () => {
      render(
        <RouterWrapper>
          <Carousel items={mockItems} title="Test Movies" />
        </RouterWrapper>
      );

      mockItems.forEach(item => {
        const link = screen.getByRole('link', { name: new RegExp(item.title, 'i') });
        expect(link).toHaveAttribute('href', `/detail/${item.id}`);
      });
    });

    it('should use index + 1 as fallback when item id is missing', () => {
      const itemsWithoutId = mockItems.map(item => ({ ...item, id: '' }));

      render(
        <RouterWrapper>
          <Carousel items={itemsWithoutId} title="Test Movies" />
        </RouterWrapper>
      );

      itemsWithoutId.forEach((item, index) => {
        const link = screen.getByRole('link', { name: new RegExp(item.title, 'i') });
        expect(link).toHaveAttribute('href', `/detail/${index + 1}`);
      });
    });
  });

  describe('fallback values', () => {
    it('should display "No Data" when year is missing', () => {
      const itemsWithoutYear = mockItems.map(item => ({ ...item, year: undefined }));

      render(
        <RouterWrapper>
          <Carousel items={itemsWithoutYear} title="Test Movies" />
        </RouterWrapper>
      );

      const noDataElements = screen.getAllByText('No Data');
      expect(noDataElements).toHaveLength(itemsWithoutYear.length);
    });

    it('should display "N/A" when rating is missing', () => {
      const itemsWithoutRating = mockItems.map(item => ({ ...item, rating: undefined }));

      render(
        <RouterWrapper>
          <Carousel items={itemsWithoutRating} title="Test Movies" />
        </RouterWrapper>
      );

      const naElements = screen.getAllByText('N/A');
      expect(naElements).toHaveLength(itemsWithoutRating.length);
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA labels for navigation buttons', () => {
      render(
        <RouterWrapper>
          <Carousel items={mockItems} title="Test Movies" />
        </RouterWrapper>
      );

      const prevButton = screen.getByRole('button', { name: /previous/i });
      const nextButton = screen.getByRole('button', { name: /next/i });

      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });

    it('should have proper heading structure', () => {
      render(
        <RouterWrapper>
          <Carousel items={mockItems} title="Test Movies" />
        </RouterWrapper>
      );

      const sectionTitle = screen.getByRole('heading', { level: 2, name: 'Test Movies' });
      expect(sectionTitle).toBeInTheDocument();

      const movieTitles = screen.getAllByRole('heading', { level: 3 });
      expect(movieTitles).toHaveLength(mockItems.length);
    });
  });

  describe('edge cases', () => {
    it('should handle empty items array gracefully', () => {
      mockUseCarousel.mockReturnValue({
        ...mockCarouselHookReturn,
        shouldEnableNavigation: false,
        maxIndex: 0,
      });

      render(
        <RouterWrapper>
          <Carousel items={[]} title="Empty Carousel" />
        </RouterWrapper>
      );

      expect(screen.getByText('Empty Carousel')).toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should handle single item gracefully', () => {
      const singleItem = [mockItems[0]];
      mockUseCarousel.mockReturnValue({
        ...mockCarouselHookReturn,
        shouldEnableNavigation: false,
        maxIndex: 0,
      });

      render(
        <RouterWrapper>
          <Carousel items={singleItem} title="Single Item" />
        </RouterWrapper>
      );

      expect(screen.getByText(singleItem[0].title)).toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });
});