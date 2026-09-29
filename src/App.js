import { HashRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Schedule from './components/Schedule';
import GameDetail from './components/GameDetail';

const App = () => (
  <HashRouter>
    <main style={{ paddingBottom: '80px' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Schedule />} />
        <Route path="/game/:id" element={<GameDetail />} />
      </Routes>
    </main>
    <NavBar />
  </HashRouter>
);

export default App;