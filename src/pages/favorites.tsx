import './favorites.scss';
import { useFavorites } from '../hooks/use-favorites';
import Carousel from '../components/carousel/carousel';

function Favorites() {
  const { getAllFavorites, favoritesCount } = useFavorites();
  const favoriteMovies = getAllFavorites();

  if (favoritesCount === 0) {
    return (
      <div className="favorites-page">
        <h1>Your Favorite Movies</h1>
        <div className="empty-favorites">
          <p>No favorite movies yet</p>
          <p className="empty-message-secondary">
            Browse movies and click the heart icon to add them to your favorites!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <h1>Your Favorite Movies ({favoritesCount})</h1>
      <Carousel items={favoriteMovies} title="Your Favorites" />
    </div>
  );
}

export default Favorites;