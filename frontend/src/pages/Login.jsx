// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { login as apiLogin } from '../api';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await apiLogin(email, password);
      // apiLogin stores token on success
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      const role = data.user?.role;
      if (role === 'seller') navigate('/seller');
      else if (role === 'buyer') navigate('/');
      else navigate('/profile');
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='w-full max-w-md'>
        <h2 className='text-center mb-6 text-4xl font-bold'>Login</h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 items-center'>
          <div className='flex flex-col w-full gap-2'>
            <label className='mb-1'>Email:</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className='border border-gray-300 rounded p-2 w-full'
            />
          </div>
          <div className='flex flex-col w-full gap-3'>
            <label className='mb-1'>Password:</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className='border border-gray-300 rounded p-2 w-full'
            />
          </div>
          {error && <div className='text-red-600'>{error}</div>}
          <button disabled={loading} type="submit" className='bg-amber-600 disabled:opacity-50 text-white font-semibold rounded p-2 mt-2 w-[35%]'>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
