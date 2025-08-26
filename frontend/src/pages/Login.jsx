// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='w-full max-w-md'>
        <h2 className='text-center mb-6 text-4xl font-bold'>Login</h2>
        <form className='flex flex-col gap-4 items-center'>
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
