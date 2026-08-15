import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// NOTE: StrictMode is intentionally NOT used here.
// The original site initializes several global imperative effects once on
// DOMContentLoaded (particles, WebGL fluid, event listeners). StrictMode's
// double-effect invocation in dev would duplicate those and change behavior.
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
