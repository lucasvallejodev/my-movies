
import Carousel from '../components/carousel/carousel';
import { useMovies } from '../hooks/use-movies';

function Home() {
  const { actionMovies, comedyMovies, fantasyMovies, loading, error } = useMovies();

  if (loading) {
    return (
      <div className="home-page">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          color: '#fff'
        }}>
          Loading movies...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          color: '#ff0000'
        }}>
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