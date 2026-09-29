import { HashRouter, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Schedule from './components/Schedule';
import GameDetail from './components/GameDetail';
import MessageBoard from './components/MessageBoard';

const App = () => (
  <HashRouter>
    <TopBar />
    <main style={{ paddingBottom: '80px' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Schedule />} />
        <Route path="/game/:id" element={<GameDetail />} />
        <Route path="/game/:id/messages" element={<MessageBoard />} />
      </Routes>
    </main>
    <NavBar />
  </HashRouter>
);

export default App;