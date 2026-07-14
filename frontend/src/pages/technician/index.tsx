import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaClipboardList, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import {
  acceptOrder,
  getAvailableOrders,
  getMyOrders,
  updateOrderStatus,
} from '../../services/orders';

type Order = {
  _id: string;
  service: string;
  location: string;
  status: string;
  user?: { name: string; phone: string };
  createdAt: string;
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'قيد الانتظار',
  accepted: 'مقبول',
  'in-progress': 'جارٍ التنفيذ',
  completed: 'مكتمل',
  cancelled: 'ملغي',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-blue-100 text-blue-700',
  'in-progress': 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const NEXT_STATUS: Record<string, string> = {
  accepted: 'in-progress',
  'in-progress': 'completed',
};

export default function TechnicianDashboard() {
  const [tab, setTab] = useState<'available' | 'my'>('available');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = tab === 'available' ? await getAvailableOrders() : await getMyOrders();
      setOrders(res.data.orders ?? res.data);
    } catch {
      toast.error('فشل تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [tab]);

  const handleAccept = async (orderId: string) => {
    setActionId(orderId);
    try {
      await acceptOrder(orderId);
      toast.success('تم قبول الطلب');
      fetchOrders();
    } catch {
      toast.error('فشل قبول الطلب');
    } finally {
      setActionId(null);
    }
  };

  const handleStatusUpdate = async (orderId: string, currentStatus: string) => {
    const next = NEXT_STATUS[currentStatus];
    if (!next) return;
    setActionId(orderId);
    try {
      await updateOrderStatus(orderId, next);
      toast.success(`تم تحديث الحالة إلى: ${STATUS_LABELS[next]}`);
      fetchOrders();
    } catch {
      toast.error('فشل تحديث الحالة');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F7FF] p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <img src="/logo.png" alt="صيانتك" className="w-12 h-12 object-contain" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">لوحة تحكم الفني</h1>
          <p className="text-gray-500 text-sm">إدارة طلبات الصيانة</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTab('available')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition ${
            tab === 'available' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
          }`}
        >
          <FaMapMarkerAlt />
          الطلبات المتاحة
        </button>
        <button
          onClick={() => setTab('my')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition ${
            tab === 'my' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
          }`}
        >
          <FaClipboardList />
          طلباتي
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <FaSpinner className="animate-spin text-blue-600 text-3xl" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-400 mt-20 text-lg">لا توجد طلبات</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              tab={tab}
              actionId={actionId}
              onAccept={handleAccept}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type CardProps = {
  order: Order;
  tab: 'available' | 'my';
  actionId: string | null;
  onAccept: (id: string) => void;
  onStatusUpdate: (id: string, status: string) => void;
};

function OrderCard({ order, tab, actionId, onAccept, onStatusUpdate }: CardProps) {
  const isLoading = actionId === order._id;
  const nextStatus = NEXT_STATUS[order.status];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      {/* Service & Status */}
      <div className="flex justify-between items-start">
        <span className="text-lg font-bold text-slate-800">{order.service}</span>
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}
        >
          {STATUS_LABELS[order.status] ?? order.status}
        </span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-gray-500 text-sm" dir="rtl">
        <FaMapMarkerAlt className="text-blue-500 shrink-0" />
        <span className="truncate">{order.location}</span>
      </div>

      {/* User info (only in my orders) */}
      {tab === 'my' && order.user && (
        <div className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3" dir="rtl">
          <p>
            العميل: <span className="font-medium">{order.user.name}</span>
          </p>
          <p>
            الجوال: <span className="font-medium">{order.user.phone}</span>
          </p>
        </div>
      )}

      {/* Date */}
      <p className="text-xs text-gray-400 text-right">
        {new Date(order.createdAt).toLocaleDateString('ar-SA')}
      </p>

      {/* Actions */}
      {tab === 'available' && order.status === 'pending' && (
        <button
          onClick={() => onAccept(order._id)}
          disabled={isLoading}
          className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
          قبول الطلب
        </button>
      )}

      {tab === 'my' && nextStatus && (
        <button
          onClick={() => onStatusUpdate(order._id, order.status)}
          disabled={isLoading}
          className="w-full py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
          تحديث إلى: {STATUS_LABELS[nextStatus]}
        </button>
      )}
    </div>
  );
}
