import './App.css';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      navigate('/task'); 
    } else {
      navigate('/sign');
    }
  }, [navigate]);

  return (
    <div>
      {}
    </div>
  );
}

export default App;
