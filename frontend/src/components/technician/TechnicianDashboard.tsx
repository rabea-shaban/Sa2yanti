import {
  Battery,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Search,
  User,
  Wrench,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import useAuth from '../../hooks/useAuth';
import {
  acceptOrder,
  getAvailableOrders,
  getMyJobs,
  updateOrderStatus,
} from '../../services/orders';

type Order = {
  _id: string;
  service: string;
  location: string;
  status: string;
  userID?: { name: string; phone: string };
  createdAt: string;
};

const SERVICE_ICONS: Record<string, typeof Wrench> = {
  'تغيير زيت': Wrench,
  بطارية: Battery,
  'كشف أعطال': Search,
};

const STATUS_BADGE: Record<string, string> = {
  accepted: 'bg-blue-100 text-blue-700',
  'in-progress': 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
};

const STATUS_LABEL: Record<string, string> = {
  accepted: 'مقبول',
  'in-progress': 'جارٍ التنفيذ',
  completed: 'مكتمل',
  cancelled: 'ملغي',
  pending: 'قيد الانتظار',
};

const NEXT_STATUS: Record<string, { status: string; label: string }> = {
  accepted: { status: 'in-progress', label: 'بدء التنفيذ' },
  'in-progress': { status: 'completed', label: 'تم الانتهاء' },
};

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function TechnicianDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<'available' | 'my'>('available');
  const [available, setAvailable] = useState<Order[]>([]);
  const [myJobs, setMyJobs] = useState<Order[]>([]);
  const [loadingAvailable, setLoadingAvailable] = useState(true);
  const [loadingMy, setLoadingMy] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    getAvailableOrders()
      .then((r) => setAvailable(r.data.orders ?? r.data))
      .catch(() => toast.error('فشل تحميل الطلبات المتاحة'))
      .finally(() => setLoadingAvailable(false));

    getMyJobs()
      .then((r) => setMyJobs(r.data.orders ?? r.data))
      .catch(() => toast.error('فشل تحميل طلباتي'))
      .finally(() => setLoadingMy(false));
  }, []);

  const handleAccept = async (orderId: string) => {
    setActionId(orderId);
    try {
      await acceptOrder(orderId);
      const accepted = available.find((o) => o._id === orderId);
      if (accepted) {
        setAvailable((prev) => prev.filter((o) => o._id !== orderId));
        setMyJobs((prev) => [{ ...accepted, status: 'accepted' }, ...prev]);
      }
      toast.success('تم قبول الطلب ✓');
      setTab('my');
    } catch {
      toast.error('فشل قبول الطلب');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (orderId: string) => {
    setActionId(orderId);
    try {
      await updateOrderStatus(orderId, 'cancelled');
      setAvailable((prev) => prev.filter((o) => o._id !== orderId));
      toast.success('تم رفض الطلب');
    } catch {
      toast.error('فشل رفض الطلب');
    } finally {
      setActionId(null);
    }
  };

  const handleStatusUpdate = async (orderId: string, nextStatus: string) => {
    setActionId(orderId);
    try {
      await updateOrderStatus(orderId, nextStatus);
      setMyJobs((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: nextStatus } : o)));
      toast.success(`تم التحديث: ${STATUS_LABEL[nextStatus]}`);
    } catch {
      toast.error('فشل تحديث الحالة');
    } finally {
      setActionId(null);
    }
  };

  const activeJobs = myJobs.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');
  const doneJobs = myJobs.filter((o) => o.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      {/* <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900">{user?.name || 'الفني'}</p>
              <p className="text-xs text-gray-500">فني صيانة</p>
            </div>
          </div>
          <button
            onClick={async () => { await logout(); navigate('/'); }}
            className="flex items-center gap-1.5 text-red-500 hover:text-red-600 text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            خروج
          </button>
        </div>
      </header> */}

      {/* Tabs */}
      <div className="max-w-3xl mx-auto px-4 pt-5">
        <div className="flex bg-white rounded-2xl p-1 shadow-sm">
          <button
            onClick={() => setTab('available')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${
              tab === 'available' ? 'bg-blue-600 text-white shadow' : 'text-gray-500'
            }`}
          >
            الطلبات المتاحة
            {!loadingAvailable && available.length > 0 && (
              <span
                className={`mr-1.5 px-2 py-0.5 rounded-full text-xs ${tab === 'available' ? 'bg-white/20' : 'bg-blue-100 text-blue-600'}`}
              >
                {available.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('my')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${
              tab === 'my' ? 'bg-blue-600 text-white shadow' : 'text-gray-500'
            }`}
          >
            طلباتي
            {!loadingMy && activeJobs.length > 0 && (
              <span
                className={`mr-1.5 px-2 py-0.5 rounded-full text-xs ${tab === 'my' ? 'bg-white/20' : 'bg-blue-100 text-blue-600'}`}
              >
                {activeJobs.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-5 space-y-4">
        {/* ── Available Tab ── */}
        {tab === 'available' &&
          (loadingAvailable ? (
            <Spinner />
          ) : available.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Wrench className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500">لا توجد طلبات متاحة حالياً</p>
            </div>
          ) : (
            available.map((order) => {
              const Icon = SERVICE_ICONS[order.service] ?? Wrench;
              const busy = actionId === order._id;
              return (
                <div key={order._id} className="bg-white rounded-2xl shadow-sm p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{order.service}</h3>
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{order.location}</span>
                      </div>
                      {order.userID && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                          <User className="w-3.5 h-3.5" />
                          <span>{order.userID.name}</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAccept(order._id)}
                          disabled={!!actionId}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {busy ? 'جاري القبول...' : 'قبول'}
                        </button>
                        <button
                          onClick={() => handleReject(order._id)}
                          disabled={!!actionId}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-red-100 hover:bg-red-50 text-red-500 text-sm font-medium transition disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                          {busy ? '...' : 'رفض'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ))}

        {/* ── My Jobs Tab ── */}
        {tab === 'my' &&
          (loadingMy ? (
            <Spinner />
          ) : (
            <>
              {/* Active */}
              {activeJobs.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-3">
                    الطلبات النشطة ({activeJobs.length})
                  </p>
                  <div className="space-y-4">
                    {activeJobs.map((order) => {
                      const Icon = SERVICE_ICONS[order.service] ?? Wrench;
                      const next = NEXT_STATUS[order.status];
                      const busy = actionId === order._id;
                      return (
                        <div
                          key={order._id}
                          className="bg-white rounded-2xl shadow-sm p-5 border-r-4 border-blue-500"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                              <Icon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-gray-900">{order.service}</h3>
                                <span
                                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGE[order.status]}`}
                                >
                                  {STATUS_LABEL[order.status]}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-1">
                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{order.location}</span>
                              </div>
                              {order.userID && (
                                <>
                                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-1">
                                    <User className="w-3.5 h-3.5" />
                                    <span>{order.userID.name}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                                    <Phone className="w-3.5 h-3.5" />
                                    <a
                                      href={`tel:${order.userID.phone}`}
                                      className="text-blue-600 hover:underline font-medium"
                                    >
                                      {order.userID.phone}
                                    </a>
                                  </div>
                                </>
                              )}
                              <div className="flex gap-2">
                                {next && (
                                  <button
                                    onClick={() => handleStatusUpdate(order._id, next.status)}
                                    disabled={busy}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition disabled:opacity-50"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    {busy ? 'جاري التحديث...' : next.label}
                                  </button>
                                )}
                                {order.userID?.phone && (
                                  <a
                                    href={`tel:${order.userID.phone}`}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium transition"
                                  >
                                    <Phone className="w-4 h-4" />
                                    تواصل مع العميل
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Done */}
              {doneJobs.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-3">
                    المكتملة ({doneJobs.length})
                  </p>
                  <div className="space-y-3">
                    {doneJobs.map((order) => {
                      const Icon = SERVICE_ICONS[order.service] ?? Wrench;
                      return (
                        <div
                          key={order._id}
                          className="bg-white rounded-2xl shadow-sm p-5 opacity-70"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                              <Icon className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">{order.service}</h3>
                                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-green-100 text-green-700">
                                  مكتمل
                                </span>
                              </div>
                              {order.userID && (
                                <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                                  <User className="w-3.5 h-3.5" />
                                  <span>{order.userID.name}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                                <Clock className="w-3 h-3" />
                                <span>{new Date(order.createdAt).toLocaleDateString('ar-SA')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeJobs.length === 0 && doneJobs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500">لم تقبل أي طلبات بعد</p>
                </div>
              )}
            </>
          ))}
      </main>
    </div>
  );
}
