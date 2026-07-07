import { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import { Plus, Edit, Trash2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

interface CategoryItem {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export default function Categories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get('/categories');
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err: any) {
      toast.error('مش عارف أحمل تخصصات الصيانة دلوقتي.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedCategory(null);
    setName('');
    setDescription('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (category: CategoryItem) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setName(category.name);
    setDescription(category.description);
    setIsActive(category.isActive);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      if (modalMode === 'create') {
        const res = await adminApi.post('/categories', { name, description, isActive });
        if (res.data.success) {
          toast.success('تم إنشاء التخصص الجديد بنجاح');
          fetchCategories();
          setIsModalOpen(false);
        }
      } else if (modalMode === 'edit' && selectedCategory) {
        const res = await adminApi.patch(`/categories/${selectedCategory._id}`, {
          name,
          description,
          isActive,
        });
        if (res.data.success) {
          toast.success('تم تحديث بيانات التخصص بنجاح');
          fetchCategories();
          setIsModalOpen(false);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'فشل في حفظ التخصص.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      const res = await adminApi.delete(`/categories/${categoryToDelete._id}`);
      if (res.data.success) {
        toast.success('تم مسح التخصص بنجاح');
        setCategoryToDelete(null);
        fetchCategories();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'فشل في مسح التخصص.');
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-right">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">تخصصات الصيانة (الفئات)</h1>
          <p className="text-sm text-slate-400 font-medium">تقدر تضيف وتعدل وتمسح تخصصات الصيانة المتاحة (محركات، كهرباء، فرامل...)</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 bg-indigo-650 hover:bg-indigo-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition cursor-pointer"
        >
          <Plus size={16} />
          إضافة تخصص جديد
        </button>
      </div>

      {/* Grid List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-right">
        {loading ? (
          <div className="px-6 py-12 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-805/60 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-500">
            مافيش تخصصات متسجلة لسه، اضغط على "إضافة تخصص جديد" لتبدأ.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm text-slate-350" dir="rtl">
              <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-slate-808">
                <tr>
                  <th scope="col" className="px-6 py-4 text-right">اسم التخصص</th>
                  <th scope="col" className="px-6 py-4 text-right">الوصف</th>
                  <th scope="col" className="px-6 py-4 text-right">الحالة</th>
                  <th scope="col" className="px-6 py-4 text-left">العمليات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">{category.name}</td>
                    <td className="px-6 py-4 text-slate-400 max-w-sm truncate">
                      {category.description || <span className="text-slate-600 italic">لا يوجد وصف للتخصص</span>}
                    </td>
                    <td className="px-6 py-4">
                      {category.isActive ? (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          نشط وشغال
                        </span>
                      ) : (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-500 border border-slate-800">
                          معطل
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-left space-x-1 flex-row-reverse">
                      <button
                        onClick={() => openEditModal(category)}
                        className="text-indigo-400 hover:text-indigo-300 p-2 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                        title="تعديل بيانات التخصص"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setCategoryToDelete(category)}
                        className="text-rose-455 hover:text-rose-350 p-2 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                        title="حذف التخصص"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-850 border-b border-slate-850 flex items-center justify-between flex-row-reverse">
              <h3 className="font-bold text-white text-lg">
                {modalMode === 'create' ? 'إنشاء تخصص جديد' : 'تعديل بيانات التخصص'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white font-semibold cursor-pointer">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4 text-right">
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1">اسم التخصص</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: محركات، فرامل، كهرباء..."
                    className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-slate-700 text-sm focus:outline-none transition-all duration-200 text-right"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1">وصف التخصص</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="اكتب وصف للتخصص وتفاصيله هنا..."
                    className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-slate-700 text-sm focus:outline-none transition-all duration-200 resize-none text-right"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-slate-850 pt-3 flex-row-reverse">
                  <div className="text-right">
                    <label className="text-sm font-semibold text-slate-205">حالة التخصص</label>
                    <p className="text-xs text-slate-500">لو عطلته، مش هيظهر كخيار للفنيين أو العملاء.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      isActive ? 'bg-indigo-650' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        isActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-850 flex gap-3 flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-semibold rounded-xl transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 px-4 bg-indigo-650 hover:bg-indigo-650/90 text-white text-sm font-semibold rounded-xl transition flex justify-center items-center cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : modalMode === 'create' ? (
                    'إنشاء التخصص'
                  ) : (
                    'حفظ التعديلات'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-550">
                <ShieldAlert size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">حذف التخصص؟</h3>
                <p className="text-xs text-slate-400">
                  هل أنت متأكد إنك عاوز تمسح تخصص <span className="font-semibold text-slate-205">{categoryToDelete.name}</span> نهائياً؟
                </p>
                <p className="text-[10px] text-amber-500 italic mt-1">
                  ملاحظة: لو التخصص جواه خدمات نشطة، السيستم هيمنع المسح لحماية البيانات.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-850 flex gap-3 flex-row-reverse">
              <button
                onClick={() => setCategoryToDelete(null)}
                className="flex-1 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-semibold rounded-xl transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteCategory}
                className="flex-1 py-2 px-4 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-xl transition cursor-pointer"
              >
                احذف التخصص
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
