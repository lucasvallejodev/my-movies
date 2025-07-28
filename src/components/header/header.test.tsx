import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Header from './header';

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

const MemoryRouterWrapper = ({ children, initialEntries = ['/'] }: { children: React.ReactNode; initialEntries?: string[] }) => (
  <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
);

describe('Header Component', () => {
  describe('rendering', () => {
    it('should render header with logo', () => {
      render(
        <RouterWrapper>
          <Header />
        </RouterWrapper>
      );

      expect(screen.getByText('🎬')).toBeInTheDocument();
      expect(screen.getByText('Movies')).toBeInTheDocument();
    });

    it('should render navigation menu', () => {
      render(
        <RouterWrapper>
          <Header />
        </RouterWrapper>
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('should render all navigation links', () => {
      render(
        <RouterWrapper>
          <Header />
        </RouterWrapper>
      );

      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /favorites/i })).toBeInTheDocument();
    });

    it('should render navigation icons and text', () => {
      render(
        <RouterWrapper>
          <Header />
        </RouterWrapper>
      );

      expect(screen.getByText('🏠')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('❤️')).toBeInTheDocument();
      expect(screen.getByText('Favorites')).toBeInTheDocument();
    });
  });

  describe('navigation links', () => {
    it('should have correct href attributes', () => {
      render(
        <RouterWrapper>
          <Header />
        </RouterWrapper>
      );

      const homeLink = screen.getByRole('link', { name: /home/i });
      const favoritesLink = screen.getByRole('link', { name: /favorites/i });

      expect(homeLink).toHaveAttribute('href', '/');
      expect(favoritesLink).toHaveAttribute('href', '/favorites');
    });

    it('should apply active class to home link when on home page', () => {
      render(
        <MemoryRouterWrapper initialEntries={['/']}>
          <Header />
        </MemoryRouterWrapper>
      );

      const homeLink = screen.getByRole('link', { name: /home/i });
      const favoritesLink = screen.getByRole('link', { name: /favorites/i });

      expect(homeLink).toHaveClass('active');
      expect(favoritesLink).not.toHaveClass('active');
    });

    it('should apply active class to favorites link when on favorites page', () => {
      render(
        <MemoryRouterWrapper initialEntries={['/favorites']}>
          <Header />
        </MemoryRouterWrapper>
      );

      const homeLink = screen.getByRole('link', { name: /home/i });
      const favoritesLink = screen.getByRole('link', { name: /favorites/i });

      expect(homeLink).not.toHaveClass('active');
      expect(favoritesLink).toHaveClass('active');
    });

    it('should not apply active class to any link when on other pages', () => {
      render(
        <MemoryRouterWrapper initialEntries={['/detail/123']}>
          <Header />
        </MemoryRouterWrapper>
      );

      const homeLink = screen.getByRole('link', { name: /home/i });
      const favoritesLink = screen.getByRole('link', { name: /favorites/i });

      expect(homeLink).not.toHaveClass('active');
      expect(favoritesLink).not.toHaveClass('active');
    });
  });

  describe('structure and accessibility', () => {
    it('should have proper semantic structure', () => {
      render(
        <RouterWrapper>
          <Header />
        </RouterWrapper>
      );

      const header = screen.getByRole('banner');
      const nav = screen.getByRole('navigation');
      const list = screen.getByRole('list');

      expect(header).toBeInTheDocument();
      expect(nav).toBeInTheDocument();
      expect(list).toBeInTheDocument();
    });

    it('should have correct CSS classes', () => {
      render(
        <RouterWrapper>
          <Header />
        </RouterWrapper>
      );

      const header = screen.getByRole('banner');
      expect(header).toHaveClass('header');

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('nav');

      const list = screen.getByRole('list');
      expect(list).toHaveClass('nav-list');
    });

    it('should render navigation items as list items', () => {
      render(
        <RouterWrapper>
          <Header />
        </RouterWrapper>
      );

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(2);

      listItems.forEach(item => {
        expect(item).toHaveClass('nav-item');
      });
    });

    it('should have nav-link class on all navigation links', () => {
      render(
        <RouterWrapper>
          <Header />
        </RouterWrapper>
      );

      const homeLink = screen.getByRole('link', { name: /home/i });
      const favoritesLink = screen.getByRole('link', { name: /favorites/i });

      expect(homeLink).toHaveClass('nav-link');
      expect(favoritesLink).toHaveClass('nav-link');
    });
  });

  describe('logo section', () => {
    it('should render logo with correct structure', () => {
      const { container } = render(
        <RouterWrapper>
          <Header />
        </RouterWrapper>
      );

      const logo = container.querySelector('.logo');
      const logoIcon = container.querySelector('.logo-icon');
      const logoText = container.querySelector('.logo-text');

      expect(logo).toBeInTheDocument();
      expect(logoIcon).toBeInTheDocument();
      expect(logoText).toBeInTheDocument();
    });

    it('should display correct logo content', () => {
      const { container } = render(
        <RouterWrapper>
          <Header />
        </RouterWrapper>
      );

      const logoIcon = container.querySelector('.logo-icon');
      const logoText = container.querySelector('.logo-text');

      expect(logoIcon).toHaveTextContent('🎬');
      expect(logoText).toHaveTextContent('Movies');
    });
  });

  describe('responsive behavior', () => {
    it('should render all elements for responsive design', () => {
      const { container } = render(
        <RouterWrapper>
          <Header />
        </RouterWrapper>
      );

      const headerContainer = container.querySelector('.header-container');
      const navIcons = container.querySelectorAll('.nav-icon');
      const navTexts = container.querySelectorAll('.nav-text');

      expect(headerContainer).toBeInTheDocument();
      expect(navIcons).toHaveLength(2);
      expect(navTexts).toHaveLength(2);
    });
  });
});