import { useMovies } from '../../hooks/use-movies';
import { Carousel } from '../../components';
import './home.scss';

function Home() {
  const { actionMovies, comedyMovies, fantasyMovies, loading, error } = useMovies();

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading-state">
          Loading movies...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="error-state">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <h1>Welcome to your list</h1>
      <Carousel items={actionMovies} title="Action" />
      <Carousel items={comedyMovies} title="Comedy" />
      <Carousel items={fantasyMovies} title="Fantasy" />
    </div>
  );
}

export default Home;