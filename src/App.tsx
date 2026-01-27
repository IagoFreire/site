import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DrawerPage from './pages/DrawerPage';
import HytalePage from './pages/HytalePage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/drawer" element={<DrawerPage />} />
      <Route path="/hytale" element={<HytalePage />} />
    </Routes>
  );
}

export default App;
