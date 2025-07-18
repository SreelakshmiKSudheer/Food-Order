import React, { useState, useEffect } from 'react';
import API from '../api';

const BuyerHome = () => {
  const [orders, setOrders] = useState([]);
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    fetchTodayOrders();
  }, []);

  const fetchTodayOrders = async () => {
    try {
      const res = await API.get('/orders/today');
      const pendingOrders = res.data.filter(order => order.status !== 'completed');
      setOrders(pendingOrders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const handleOrder = async () => {
    if (!item || !quantity || !paymentMethod) {
      alert('Please fill all fields');
      return;
    }

    const paymentStatus = paymentMethod === 'on-time'; // true if paid, false if UPI

    try {
      await API.post('/orders', {
        item,
        quantity: parseInt(quantity),
        paymentMethod,
        paymentStatus,
      });
      setItem('');
      setQuantity(1);
      setPaymentMethod('');
      fetchTodayOrders(); // Refresh order list
    } catch (err) {
      console.error('Order creation failed:', err);
    }
  };

  return (
    <div>
      {/* Order Creation Section */}
      <div className="max-w-[80%] mx-auto mt-10 p-6 border border-gray-200 rounded-lg text-center">
        <h2 className="text-2xl font-semibold mb-6">What would you like to order today?</h2>
        <div className="mb-6 flex gap-3">
          <select
            value={item}
            onChange={(e) => setItem(e.target.value)}
            className="w-full py-2 px-4 border rounded mt-4 focus:outline-none focus:ring-2 focus:ring-amber-300"
          >
            <option value="">Select an option</option>
            <option value="meal">Meal</option>
            <option value="snack">Snack</option>
            <option value="chai">Chai</option>
          </select>

          <select
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full py-2 px-4 border rounded mt-4 focus:outline-none focus:ring-2 focus:ring-amber-300"
          >
            <option value="">No. of Orders</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full py-2 px-4 border rounded mt-4 focus:outline-none focus:ring-2 focus:ring-amber-300"
          >
            <option value="">Payment Method</option>
            <option value="upi">UPI</option>
            <option value="on-time">On-Time</option>
          </select>
        </div>
        <button
          onClick={handleOrder}
          className="mt-4 py-2 px-8 font-bold bg-amber-600 text-white rounded hover:bg-amber-700 transition"
        >
          Order
        </button>
      </div>

      {/* Orders List Section */}
      <div className="max-w-[80%] mx-auto mt-10 p-6 border border-gray-200 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Your Orders Today</h3>

        {orders.length === 0 ? (
          <p className="text-gray-500">No active orders for today.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {orders.map((order) => (
              <li key={order._id} className="py-3 flex justify-between">
                <span>{order.item} x{order.quantity}</span>
                <span className="text-gray-500">{order.paymentStatus ? 'Paid' : 'Pending'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BuyerHome;
