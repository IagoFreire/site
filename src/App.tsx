import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DrawerPage from './pages/DrawerPage';
import { BolaoRouter } from './bolao/BolaoRouter';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/drawer" element={<DrawerPage />} />
      <Route path="/bolao/*" element={<BolaoRouter />} />
    </Routes>
  );
}

export default App;
