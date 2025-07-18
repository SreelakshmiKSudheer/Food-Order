import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminHome = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:3000/api/orders/todayIncomplete', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Extra safety: Filter only incomplete orders on client-side
                const incomplete = res.data.orders?.filter(order => order.orderStatus !== 'Completed');
                setOrders(incomplete || []);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
            }
        };

        fetchOrders();
    }, []);

    const handleComplete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:3000/api/orders/${id}/serve`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Remove the completed order from the list
            setOrders((prev) => prev.filter((order) => order._id !== id));
        } catch (err) {
            console.error(`Failed to complete order #${id}:`, err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-10">
            <h2 className="text-3xl font-bold mb-6 text-center text-amber-700">Today's Incomplete Orders</h2>
            <ul className="max-w-4xl mx-auto space-y-3">
                {orders.length === 0 ? (
                    <p className="text-center text-gray-500">No incomplete orders for today.</p>
                ) : (
                    orders.map((order) => (
                        <li key={order._id}>
                            <div
                                className={`flex justify-between items-center border rounded px-4 py-3 cursor-pointer transition-colors ${
                                    selectedOrder === order._id
                                        ? 'bg-amber-50 border-amber-400'
                                        : 'bg-white border-gray-300 hover:bg-gray-100'
                                }`}
                                onClick={() => setSelectedOrder(order._id)}
                            >
                                {/* Left: Items and total quantity */}
                                <div className="flex flex-col">
                                    <div className="font-medium">
                                        {order.items?.map((item, index) => (
                                            <span key={index}>
                                                {item.quantity}x {item.item?.name}
                                                {index < order.items.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Total items: {order.items?.reduce((sum, item) => sum + item.quantity, 0)}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                        <div className="font-semibold">{order.user?.username}</div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(order.createdAt).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </div>
                                    </div>
                                    <button
                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleComplete(order._id);
                                        }}
                                    >
                                        Complete
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default AdminHome;
