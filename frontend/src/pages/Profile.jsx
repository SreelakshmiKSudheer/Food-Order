import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [role, setRole] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('/api/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            console.warn('Unauthorized: invalid or expired token.');
            // optional: localStorage.removeItem('token');
          }
          throw new Error('Failed to fetch profile');
        }

        const data = await res.json();
        if (mounted && data) {
          setName(data.name || '');
          setEmail(data.email || '');
          setCollege(data.college.name || '');
          setRole(data.role || '');
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError(err.message);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleToggleEdit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // If currently editing, save changes
    if (isEditing) {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No auth token available.');
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/user/profile', {
          method: 'PUT', // or PATCH depending on your backend
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, email, college }),
        });

        if (!res.ok) {
          if (res.status === 401) {
            console.warn('Unauthorized: invalid or expired token.');
          }
          throw new Error('Failed to save profile');
        }

        // Optionally read response and update state from server
        const data = await res.json();
        setName(data.name || name);
        setEmail(data.email || email);
        setCollege(data.college || college);

        setIsEditing(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Enter edit mode
      setIsEditing(true);
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto p-6 border border-gray-300 rounded-lg bg-white shadow">
        <h2 className="text-2xl font-bold mb-6">User Profile</h2>
        <h3 className="text-xl font-semibold mb-2">{name || 'Unnamed User'}</h3>

        <form onSubmit={handleToggleEdit} className="space-y-3">
          <div className="flex items-center gap-2">
            <label htmlFor="name" className="mb-1 w-1/4">
              Name:
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border border-gray-300 rounded p-2 w-full"
              disabled={!isEditing}
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="email" className="mb-1 w-1/4">
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-300 rounded p-2 w-full"
              disabled={!isEditing}
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="college" className="mb-1 w-1/4">
              College:
            </label>
            <input
              id="college"
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              required
              className="border border-gray-300 rounded p-2 w-full"
              disabled={!isEditing}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2 px-4 bg-amber-600 text-white rounded hover:bg-amber-700 transition disabled:opacity-50"
            onClick={handleToggleEdit}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : isEditing ? 'Save Profile' : 'Edit Profile'}
          </button>
        </form>

        {error && <p className="text-red-600 mt-2">{error}</p>}

        <hr className="my-4" />

        {role === 'buyer' && 
        <>
        (<h4 className="text-lg font-medium mb-2">Recent Orders</h4>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
          <li>Margherita Pizza - 2 Jun 2024</li>
          <li>Veggie Burger - 28 May 2024</li>
          <li>Pasta Alfredo - 20 May 2024</li>
        </ul>)
        </>}
      </div>
    </div>
  );
};

export default Profile;