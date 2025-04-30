import React from 'react';

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '2rem' }}>
      <h1>🔐 Contrify</h1>
      <p>Selfhosted Contract Management for the future.</p>
      <button
        onClick={() => alert('Login logic coming soon!')}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Login
      </button>
    </div>
  );
}

export default App;
