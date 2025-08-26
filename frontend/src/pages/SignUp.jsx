// src/pages/SignUp.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const SignUp = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [role, setRole] = useState('');
  const colleges = ['College A', 'College B', 'College C'];
  const roles = ['Buyer', 'Seller'];

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='w-full max-w-md'>
        <h2 className='text-center mb-6 text-4xl font-bold'>Sign Up</h2>
        <form className='flex flex-col gap-4 items-center'>
          <div className='flex justify-between w-full gap-2'>
            <label className='mb-1 w-1/4'>Name:</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className='border border-gray-300 rounded p-2 w-full'
            />
          </div>
          <div className='flex justify-between w-full gap-2'>
            <label className='mb-1 w-1/4'>Username:</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className='border border-gray-300 rounded p-2 w-full'
            />
          </div>
          <div className='flex justify-between w-full gap-2'>
            <label className='mb-1 w-1/4'>College:</label>
            <select
              value={college}
              onChange={e => setCollege(e.target.value)}
              required
              className='border border-gray-300 rounded p-2 w-full'
            >
              <option value="" disabled>Select your college</option>
              {colleges.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
          <div className='flex justify-between w-full gap-2'>
            <label className='mb-1 w-1/4'>Role:</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              required
              className='border border-gray-300 rounded p-2 w-full'
            >
              <option value="" disabled>Select your role</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className='flex justify-between w-full gap-3'>
            <label className='mb-1 w-1/4'>Password:</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className='border border-gray-300 rounded p-2 w-full'
            />
          </div>
          <button type="submit" className='bg-amber-600 text-white font-semibold rounded p-2 mt-2 w-[35%]'>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
