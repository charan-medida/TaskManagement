import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { Link } from 'react-router-dom';
import axiosInstance  from './interceptor';

export function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        conformPassword: ''
    });
    const [formErrors, setFormErrors] = useState({
        username: '',
        email: '',
        password: '',
        conformPassword: '',
        error: ''
    });

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
        } else if (formData.username.trim().length < 5) {
            newFormErrors.username = 'Username must have 5 or more characters';
            valid = false;
        }

        if (formData.email.trim() === '') {
            newFormErrors.email = 'Email is required';
            valid = false;
        }

        if (formData.password.trim() === '') {
            newFormErrors.password = 'Password is required';
            valid = false;
        } else if (formData.password.trim().length < 5) {
            newFormErrors.password = 'Password must have 5 or more characters';
            valid = false;
        }

        if (formData.conformPassword.trim() === '') {
            newFormErrors.conformPassword = 'Confirm password is required';
            valid = false;
        } else if (formData.conformPassword !== formData.password) {
            newFormErrors.conformPassword = 'Confirm password does not match with password';
            valid = false;
        }

        setFormErrors(newFormErrors);
        return valid;
    };

    const handleRegister = async () => {
        if (validateForm()) {
            try {

                 await axiosInstance.post('/user/registerUser', {
                    username: formData.username,
                    password: formData.password ,
                   email:formData.email
                    
                });
                
               
                    navigate('/');
                
            } catch (err) {
                setFormErrors(prevErrors => ({
                    ...prevErrors,
                    error: 'This username is already registered'
                }));
            }
        }
    };

    return (
        <div className="App">
      <img className="fullscreen-image" src="./images/task.jpg" alt='' />
      <h1 className="title-container" style={{ color: "orange" }}>Task Management</h1><br /><br />
      <div className="form">
        <h2>Register Here</h2>
        <input
          type="text"
          id="username"
          value={formData.username}
          onChange={(e) => updateFormData('username', e.target.value)}
          placeholder="Enter username"
        />
        <span style={{ color: 'red' }}>{formErrors.username}</span><br />
        <input
          id="email"
          type="text"
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
          placeholder="Enter email"
        />
        <span style={{ color: 'red' }}>{formErrors.email}</span><br />

        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => updateFormData('password', e.target.value)}
          placeholder="Enter password"
        />
        <span style={{ color: 'red' }}>{formErrors.password}</span><br />

        <input
          id="conformPassword"
          type="password"
          value={formData.conformPassword}
          onChange={(e) => updateFormData('conformPassword', e.target.value)}
          placeholder="Enter conformPassword"
        />
        <span style={{ color: 'red' }}>{formErrors.conformPassword}</span><br /><br />
       

            <button className="btn btn-success" onClick={handleRegister}> Register </button><br />
            <Link to="/" style={{color:"red"}}>{formErrors.error}</Link>   
      </div>
    </div>
        
    );
}