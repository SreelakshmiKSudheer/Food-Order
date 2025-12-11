import React from 'react'

const Card = ({ title, description, image, price, category, type, availableQuantity }) => {

  const ColorsType = {
    NonVeg: { text: 'text-red-500', bg: 'bg-red-100' },
    Veg: { text: 'text-[#388E3C]', bg: 'bg-[#a7fcab]' },
    Vegan: { text: 'text-[#00796B]', bg: 'bg-[#a0f2e8]' },
  };
  const ColorsCat = {
    Breakfast: { text: 'text-[#025fbd]', bg: 'bg-[#ace5fc]' },
    Lunch: { text: 'text-red-500', bg: 'bg-red-100' },
    Snack: { text: 'text-[#ff4d00]', bg: 'bg-[#fcdcac]' },
    Dinner: { text: 'text-[#388E3C]', bg: 'bg-[#a7fcab]' },
  };

  let categoryClass = '';
  let typeClass = '';

  if (ColorsCat[category]) {
    categoryClass = `${ColorsCat[category].text} ${ColorsCat[category].bg}`;
  } else {
    categoryClass = '';
  }

  if (ColorsType[type]) {
    typeClass = `${ColorsType[type].text} ${ColorsType[type].bg}`;
  } else {
    typeClass = '';
  }

  return (
    <div className='border border-gray-300 rounded p-4 shadow-md w-70 h-70'>
      <img
        src={image}
        alt={title}
        className='w-full h-32 object-cover mb-2'
      />
      <h3 className='text-lg font-semibold mb-2'>{title}</h3>
      {/* <p className='text-gray-600'>{description}</p> */}
      <div className='flex gap-2 mb-2'>
        <p className={`font-semibold text-sm px-2 py-0.5 rounded-2xl ${categoryClass}`}>{category}</p>
        <p className={`font-semibold text-sm px-2 py-0.5 rounded-2xl ${typeClass}`}>{type}</p>
      </div>
      <p className='text-gray-800 font-semibold'>Rs. {price}</p>
      {availableQuantity === 0 ? (
        <p className='text-red-500 font-semibold'>Out of Stock</p>
      ) : (
        <p className='text-gray-500 font-semibold'>Available Quantity: {availableQuantity}</p>
      )}
    </div>
  )
}

export default Card