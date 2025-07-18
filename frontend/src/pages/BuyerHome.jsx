import React, { useState, useEffect } from 'react';
import API from '../api'; // Adjust path as needed

const BuyerHome = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchTodayOrders();
  }, []);

  const fetchTodayOrders = async () => {
    try {
      const res = await API.get('/orders/today');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  return (
    <div className="max-w-[80%] mx-auto mt-10 p-6 border border-gray-200 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Your Orders Today</h3>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders placed today.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {orders.map((order) => (
            <li key={order._id} className="py-3 flex justify-between">
              <span>{order.item} x1</span>
              <span className="text-gray-500">{order.paymentStatus}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BuyerHome;
