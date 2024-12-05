import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import axiosInstance from "../services/axiosInstance";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const onLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axiosInstance.post('http://127.0.0.1:8000/Garage/login/', credentials); // Replace with your backend URL

      // Save the token to localStorage
      localStorage.setItem('access_token', response.data['access_token'])
      localStorage.setItem('refresh_token', response.data['refresh_token'])
      localStorage.setItem('role', response.data['role'])

      // Navigate to the car management page
      navigate('/car-management');
    } catch (error) {
      setErrorMessage('Invalid username or password');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={onLogin}>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          name="username"
          type="text"
          value={credentials.username}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleInputChange}
          required
        />

        <button type="submit">Login</button>
      </form>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
};

export default Login;
