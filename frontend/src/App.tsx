import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <span><h1>Under Dev</h1></span>
      <span>{process.env.REACT_APP_BACKEND_URL}</span>
    </div>
  );
}

export default App;
