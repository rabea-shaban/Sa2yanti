import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaClipboardList } from 'react-icons/fa';
import axiosInstance from '../../services/Api';
import type { Order } from '../../types';
import OrderCard from './OrderCard';

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get('/orders')
      .then((res) => setOrders(res.data.orders ?? []))
      .catch(() => toast.error('فشل تحميل الطلبات'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="min-h-screen bg-slate-50 py-8 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">طلباتي</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaClipboardList className="text-3xl text-gray-400" />
            </div>
            <p className="text-gray-500">لا توجد طلبات بعد</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Orders;
