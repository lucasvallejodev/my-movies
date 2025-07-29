import './App.scss';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components';
import { Home, Favorites, Detail } from './pages';

function App() {
  return (
    <>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/detail/:id" element={<Detail />} />
        </Routes>
      </div>
    </>
  );
}

export default App;