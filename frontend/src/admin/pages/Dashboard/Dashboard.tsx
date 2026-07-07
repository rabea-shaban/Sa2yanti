import { useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import {
  Users,
  Wrench,
  ShoppingBag,
  Clock,
  CheckCircle,
  FileSpreadsheet,
  Eye,
  Calendar,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalUsers: number;
  totalTechnicians: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalServices: number;
}

interface OrderItem {
  _id: string;
  userID: { name: string; email: string; phone?: string } | null;
  technicianId: { name: string; phone?: string } | null;
  service: string;
  location: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get('/dashboard');
      if (res.data.success) {
        setStats(res.data.stats);
        setRecentOrders(res.data.recentOrders);
      }
    } catch (err: any) {
      toast.error('فشل في تحميل بيانات لوحة التحكم.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'accepted':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'in-progress':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'cancelled':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  const getStatusLabelArabic = (status: string) => {
    switch (status) {
      case 'pending':
        return 'قيد الانتظار';
      case 'accepted':
        return 'تم القبول';
      case 'in-progress':
        return 'قيد التنفيذ';
      case 'completed':
        return 'مكتمل';
      case 'cancelled':
        return 'ملغي';
      default:
        return 'غير معروف';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6" dir="rtl">
        <h1 className="text-2xl font-bold text-white text-right">لوحة التحكم الرئيسية</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-900/60 rounded-2xl animate-pulse border border-slate-800" />
          ))}
        </div>
        <div className="h-64 bg-slate-900/60 rounded-2xl animate-pulse border border-slate-800" />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-right">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">لوحة التحكم</h1>
          <p className="text-sm text-slate-400">نظرة عامة على نشاط المنصة والإحصائيات السريعة.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center justify-center gap-2 bg-indigo-600/10 text-indigo-400 border border-indigo-500/25 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-600 hover:text-white transition-all duration-200 cursor-pointer"
        >
          تحديث البيانات
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-right">
        {/* Total Users */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-200 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-sm text-slate-400 font-medium">إجمالي العملاء</span>
            <h3 className="text-3xl font-bold text-white">{stats?.totalUsers || 0}</h3>
            <div className="flex items-center gap-1.5 text-xs text-indigo-400">
              <TrendingUp size={14} />
              <span>عملاء مسجلين بالمنصة</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Users size={22} />
          </div>
        </div>

        {/* Total Technicians */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-200 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-sm text-slate-400 font-medium">إجمالي الفنيين</span>
            <h3 className="text-3xl font-bold text-white">{stats?.totalTechnicians || 0}</h3>
            <div className="flex items-center gap-1.5 text-xs text-cyan-400">
              <TrendingUp size={14} />
              <span>مقدمي الخدمات النشطين</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Wrench size={22} />
          </div>
        </div>

        {/* Total Services */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-200 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-sm text-slate-400 font-medium">إجمالي الخدمات المتاحة</span>
            <h3 className="text-3xl font-bold text-white">{stats?.totalServices || 0}</h3>
            <div className="flex items-center gap-1.5 text-xs text-pink-400">
              <FileSpreadsheet size={14} />
              <span>خدمة نشطة بالنظام</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-pink-600/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <FileSpreadsheet size={22} />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-200 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-sm text-slate-400 font-medium">إجمالي الطلبات</span>
            <h3 className="text-3xl font-bold text-white">{stats?.totalOrders || 0}</h3>
            <div className="text-xs text-slate-500">إجمالي طلبات الصيانة المقدمة</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
            <ShoppingBag size={22} />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-200 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-sm text-slate-400 font-medium">الطلبات قيد الانتظار</span>
            <h3 className="text-3xl font-bold text-amber-500">{stats?.pendingOrders || 0}</h3>
            <div className="text-xs text-amber-500/80">طلبات بانتظار تعيين فني</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock size={22} />
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-200 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-sm text-slate-400 font-medium">الطلبات المكتملة</span>
            <h3 className="text-3xl font-bold text-emerald-500">{stats?.completedOrders || 0}</h3>
            <div className="text-xs text-emerald-550/80">طلبات تم إنجازها بنجاح</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle size={22} />
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl text-right">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between flex-row-reverse">
          <h2 className="text-lg font-bold text-white">الطلبات الأخيرة</h2>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 text-slate-400 rounded-lg">
            آخر 5 طلبات مسجلة
          </span>
        </div>

        <div className="overflow-x-auto">
          {recentOrders.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-500">لا توجد طلبات مسجلة في النظام حالياً.</div>
          ) : (
            <table className="w-full text-right text-sm text-slate-350" dir="rtl">
              <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-slate-800">
                <tr>
                  <th scope="col" className="px-6 py-4 text-right">العميل</th>
                  <th scope="col" className="px-6 py-4 text-right">الخدمة المطلوبة</th>
                  <th scope="col" className="px-6 py-4 text-right">الموقع</th>
                  <th scope="col" className="px-6 py-4 text-right">الفني</th>
                  <th scope="col" className="px-6 py-4 text-right">حالة الطلب</th>
                  <th scope="col" className="px-6 py-4 text-left">التفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{order.userID?.name || 'مستخدم غير معروف'}</div>
                      <div className="text-xs text-slate-500">{order.userID?.phone || 'لا يوجد هاتف'}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-200">{order.service}</td>
                    <td className="px-6 py-4 truncate max-w-xs">{order.location}</td>
                    <td className="px-6 py-4 text-slate-300">
                      {order.technicianId ? (
                        <div>
                          <div className="font-medium text-slate-200">{order.technicianId.name}</div>
                          <div className="text-xs text-slate-500">{order.technicianId.phone || ''}</div>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-xs">غير معين</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusLabelArabic(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-left">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-indigo-400 hover:text-indigo-300 p-1.5 hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                        title="تفاصيل الطلب"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-880 border-b border-slate-700 flex items-center justify-between flex-row-reverse">
              <h3 className="font-bold text-white text-lg">تفاصيل الطلب</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-right">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider block">معرف الطلب (ID)</label>
                  <p className="text-sm font-mono text-slate-350 truncate">{selectedOrder._id}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block">تاريخ الطلب</label>
                  <p className="text-sm text-slate-350 flex items-center justify-end gap-1.5">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    <Calendar size={14} className="text-slate-400" />
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-850 pt-3">
                <label className="text-xs text-slate-505 block">الخدمة المطلوبة</label>
                <p className="text-sm font-semibold text-white">{selectedOrder.service}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-850 pt-3">
                <div>
                  <label className="text-xs text-slate-500 block">بيانات العميل</label>
                  <p className="text-sm text-slate-350 font-semibold">{selectedOrder.userID?.name || 'غير معروف'}</p>
                  <p className="text-xs text-slate-500">{selectedOrder.userID?.email || ''}</p>
                  <p className="text-xs text-slate-500">{selectedOrder.userID?.phone || ''}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block">بيانات الفني</label>
                  {selectedOrder.technicianId ? (
                    <div>
                      <p className="text-sm text-slate-350 font-semibold">{selectedOrder.technicianId.name}</p>
                      <p className="text-xs text-slate-500">{selectedOrder.technicianId.phone || ''}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-505 italic">لم يتم تعيين فني للطلب</p>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-850 pt-3">
                <label className="text-xs text-slate-500 block">موقع طلب الخدمة</label>
                <p className="text-sm text-slate-350 flex items-start gap-1.5 mt-1">
                  <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                  <span>{selectedOrder.location}</span>
                </p>
              </div>

              <div className="border-t border-slate-850 pt-3 flex items-center justify-between flex-row-reverse">
                <span className="text-xs text-slate-505">حالة الطلب الحالية</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusLabelArabic(selectedOrder.status)}
                </span>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-850 text-left">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-slate-805 text-slate-300 hover:bg-slate-700 hover:text-white transition cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
