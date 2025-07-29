import { useParams } from 'react-router-dom';
import { useMovieDetail } from '../../hooks/use-movie-detail';
import { useFavorites } from '../../hooks/use-favorites';
import { Rating, Pill, ProductionCompany, CollectionItem, AnchorButton, FavoriteButton } from '../../components/ui';
import type { CarouselItem } from '../../components/carousel/carousel.types';
import './detail.scss';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';
const POSTER_BASE_URL = import.meta.env.VITE_TMDB_POSTER_IMG_URL;
const LOGO_BASE_URL = 'https://image.tmdb.org/t/p/w200';

function Detail() {
  const { id } = useParams();
  const { movieData, loading, error } = useMovieDetail(id);
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleToggleFavorite = () => {
    if (!movieData || !id) return;

    // Transform MovieDetail to CarouselItem
    const carouselItem: CarouselItem = {
      id: movieData.id.toString(),
      title: movieData.title,
      desc: movieData.overview || 'No description available',
      image: movieData.poster_path ? `${POSTER_BASE_URL}${movieData.poster_path}` : '/placeholder-image.jpg',
      year: movieData.release_date ? new Date(movieData.release_date).getFullYear().toString() : undefined,
      rating: Math.round(movieData.vote_average * 10) / 10,
    };

    toggleFavorite(carouselItem);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="detail-page">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          color: '#fff'
        }}>
          Loading movie details...
        </div>
      </div>
    );
  }

  if (error || !movieData) {
    return (
      <div className="detail-page">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          color: '#ff0000'
        }}>
          {error || 'Movie not found'}
        </div>
      </div>
    );
  }

  const isMovieFavorite = id ? isFavorite(id) : false;

  return (
    <div className="detail-page">
      <div className="detail-container">
        <div className="detail-content">
          <div className="image-area">
            <div className="image-container">
              <img 
                src={movieData.poster_path ? `${IMAGE_BASE_URL}${movieData.poster_path}` : '/placeholder-image.jpg'} 
                alt={movieData.title} 
              />
            </div>
          </div>
          <div className="info-area">
            <h2>{movieData.title}</h2>
            {movieData.tagline && (
              <p className="tagline">"{movieData.tagline}"</p>
            )}
            <div className="movie-meta">
              <span className="movie-year">
                {movieData.release_date ? new Date(movieData.release_date).getFullYear() : 'Unknown'}
              </span>
              <Rating rating={movieData.vote_average} votes={movieData.vote_count} />
            </div>
            {movieData.genres && movieData.genres.length > 0 && (
              <div className="genres">
                {movieData.genres.map(genre => (
                  <Pill key={genre.id}>{genre.name}</Pill>
                ))}
              </div>
            )}
            <p className="description">{movieData.overview || 'No description available'}</p>
            <div className="movie-stats">
              {movieData.runtime && (
                <p className="runtime">Runtime: {movieData.runtime} minutes</p>
              )}
              <p className="status">Status: {movieData.status}</p>
              {movieData.budget > 0 && (
                <p className="budget">Budget: {formatCurrency(movieData.budget)}</p>
              )}
              {movieData.revenue > 0 && (
                <p className="revenue">Revenue: {formatCurrency(movieData.revenue)}</p>
              )}
            </div>
            <div className="action-buttons">
              {movieData.homepage && (
                <AnchorButton href={movieData.homepage}>
                  Visit Official Website
                </AnchorButton>
              )}
              <FavoriteButton 
                isFavorite={isMovieFavorite}
                onToggle={handleToggleFavorite}
              />
            </div>
          </div>
        </div>

        <div className="additional-info">
          <h3>Additional Information</h3>
          
          {movieData.belongs_to_collection && (
            <div className="info-section">
              <h4>Part of Collection</h4>
              <CollectionItem
                name={movieData.belongs_to_collection.name}
                posterPath={movieData.belongs_to_collection.poster_path}
                logoBaseUrl={LOGO_BASE_URL}
              />
            </div>
          )}

          {movieData.production_companies && movieData.production_companies.length > 0 && (
            <div className="info-section">
              <h4>Production Companies</h4>
              <div className="companies-grid">
                {movieData.production_companies.map(company => (
                  <ProductionCompany
                    key={company.id}
                    name={company.name}
                    logoPath={company.logo_path}
                    originCountry={company.origin_country}
                    logoBaseUrl={LOGO_BASE_URL}
                  />
                ))}
              </div>
            </div>
          )}

          {movieData.production_countries && movieData.production_countries.length > 0 && (
            <div className="info-section">
              <h4>Production Countries</h4>
              <div className="countries-list">
                {movieData.production_countries.map(country => (
                  <Pill key={country.iso_3166_1}>
                    {country.name}
                  </Pill>
                ))}
              </div>
            </div>
          )}

          {movieData.spoken_languages && movieData.spoken_languages.length > 0 && (
            <div className="info-section">
              <h4>Spoken Languages</h4>
              <div className="languages-list">
                {movieData.spoken_languages.map(language => (
                  <Pill key={language.iso_639_1}>
                    {language.english_name}
                  </Pill>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Detail;