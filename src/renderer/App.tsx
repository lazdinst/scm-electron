import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Matrix from './containers/Matrix';

function Hello() {
  return (
    <div>
      <p>This is the SC Matrix</p>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Matrix />} />
      </Routes>
    </Router>
  );
}
