import { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import { Search, UserCheck, Edit, Trash2, Eye, MapPin, Calendar, CheckCircle2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

interface OrderItem {
  _id: string;
  userID: { name: string; email: string; phone?: string } | null;
  technicianId: { _id: string; name: string; phone?: string } | null;
  service: string;
  location: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
}

interface TechListItem {
  _id: string;
  name: string;
  phone: string;
  isSuspended: boolean;
}

export default function Orders() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<OrderItem | null>(null);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  
  const [assignModalOrder, setAssignModalOrder] = useState<OrderItem | null>(null);
  const [techList, setTechList] = useState<TechListItem[]>([]);
  const [loadingTechs, setLoadingTechs] = useState(false);

  const [statusModalOrder, setStatusModalOrder] = useState<OrderItem | null>(null);
  const [newStatus, setNewStatus] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get('/orders', {
        params: { search, status: statusFilter, page, limit: 10 },
      });
      if (res.data.success) {
        setOrders(res.data.orders);
        setPage(res.data.pagination.page);
        setPages(res.data.pagination.pages);
        setTotal(res.data.pagination.total);
      }
    } catch (err: any) {
      toast.error('فشل في تحميل قائمة الطلبات.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [page, search, statusFilter]);

  const loadTechnicians = async () => {
    try {
      setLoadingTechs(true);
      const res = await adminApi.get('/technicians', { params: { limit: 100 } });
      if (res.data.success) {
        setTechList(res.data.technicians);
      }
    } catch (err: any) {
      toast.error('فشل في تحميل قائمة الفنيين.');
    } finally {
      setLoadingTechs(false);
    }
  };

  const handleAssignTechnician = async (techId: string) => {
    if (!assignModalOrder) return;
    try {
      const res = await adminApi.patch(`/orders/${assignModalOrder._id}`, {
        technicianId: techId || null,
      });
      if (res.data.success) {
        toast.success(techId ? 'تم تعيين الفني للطلب بنجاح' : 'تم إلغاء تعيين الفني عن الطلب');
        setAssignModalOrder(null);
        fetchOrders();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'فشل في تعيين الفني.');
    }
  };

  const handleUpdateStatus = async () => {
    if (!statusModalOrder || !newStatus) return;
    try {
      const res = await adminApi.patch(`/orders/${statusModalOrder._id}`, {
        status: newStatus,
      });
      if (res.data.success) {
        toast.success('تم تحديث حالة الطلب بنجاح');
        setStatusModalOrder(null);
        fetchOrders();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'فشل في تحديث حالة الطلب.');
    }
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    try {
      const res = await adminApi.delete(`/orders/${orderToDelete._id}`);
      if (res.data.success) {
        toast.success('تم حذف الطلب بنجاح');
        setOrderToDelete(null);
        fetchOrders();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'فشل في حذف الطلب.');
    }
  };

  const handleDeleteAllOrders = async () => {
    try {
      const res = await adminApi.delete('/orders/all');
      if (res.data.success) {
        toast.success('تم حذف جميع الطلبات بنجاح');
        setIsDeleteAllModalOpen(false);
        fetchOrders();
      }
    } catch (err: any) {
      toast.error('فشل في حذف جميع الطلبات.');
    }
  };

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

  const openAssignModal = (order: OrderItem) => {
    setAssignModalOrder(order);
    loadTechnicians();
  };

  const openStatusModal = (order: OrderItem) => {
    setStatusModalOrder(order);
    setNewStatus(order.status);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header, Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-right flex items-center gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">إدارة الطلبات</h1>
            <p className="text-sm text-slate-400">متابعة طلبات الصيانة، تعيين الفنيين، وتحديث حالة الطلبات.</p>
          </div>
          {orders.length > 0 && (
            <button
              onClick={() => setIsDeleteAllModalOpen(true)}
              className="bg-rose-600 hover:bg-rose-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition cursor-pointer"
            >
              حذف جميع الطلبات
            </button>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right"
          >
            <option value="">جميع الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="accepted">تم القبول</option>
            <option value="in-progress">قيد التنفيذ</option>
            <option value="completed">مكتمل</option>
            <option value="cancelled">ملغي</option>
          </select>

          {/* Search bar */}
          <div className="relative w-full sm:w-64 md:w-80">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-505">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="ابحث بالخدمة، اسم العميل، العنوان..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pr-10 pl-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-550 focus:border-indigo-550 text-white placeholder-slate-500 text-sm focus:outline-none transition-all duration-200 text-right"
            />
          </div>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-right">
        {loading ? (
          <div className="px-6 py-12 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-805/60 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-500">لم يتم العثور على نتائج مطابقة للبحث.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm text-slate-350" dir="rtl">
                <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-slate-800">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-right">العميل</th>
                    <th scope="col" className="px-6 py-4 text-right">الخدمة</th>
                    <th scope="col" className="px-6 py-4 text-right">الموقع</th>
                    <th scope="col" className="px-6 py-4 text-right">الفني</th>
                    <th scope="col" className="px-6 py-4 text-right">الحالة</th>
                    <th scope="col" className="px-6 py-4 text-left">العمليات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{order.userID?.name || 'غير معروف'}</div>
                        <div className="text-xs text-slate-505">{order.userID?.phone || 'لا يوجد هاتف'}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-200">{order.service}</td>
                      <td className="px-6 py-4 truncate max-w-xs">{order.location}</td>
                      <td className="px-6 py-4">
                        {order.technicianId ? (
                          <div>
                            <div className="font-medium text-slate-200">{order.technicianId.name}</div>
                            <div className="text-xs text-slate-505">{order.technicianId.phone || ''}</div>
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
                      <td className="px-6 py-4 text-left space-x-1 flex-row-reverse">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-indigo-400 hover:text-indigo-305 p-2 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                          title="عرض التفاصيل"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => openAssignModal(order)}
                          className="text-cyan-400 hover:text-cyan-300 p-2 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                          title="تعيين فني"
                        >
                          <UserCheck size={15} />
                        </button>
                        <button
                          onClick={() => openStatusModal(order)}
                          className="text-purple-400 hover:text-purple-300 p-2 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                          title="تعديل الحالة"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => setOrderToDelete(order)}
                          className="text-rose-405 hover:text-rose-350 p-2 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                          title="حذف الطلب"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-800 flex items-center justify-between flex-row-reverse">
                <span className="text-xs text-slate-505">
                  عرض الصفحة {page} من {pages} (إجمالي {total} طلب)
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-855 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white transition disabled:opacity-40 disabled:hover:bg-slate-850 disabled:cursor-not-allowed text-xs font-semibold cursor-pointer"
                  >
                    السابق
                  </button>
                  <button
                    disabled={page === pages}
                    onClick={() => setPage(page + 1)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-855 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white transition disabled:opacity-40 disabled:hover:bg-slate-850 disabled:cursor-not-allowed text-xs font-semibold cursor-pointer"
                  >
                    التالي
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-850 border-b border-slate-850 flex items-center justify-between flex-row-reverse">
              <h3 className="font-bold text-white text-lg">تفاصيل الطلب</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4 text-right">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider block">معرف الطلب (ID)</label>
                  <p className="text-sm font-mono text-slate-300 truncate">{selectedOrder._id}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-505 block">تاريخ الطلب</label>
                  <p className="text-sm text-slate-300 flex items-center justify-end gap-1.5">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    <Calendar size={14} className="text-slate-400" />
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-505 block">الخدمة المطلوبة</label>
                <p className="text-sm font-semibold text-white">{selectedOrder.service}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-850 pt-3">
                <div>
                  <label className="text-xs text-slate-505 block">بيانات العميل</label>
                  <p className="text-sm font-medium text-white">{selectedOrder.userID?.name || 'غير معروف'}</p>
                  <p className="text-xs text-slate-500">{selectedOrder.userID?.phone || 'لا يوجد هاتف'}</p>
                  <p className="text-xs text-slate-505">{selectedOrder.userID?.email || ''}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-505 block">بيانات الفني</label>
                  {selectedOrder.technicianId ? (
                    <div>
                      <p className="text-sm font-medium text-white">{selectedOrder.technicianId.name}</p>
                      <p className="text-xs text-slate-550">{selectedOrder.technicianId.phone || ''}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">غير معين</p>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-850 pt-3">
                <label className="text-xs text-slate-505 block">موقع طلب الخدمة</label>
                <p className="text-sm text-slate-300 flex items-start gap-1.5 mt-1">
                  <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>{selectedOrder.location}</span>
                </p>
              </div>

              <div className="border-t border-slate-850 pt-3 flex items-center justify-between flex-row-reverse">
                <span className="text-xs text-slate-500">حالة الطلب</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusLabelArabic(selectedOrder.status)}
                </span>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-850 flex gap-2 flex-row-reverse">
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  openAssignModal(selectedOrder);
                }}
                className="flex-1 py-2 bg-cyan-600/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-600 hover:text-white rounded-xl text-sm font-semibold transition cursor-pointer"
              >
                تعيين فني
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-805 text-slate-300 hover:bg-slate-700 hover:text-white rounded-xl text-sm font-semibold transition cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Technician Modal */}
      {assignModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-855 border-b border-slate-850 flex items-center justify-between flex-row-reverse">
              <h3 className="font-bold text-white text-lg">تعيين فني للطلب</h3>
              <button onClick={() => setAssignModalOrder(null)} className="text-slate-400 hover:text-white font-semibold cursor-pointer">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto text-right">
              <p className="text-xs text-slate-400">
                اختر فني لتعيينه للطلب <span className="font-semibold text-slate-200">#{assignModalOrder._id.slice(-6)}</span> ({assignModalOrder.service}):
              </p>
              {loadingTechs ? (
                <div className="flex justify-center py-6">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : techList.length === 0 ? (
                <p className="text-sm text-slate-500 italic text-center">لا يوجد فنيون مسجلون في النظام حالياً.</p>
              ) : (
                <div className="space-y-2">
                  {/* Option to Unassign */}
                  {assignModalOrder.technicianId && (
                    <button
                      onClick={() => handleAssignTechnician('')}
                      className="w-full text-right px-4 py-3 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500 hover:text-white text-rose-400 hover:border-transparent transition text-xs font-semibold flex items-center justify-between flex-row-reverse cursor-pointer"
                    >
                      <span>إلغاء تعيين الفني الحالي</span>
                      <span>إلغاء التعيين</span>
                    </button>
                  )}

                  {techList.map((tech) => (
                    <button
                      key={tech._id}
                      disabled={tech.isSuspended}
                      onClick={() => handleAssignTechnician(tech._id)}
                      className={`w-full text-right px-4 py-3 rounded-xl border transition flex items-center justify-between flex-row-reverse cursor-pointer ${
                        assignModalOrder.technicianId?._id === tech._id
                          ? 'border-indigo-550 bg-indigo-500/10 text-white font-semibold'
                          : 'border-slate-800 bg-slate-950/40 hover:bg-slate-800 text-slate-300 hover:text-white'
                      } ${tech.isSuspended ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      <div>
                        <p className="text-sm">{tech.name}</p>
                        <p className="text-xs text-slate-505">{tech.phone}</p>
                      </div>
                      {tech.isSuspended && <span className="text-xs text-rose-500 font-semibold">موقوف مؤقتاً</span>}
                      {assignModalOrder.technicianId?._id === tech._id && <CheckCircle2 size={16} className="text-indigo-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-850 text-left">
              <button
                onClick={() => setAssignModalOrder(null)}
                className="px-4 py-2 bg-slate-800 text-slate-350 hover:bg-slate-700 hover:text-white rounded-xl text-sm font-semibold transition cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Status Modal */}
      {statusModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-855 border-b border-slate-850 flex items-center justify-between flex-row-reverse">
              <h3 className="font-bold text-white text-lg">تحديث حالة الطلب</h3>
              <button onClick={() => setStatusModalOrder(null)} className="text-slate-400 hover:text-white font-semibold cursor-pointer">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4 text-right">
              <div>
                <label className="text-xs text-slate-505 uppercase block mb-2">اختر الحالة الجديدة</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right"
                >
                  <option value="pending">قيد الانتظار</option>
                  <option value="accepted">تم القبول</option>
                  <option value="in-progress">قيد التنفيذ</option>
                  <option value="completed">مكتمل</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-850 flex gap-3 flex-row-reverse">
              <button
                onClick={() => setStatusModalOrder(null)}
                className="flex-1 py-2 bg-slate-850 text-slate-350 hover:bg-slate-700 hover:text-white rounded-xl text-sm font-semibold transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleUpdateStatus}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-sm font-semibold transition cursor-pointer"
              >
                حفظ الحالة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-500">
                <ShieldAlert size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">حذف الطلب؟</h3>
                <p className="text-xs text-slate-400">
                  هل أنت متأكد من رغبتك في حذف الطلب <span className="font-semibold text-slate-200">#{orderToDelete._id.slice(-6)}</span> نهائياً؟ لا يمكن التراجع عن هذا الإجراء.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-850 flex gap-3 flex-row-reverse">
              <button
                onClick={() => setOrderToDelete(null)}
                className="flex-1 py-2 px-4 bg-slate-805 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-semibold rounded-xl transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteOrder}
                className="flex-1 py-2 px-4 bg-rose-600 hover:bg-rose-505 text-white text-sm font-semibold rounded-xl transition cursor-pointer"
              >
                حذف الطلب
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Confirmation Dialog */}
      {isDeleteAllModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-505/25 flex items-center justify-center text-rose-500">
                <ShieldAlert size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">حذف جميع الطلبات؟</h3>
                <p className="text-xs text-slate-400">
                  هل أنت متأكد من رغبتك في حذف جميع الطلبات نهائياً؟ سيتم مسح كافة سجلات الطلبات المضافة ولا يمكن التراجع عن هذا الإجراء.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-850 flex gap-3 flex-row-reverse">
              <button
                onClick={() => setIsDeleteAllModalOpen(false)}
                className="flex-1 py-2 px-4 bg-slate-805 hover:bg-slate-750 text-slate-300 hover:text-white text-sm font-semibold rounded-xl transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteAllOrders}
                className="flex-1 py-2 px-4 bg-rose-600 hover:bg-rose-505 text-white text-sm font-semibold rounded-xl transition cursor-pointer"
              >
                حذف الكل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
