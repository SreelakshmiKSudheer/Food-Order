// src/pages/SignUp.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { registerByRole } from '../api';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [colleges, setColleges] = useState([]);
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/auth/colleges');
        if (!res.ok) throw new Error(`Failed to load colleges: ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.colleges || [];
        if (mounted) setColleges(list);
      } catch (err) {
        console.error(err);
        if (mounted) setError('Failed to load colleges');
      }
    })();
    return () => { mounted = false; };
  }, []);

  const roles = ['buyer', 'seller'];
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!role) return setError('Please select a role');
    setLoading(true);
    try {
      const payload = { name, email, password, college };
      const data = await registerByRole(role, payload);
      if (data.token) localStorage.setItem('token', data.token);
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      // Navigate based on role
      if (data.user?.role === 'seller') navigate('/seller');
      if (data.user?.role === 'buyer') navigate('/buyer');
      else navigate('/');
    } catch (err) {
      setError(err.message || (err.data && err.data.message) || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const [isOtherCollege, setIsOtherCollege] = useState(false);

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='w-full max-w-lg'>
        <h2 className='text-center mb-6 text-4xl font-bold'>Sign Up</h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 items-center'>
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
            <label className='mb-1 w-1/4'>Email:</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className='border border-gray-300 rounded p-2 w-full'
            />
          </div>
          <div className='flex justify-between w-full gap-2'>
            <label className='mb-1 w-1/4'>College:</label>
            <select
              value={isOtherCollege ? 'other' : college}
              onChange={e => {
                const val = e.target.value;
                if (val === 'other') {
                  setIsOtherCollege(true);
                  setCollege('');
                } else {
                  setIsOtherCollege(false);
                  setCollege(val);
                }
              }}
              required
              className='border border-gray-300 rounded p-2 w-full'
            >
              <option value="" disabled>Select your college</option>
              {colleges.map((col, idx) => {
                const isString = typeof col === 'string';
                const value = isString ? col : (col.name || col._id || JSON.stringify(col));
                const label = isString ? col : (col.name || col._id);
                const key = col._id || value || idx;
                return (
                  <option key={key} value={value}>{label}</option>
                );
              })}
              <option value="other">Other</option>
            </select>
          </div>

          {/* If user selected "Other" and is a seller, show a text input to enter college name */}
          {isOtherCollege && role === 'seller' && (
            <div className='flex justify-between w-full gap-2'>
              <label className='mb-1 w-1/4'>Enter College:</label>
              <input
                type="text"
                value={college}
                onChange={e => setCollege(e.target.value)}
                required
                placeholder='Type your college name'
                className='border border-gray-300 rounded p-2 w-full'
              />
            </div>
          )}

          <div className='flex justify-between w-full gap-2'>
            <label className='mb-1 w-1/4'>Role:</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              required
              className='border border-gray-300 rounded p-2 w-full'
            >
              <option value="" disabled>Select your role</option>
              {roles.map(r => (
                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
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
          {error && <div className='text-red-600'>{error}</div>}
          <button disabled={loading} type="submit" className='bg-amber-600 text-white font-semibold rounded p-2 mt-2 w-[35%]'>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
