import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CardReview } from './components/CardReview';
import { CreateCardForm } from './components/CreateCardForm';
import { PracticeModule } from './components/PracticeModule';

const App: React.FC = () => (
  <Router>
    <nav className="p-4 bg-duolingoGreen text-white flex space-x-4">
      <Link to="/review" className="hover:underline">Review</Link>
      <Link to="/practice" className="hover:underline">Practice</Link>
      <Link to="/add" className="hover:underline">Add Card</Link>
    </nav>
    <Routes>
      <Route path="/review" element={<CardReview />} />
      <Route path="/practice" element={<PracticeModule />} />
      <Route path="/add" element={<CreateCardForm />} />
      <Route path="/*" element={<CardReview />} />
    </Routes>
  </Router>
);

export default App;