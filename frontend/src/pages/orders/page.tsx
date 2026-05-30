import { useEffect, useState } from 'react';
import axiosInstance from '../../services/Api';
import type { Order } from '../../types';
import OrderCard from './OrderCard';

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const getOrder = async () => {
      const res = await axiosInstance.get('orders');
      console.log(res.data.orders);
      setOrders(res.data.orders);
    };
    getOrder();
  }, []);

  return (
    <section className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">طلباتي</h1>

          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Orders;
