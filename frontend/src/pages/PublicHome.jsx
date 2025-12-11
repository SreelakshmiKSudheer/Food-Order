import React from 'react'
import Card from '../components/Card'

const PublicHome = () => {
  return (
    <div className='max-w-screen-lg mx-auto my-auto p-2 flex flex-col justify-center'>
      <div className='flex flex-col items-center justify-center gap-2 my-8 rounded-2xl shadow-md shadow-gray-500 p-20 pt-10'>
        <h1 className='text-4xl text-amber-600 font-bold text-center'>Fast Order</h1>
        <h2 className='text-4xl font-semibold text-center'>Welcome to the Food Order App</h2>
        <p className='font-medium text-center'>Place your order before it's too late!</p>
        <div className='flex mt-4 w-1/2 justify-center'>
          <a href="/login" className='bg-amber-600 text-center text-white px-4 py-2 rounded-lg shadow-md shadow-amber-300 hover:bg-amber-700 transition-colors mr-4 w-1/2'>Login</a>
          <a href="/register" className='bg-amber-600 text-center text-white px-4 py-2 rounded-lg shadow-md shadow-amber-300 hover:bg-amber-700 transition-colors w-1/2'>Register</a>
        </div>
      </div>
        
        
    </div>
  )
}

export default PublicHome