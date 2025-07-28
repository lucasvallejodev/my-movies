import './carousel.scss';
import { Link } from 'react-router-dom';
import type { CarouselItem } from './carousel.types';
import { useCarousel } from './use-carousel';
import { Rating } from '../ui';

interface CarouselProps {
  items: CarouselItem[];
  title: string;
}

const Carousel = ({ items, title }: CarouselProps) => {
  const {
    activeIndex,
    maxIndex,
    itemsPerView,
    updateIndex,
    shouldEnableNavigation
  } = useCarousel(items);

  return (
    <div className="carousel-section">
      <div className="carousel-header">
        <h2 className="section-title">{title}</h2>
      </div>
      <div className="carousel">
        <div 
          className="carousel-inner"
          style={{ transform: `translateX(-${activeIndex * (100 / itemsPerView)}%)` }}
        >
          {items.map((item, index) => {
            return (
              <Link 
                key={index}
                to={`/detail/${item.id || index + 1}`} 
                className="carousel-link"
              >
                <div className="carousel-item">
                  <div className="carousel-item-content">
                    <div className="carousel-image-container">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="carousel-image"
                      />
                    </div>
                    <div className="carousel-text">
                      <h3 className="movie-title">{item.title}</h3>
                      <div className="movie-meta">
                        <span className="movie-year">{item.year || "No Data"}</span>
                        {item.rating && (
                          <Rating rating={item.rating} />
                        )}
                        {!item.rating && (
                          <span className="rating-fallback">N/A</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {shouldEnableNavigation && (
          <>
            <button 
              className="carousel-button prev" 
              onClick={() => updateIndex(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous"
            >
              &#10094;
            </button>
            <button 
              className="carousel-button next" 
              onClick={() => updateIndex(activeIndex + 1)}
              disabled={activeIndex === maxIndex}
              aria-label="Next"
            >
              &#10095;
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Carousel;