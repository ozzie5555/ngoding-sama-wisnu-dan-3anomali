import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function App() {
  return (
    <div className="app-container">
      {/* Existing Navbar - DO NOT MODIFY */}
      <Navbar />

      {/* Homepage Content */}
      <Home />
    </div>
  );
}

export default App;