// src/pages/Login.jsx
import React from 'react';
import API from '../api'; // Make sure the path to api.js is correct
import { useNavigate } from 'react-router';

const Login = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { username, password });

      const { token, user } = res.data;

      // Save token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='w-full max-w-md'>
        <h2 className='text-center mb-6 text-4xl font-bold'>Login</h2>
        {error && <p className='text-red-600 text-center mb-2'>{error}</p>}
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 items-center'>
          <div className='flex justify-between w-full gap-2'>
            <label className='mb-1'>Username:</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className='border border-gray-300 rounded p-2 w-full'
            />
          </div>
          <div className='flex justify-between w-full gap-3'>
            <label className='mb-1'>Password:</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className='border border-gray-300 rounded p-2 w-full'
            />
          </div>
          <button type="submit" className='bg-amber-600 text-white font-semibold rounded p-2 mt-2 w-[35%]'>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
