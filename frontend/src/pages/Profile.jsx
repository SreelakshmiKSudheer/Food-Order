import { React, useState } from 'react'

const Profile = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [college, setCollege] = useState('');

  const [isEditing, setIsEditing] = React.useState(false);

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto p-6 border border-gray-300 rounded-lg bg-white shadow">
        <h2 className="text-2xl font-bold mb-6">User Profile</h2>
        <h3 className="text-xl font-semibold mb-2">Jane Doe</h3>
        <div className='flex justify-between w-full gap-2'>
          <label className='mb-1 w-1/4'>Name:</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className='border border-gray-300 rounded p-2 w-full'
            disabled={!isEditing}
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
            disabled={!isEditing}
          />
        </div>
        <div className='flex justify-between w-full gap-2'>
          <label className='mb-1 w-1/4'>College:</label>
          <input
            type="text"
            value={college}
            onChange={e => setCollege(e.target.value)}
            required
            className='border border-gray-300 rounded p-2 w-full'
            disabled={!isEditing}
          />
        </div>
        <button
          className="w-full mt-2 py-2 px-4 bg-amber-600 text-white rounded hover:bg-amber-700 transition"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Save Profile' : 'Edit Profile'}
        </button>

        <hr className="my-4" />
        <h4 className="text-lg font-medium mb-2">Recent Orders</h4>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
          <li>Margherita Pizza - 2 Jun 2024</li>
          <li>Veggie Burger - 28 May 2024</li>
          <li>Pasta Alfredo - 20 May 2024</li>
        </ul>
      </div>
    </div>
  )
}

export default Profile