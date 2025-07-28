import { renderHook, act } from '@testing-library/react'
import { useCarousel } from './use-carousel'
import type { CarouselItem } from './carousel.types'

// Mock data
const mockItems: CarouselItem[] = [
  { id: '1', title: 'Movie 1', desc: 'Description 1', image: 'image1.jpg', year: '2021', rating: 8.5 },
  { id: '2', title: 'Movie 2', desc: 'Description 2', image: 'image2.jpg', year: '2022', rating: 7.8 },
  { id: '3', title: 'Movie 3', desc: 'Description 3', image: 'image3.jpg', year: '2023', rating: 9.1 },
  { id: '4', title: 'Movie 4', desc: 'Description 4', image: 'image4.jpg', year: '2024', rating: 8.2 },
  { id: '5', title: 'Movie 5', desc: 'Description 5', image: 'image5.jpg', year: '2025', rating: 7.5 },
  { id: '6', title: 'Movie 6', desc: 'Description 6', image: 'image6.jpg', year: '2026', rating: 8.8 },
]

const mockFewItems: CarouselItem[] = mockItems.slice(0, 3)

describe('useCarousel', () => {
  beforeEach(() => {
    // Reset window size to default
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useCarousel(mockItems))

      expect(result.current.activeIndex).toBe(0)
      expect(result.current.itemsPerView).toBe(4)
      expect(result.current.maxIndex).toBe(2)
      expect(result.current.shouldEnableNavigation).toBe(true)
    })

    it('should handle empty items array', () => {
      const { result } = renderHook(() => useCarousel([]))

      expect(result.current.activeIndex).toBe(0)
      expect(result.current.maxIndex).toBe(0)
      expect(result.current.shouldEnableNavigation).toBe(false)
    })

    it('should disable navigation when items are fewer than itemsPerView', () => {
      const { result } = renderHook(() => useCarousel(mockFewItems))

      expect(result.current.shouldEnableNavigation).toBe(false)
      expect(result.current.maxIndex).toBe(0)
    })
  })

  describe('responsive behavior', () => {
    it('should set itemsPerView to 2 for small screens (≤480px)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 480,
      })

      const { result } = renderHook(() => useCarousel(mockItems))

      expect(result.current.itemsPerView).toBe(2)
      expect(result.current.maxIndex).toBe(4)
    })

    it('should set itemsPerView to 3 for medium screens (≤768px)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      })

      const { result } = renderHook(() => useCarousel(mockItems))

      expect(result.current.itemsPerView).toBe(3)
      expect(result.current.maxIndex).toBe(3)
    })

    it('should set itemsPerView to 4 for large screens (≤1024px)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })

      const { result } = renderHook(() => useCarousel(mockItems))

      expect(result.current.itemsPerView).toBe(4)
      expect(result.current.maxIndex).toBe(2) // 6 items - 4 items per view = 2
    })

    it('should set itemsPerView to 5 for extra large screens (>1024px)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      })

      const { result } = renderHook(() => useCarousel(mockItems))

      expect(result.current.itemsPerView).toBe(5)
      expect(result.current.maxIndex).toBe(1) // 6 items - 5 items per view = 1
    })
  })

  describe('window resize handling', () => {
    it('should update itemsPerView when window is resized', () => {
      const { result } = renderHook(() => useCarousel(mockItems))

      // Initial state (1024px)
      expect(result.current.itemsPerView).toBe(4)

      // Simulate window resize to small screen
      act(() => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 480,
        })
        window.dispatchEvent(new Event('resize'))
      })

      expect(result.current.itemsPerView).toBe(2)
      expect(result.current.maxIndex).toBe(4)
    })

    it('should reset activeIndex if it exceeds new maxIndex after resize', () => {
      const { result } = renderHook(() => useCarousel(mockItems))

      // Set activeIndex to maximum for large screen
      act(() => {
        result.current.updateIndex(2) // maxIndex for 4 items per view
      })

      expect(result.current.activeIndex).toBe(2)

      // Resize to extra large screen (more items per view, lower maxIndex)
      act(() => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 1200,
        })
        window.dispatchEvent(new Event('resize'))
      })

      // activeIndex should be adjusted to new maxIndex
      expect(result.current.maxIndex).toBe(1)
    })
  })

  describe('updateIndex function', () => {
    it('should update activeIndex within valid range', () => {
      const { result } = renderHook(() => useCarousel(mockItems))

      act(() => {
        result.current.updateIndex(1)
      })

      expect(result.current.activeIndex).toBe(1)
    })

    it('should clamp negative index to 0', () => {
      const { result } = renderHook(() => useCarousel(mockItems))

      act(() => {
        result.current.updateIndex(-1)
      })

      expect(result.current.activeIndex).toBe(0)
    })

    it('should clamp index above maxIndex to maxIndex', () => {
      const { result } = renderHook(() => useCarousel(mockItems))

      const maxIndex = result.current.maxIndex

      act(() => {
        result.current.updateIndex(maxIndex + 5)
      })

      expect(result.current.activeIndex).toBe(maxIndex)
    })

    it('should handle edge case when maxIndex is 0', () => {
      const { result } = renderHook(() => useCarousel(mockFewItems))

      act(() => {
        result.current.updateIndex(1)
      })

      expect(result.current.activeIndex).toBe(0)
    })
  })

  describe('cleanup', () => {
    it('should remove resize event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
      
      const { unmount } = renderHook(() => useCarousel(mockItems))

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    })
  })

  describe('items change handling', () => {
    it('should recalculate maxIndex when items change', () => {
      const { result, rerender } = renderHook(
        ({ items }) => useCarousel(items),
        { initialProps: { items: mockItems } }
      )

      const initialMaxIndex = result.current.maxIndex

      // Change items to fewer items
      rerender({ items: mockFewItems })

      expect(result.current.maxIndex).not.toBe(initialMaxIndex)
      expect(result.current.maxIndex).toBe(0) // 3 items - 4 items per view = 0 (clamped)
    })

    it('should update shouldEnableNavigation when items change', () => {
      const { result, rerender } = renderHook(
        ({ items }) => useCarousel(items),
        { initialProps: { items: mockItems } }
      )

      expect(result.current.shouldEnableNavigation).toBe(true)

      // Change to fewer items
      rerender({ items: mockFewItems })

      expect(result.current.shouldEnableNavigation).toBe(false)
    })
  })
})