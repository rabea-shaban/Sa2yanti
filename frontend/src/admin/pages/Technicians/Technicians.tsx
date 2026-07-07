import { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import { Search, Ban, CheckCircle, Trash2, Eye, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

interface TechItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isSuspended: boolean;
  createdAt: string;
}

export default function Technicians() {
  const [techs, setTechs] = useState<TechItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [selectedTech, setSelectedTech] = useState<TechItem | null>(null);
  const [techToDelete, setTechToDelete] = useState<TechItem | null>(null);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);

  const fetchTechs = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get('/technicians', {
        params: { search, page, limit: 10 },
      });
      if (res.data.success) {
        setTechs(res.data.technicians);
        setPage(res.data.pagination.page);
        setPages(res.data.pagination.pages);
        setTotal(res.data.pagination.total);
      }
    } catch (err: any) {
      toast.error('فشل في تحميل قائمة الفنيين.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    fetchTechs();
  }, [page, search]);

  const handleSuspendToggle = async (tech: TechItem) => {
    const action = tech.isSuspended ? 'activate' : 'suspend';
    try {
      const res = await adminApi.patch(`/technicians/${tech._id}/${action}`);
      if (res.data.success) {
        toast.success(tech.isSuspended ? 'تم تنشيط حساب الفني بنجاح' : 'تم إيقاف حساب الفني بنجاح');
        setTechs(techs.map((t) => (t._id === tech._id ? { ...t, isSuspended: !tech.isSuspended } : t)));
        if (selectedTech && selectedTech._id === tech._id) {
          setSelectedTech({ ...selectedTech, isSuspended: !tech.isSuspended });
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'فشل في تعديل حالة حساب الفني.');
    }
  };

  const handleDeleteTech = async () => {
    if (!techToDelete) return;
    try {
      const res = await adminApi.delete(`/technicians/${techToDelete._id}`);
      if (res.data.success) {
        toast.success('تم حذف حساب الفني بنجاح');
        setTechToDelete(null);
        fetchTechs();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'فشل في حذف حساب الفني.');
    }
  };

  const handleDeleteAllTechs = async () => {
    try {
      const res = await adminApi.delete('/technicians/all');
      if (res.data.success) {
        toast.success('تم حذف جميع الفنيين بنجاح');
        setIsDeleteAllModalOpen(false);
        fetchTechs();
      }
    } catch (err: any) {
      toast.error('فشل في حذف جميع الفنيين.');
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-right flex items-center gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">إدارة الفنيين</h1>
            <p className="text-sm text-slate-400">عرض حسابات الفنيين المسجلين، والتحكم في حالة الحساب (إيقاف مؤقت/تنشيط).</p>
          </div>
          {techs.length > 0 && (
            <button
              onClick={() => setIsDeleteAllModalOpen(true)}
              className="bg-rose-600 hover:bg-rose-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition cursor-pointer"
            >
              حذف جميع الفنيين
            </button>
          )}
        </div>
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="ابحث باسم الفني..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pr-10 pl-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-slate-505 text-sm focus:outline-none transition-all duration-200 text-right"
          />
        </div>
      </div>

      {/* Table container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-right">
        {loading ? (
          <div className="px-6 py-12 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-800/60 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : techs.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-505">لم يتم العثور على نتائج مطابقة للبحث.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm text-slate-350" dir="rtl">
                <thead className="text-xs text-slate-405 uppercase bg-slate-900/50 border-b border-slate-800">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-right">الفني</th>
                    <th scope="col" className="px-6 py-4 text-right">رقم الهاتف</th>
                    <th scope="col" className="px-6 py-4 text-right">تاريخ الانضمام</th>
                    <th scope="col" className="px-6 py-4 text-right">حالة الحساب</th>
                    <th scope="col" className="px-6 py-4 text-left">العمليات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {techs.map((tech) => (
                    <tr key={tech._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{tech.name}</div>
                        <div className="text-xs text-slate-500">{tech.email}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-300">{tech.phone}</td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(tech.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {tech.isSuspended ? (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            موقوف مؤقتاً
                          </span>
                        ) : (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            نشط
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-left space-x-1 flex-row-reverse">
                        <button
                          onClick={() => setSelectedTech(tech)}
                          className="text-indigo-400 hover:text-indigo-300 p-2 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                          title="عرض التفاصيل"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleSuspendToggle(tech)}
                          className={`p-2 rounded-lg transition cursor-pointer ${
                            tech.isSuspended
                              ? 'text-emerald-400 hover:text-emerald-350 hover:bg-slate-800'
                              : 'text-amber-500 hover:text-amber-450 hover:bg-slate-800'
                          }`}
                          title={tech.isSuspended ? 'تنشيط الحساب' : 'إيقاف مؤقت'}
                        >
                          {tech.isSuspended ? <CheckCircle size={16} /> : <Ban size={16} />}
                        </button>
                        <button
                          onClick={() => setTechToDelete(tech)}
                          className="text-rose-400 hover:text-rose-350 p-2 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                          title="حذف الحساب"
                        >
                          <Trash2 size={16} />
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
                <span className="text-xs text-slate-500">
                  عرض الصفحة {page} من {pages} (إجمالي {total} فني)
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-855 text-slate-305 border border-slate-800 hover:bg-slate-800 hover:text-white transition disabled:opacity-40 disabled:hover:bg-slate-855 disabled:cursor-not-allowed text-xs font-semibold cursor-pointer"
                  >
                    السابق
                  </button>
                  <button
                    disabled={page === pages}
                    onClick={() => setPage(page + 1)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-855 text-slate-305 border border-slate-800 hover:bg-slate-800 hover:text-white transition disabled:opacity-40 disabled:hover:bg-slate-855 disabled:cursor-not-allowed text-xs font-semibold cursor-pointer"
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
      {selectedTech && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-850 border-b border-slate-855 flex items-center justify-between flex-row-reverse">
              <h3 className="font-bold text-white text-lg">تفاصيل الفني</h3>
              <button onClick={() => setSelectedTech(null)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4 text-right">
              <div>
                <label className="text-xs text-slate-505 uppercase tracking-wider block font-semibold">اسم الفني</label>
                <p className="text-sm font-semibold text-white mt-0.5">{selectedTech.name}</p>
              </div>
              <div>
                <label className="text-xs text-slate-505 uppercase tracking-wider block font-semibold">البريد الإلكتروني</label>
                <p className="text-sm text-slate-300 mt-0.5">{selectedTech.email}</p>
              </div>
              <div>
                <label className="text-xs text-slate-505 uppercase tracking-wider block font-semibold">رقم الهاتف</label>
                <p className="text-sm text-slate-300 mt-0.5">{selectedTech.phone}</p>
              </div>
              <div>
                <label className="text-xs text-slate-505 uppercase tracking-wider block font-semibold">تاريخ الانضمام</label>
                <p className="text-sm text-slate-300 mt-0.5">
                  {new Date(selectedTech.createdAt).toLocaleDateString()} في{' '}
                  {new Date(selectedTech.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div className="border-t border-slate-850 pt-3 flex items-center justify-between flex-row-reverse">
                <span className="text-xs text-slate-500 uppercase tracking-wider">حالة الحساب</span>
                {selectedTech.isSuspended ? (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-455 border border-rose-505/20">
                    موقوف مؤقتاً
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    نشط وجاهز لاستقبال الطلبات
                  </span>
                )}
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-855 flex gap-3 flex-row-reverse">
              <button
                onClick={() => {
                  handleSuspendToggle(selectedTech);
                }}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition cursor-pointer ${
                  selectedTech.isSuspended
                    ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-600 hover:text-white'
                    : 'bg-rose-600/10 text-rose-400 border-rose-505/20 hover:bg-rose-600 hover:text-white'
                }`}
              >
                {selectedTech.isSuspended ? 'تنشيط الفني' : 'إيقاف حساب الفني مؤقتاً'}
              </button>
              <button
                onClick={() => setSelectedTech(null)}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-slate-805 text-slate-303 hover:bg-slate-700 hover:text-white transition cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {techToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-905 border border-slate-805 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-505/25 flex items-center justify-center text-rose-500">
                <ShieldAlert size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">حذف حساب الفني؟</h3>
                <p className="text-xs text-slate-400">
                  هل أنت متأكد من رغبتك في حذف حساب الفني <span className="font-semibold text-slate-205">{techToDelete.name}</span> نهائياً؟ لا يمكن التراجع عن هذا الإجراء.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-850 flex gap-3 flex-row-reverse">
              <button
                onClick={() => setTechToDelete(null)}
                className="flex-1 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-semibold rounded-xl transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteTech}
                className="flex-1 py-2 px-4 bg-rose-600 hover:bg-rose-505 text-white text-sm font-semibold rounded-xl transition cursor-pointer"
              >
                حذف الفني
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Confirmation Dialog */}
      {isDeleteAllModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-955/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-805 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-505/25 flex items-center justify-center text-rose-500">
                <ShieldAlert size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">حذف جميع الفنيين؟</h3>
                <p className="text-xs text-slate-400">
                  هل أنت متأكد من رغبتك في حذف جميع الفنيين نهائياً؟ سيتم مسح كافة حسابات الفنيين المسجلين ولا يمكن التراجع عن هذا الإجراء.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-850 flex gap-3 flex-row-reverse">
              <button
                onClick={() => setIsDeleteAllModalOpen(false)}
                className="flex-1 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-semibold rounded-xl transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteAllTechs}
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
