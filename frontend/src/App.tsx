import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CardReview } from './components/CardReview';
import { CreateCardForm } from './components/CreateCardForm';

const App: React.FC = () => (
  <Router>
    <nav className="p-4 bg-blue-600 text-white flex space-x-4">
      <Link to="/review" className="hover:underline">Review</Link>
      <Link to="/add" className="hover:underline">Add Card</Link>
    </nav>
    <Routes>
      <Route path="/review" element={<CardReview />} />
      <Route path="/add" element={<CreateCardForm />} />
      <Route path="/*" element={<CardReview />} />
    </Routes>
  </Router>
);

export default App;