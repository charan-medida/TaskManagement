import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';
import axiosInstance from './interceptor';

export function Sign() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({
    username: '',
    password: '',
    error: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const updateFormData = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const validateForm = () => {
    let valid = true;
    const newFormErrors = { ...formErrors };

    if (formData.username.trim() === '') {
      newFormErrors.username = 'Username is required';
      valid = false;
    }

    if (formData.password.trim() === '') {
      newFormErrors.password = 'Password is required';
      valid = false;
    }

    setFormErrors(newFormErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      setFormErrors({ ...formErrors, error: '' }); 
      try {
        const response = await axiosInstance.post('/auth/login', {
          username: formData.username,
          password: formData.password
        });
        console.log(response);
        const token = response.data.token;
        if (token) {
          localStorage.setItem('token', token);
          console.log(token);
          navigate('/task');
        } else {
          setFormErrors({ ...formErrors, error: 'Invalid Credentials' });
        }
      } catch (err) {
        console.error(err);
        setFormErrors({ ...formErrors, error: 'Invalid Credentials' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="App">
      <img className="fullscreen-image" src="./images/task.jpg" alt='' />
      <h1 className="title-container" style={{ color: "orange" }}>Task Management</h1><br /><br />
      <div className="form">
        <h2>Login Here</h2>
        <input
          type="text"
          id="username"
          value={formData.username}
          onChange={(e) => updateFormData('username', e.target.value)}
          placeholder="Enter username"
        />
        <span style={{ color: 'red' }}>{formErrors.username}</span><br />
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => updateFormData('password', e.target.value)}
          placeholder="Enter Password"
        />
        <span style={{ color: 'red' }}>{formErrors.password}</span><br /><br />


        <button
          className="btn btn-success"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button><br />


        <Link to='/register'>Don't have an account? Click register</Link><br />
        {formErrors.error && (
          <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
            {formErrors.error}
          </div>
        )}
      </div>
    </div>
  );
}
