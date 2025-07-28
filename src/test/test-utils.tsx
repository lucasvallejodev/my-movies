import { render, type RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import type { ReactElement } from 'react'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

export const createMockCarouselItem = (overrides = {}) => ({
  id: '1',
  title: 'Test Movie',
  desc: 'Test Description',
  image: 'test-image.jpg',
  year: '2023',
  rating: 8.5,
  ...overrides,
})

export const createMockCarouselItems = (count: number) =>
  Array.from({ length: count }, (_, index) =>
    createMockCarouselItem({
      id: (index + 1).toString(),
      title: `Movie ${index + 1}`,
      desc: `Description ${index + 1}`,
      image: `image${index + 1}.jpg`,
    })
  )

export const mockWindowResize = (width: number, height: number = 768) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
  window.dispatchEvent(new Event('resize'))
}