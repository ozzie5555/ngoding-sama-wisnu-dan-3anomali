import React from 'react';
import Navbar from './components/Navbar';

function App() {
  return (
    <div>
      {/* Render the Navbar component */}
      <Navbar />
      
      {/* Main page content area */}
      <main style={{ padding: '2rem', color: '#ffffff' }}>
        <h1>Selamat Datang</h1>
        <p>KRISNA paok kink web hacker international.</p>
      </main>
    </div>
  );
}

export default App;