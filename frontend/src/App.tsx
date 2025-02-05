import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Game from './pages/Game';
import Store from './pages/Store';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/game" element={<Game />} />
          <Route path="/store" element={<Store />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
