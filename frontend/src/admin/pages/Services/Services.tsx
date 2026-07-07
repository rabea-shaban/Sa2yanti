import { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import { Plus, Edit, Trash2, Eye, EyeOff, ShieldAlert, Image } from 'lucide-react';
import toast from 'react-hot-toast';

interface CategoryItem {
  _id: string;
  name: string;
}

interface ServiceItem {
  _id: string;
  name: string;
  description: string;
  category: CategoryItem | null;
  price: number;
  image: string;
  isActive: boolean;
}

export default function Services() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [image, setImage] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [serviceToDelete, setServiceToDelete] = useState<ServiceItem | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [serviceRes, categoryRes] = await Promise.all([
        adminApi.get('/services'),
        adminApi.get('/categories'),
      ]);

      if (serviceRes.data.success) {
        setServices(serviceRes.data.services);
      }
      if (categoryRes.data.success) {
        setCategories(categoryRes.data.categories.filter((cat: any) => cat.isActive));
      }
    } catch (err: any) {
      toast.error('مش عارف أحمل بيانات الخدمات المتاحة.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      toast.error('حجم الصورة لازم يكون أقل من 20 ميجا بايت');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result);
        toast.success('تم تحميل الصورة بنجاح');
      }
    };
    reader.readAsDataURL(file);
  };

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedService(null);
    setName('');
    setDescription('');
    setCategoryId(categories[0]?._id || '');
    setPrice('');
    setImage('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setModalMode('edit');
    setSelectedService(service);
    setName(service.name);
    setDescription(service.description);
    setCategoryId(service.category?._id || categories[0]?._id || '');
    setPrice(service.price);
    setImage(service.image || '');
    setIsActive(service.isActive);
    setIsModalOpen(true);
  };

  const handleActiveToggle = async (service: ServiceItem) => {
    try {
      const updatedStatus = !service.isActive;
      const res = await adminApi.patch(`/services/${service._id}`, {
        isActive: updatedStatus,
      });
      if (res.data.success) {
        toast.success(`تم ${updatedStatus ? 'تفعيل' : 'تعطيل'} الخدمة بنجاح`);
        setServices(services.map((s) => (s._id === service._id ? { ...s, isActive: updatedStatus } : s)));
      }
    } catch (err: any) {
      toast.error('حصلت مشكلة أثناء تغيير حالة الخدمة.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !categoryId || price === '') {
      toast.error('يا ريت تملأ كل الخانات المطلوبة للخدمة');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        description,
        category: categoryId,
        price: Number(price),
        image,
        isActive,
      };

      if (modalMode === 'create') {
        const res = await adminApi.post('/services', payload);
        if (res.data.success) {
          toast.success('تم إضافة الخدمة الجديدة بنجاح');
          fetchData();
          setIsModalOpen(false);
        }
      } else if (modalMode === 'edit' && selectedService) {
        const res = await adminApi.patch(`/services/${selectedService._id}`, payload);
        if (res.data.success) {
          toast.success('تم تحديث بيانات الخدمة بنجاح');
          fetchData();
          setIsModalOpen(false);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'فشل في حفظ الخدمة.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;
    try {
      const res = await adminApi.delete(`/services/${serviceToDelete._id}`);
      if (res.data.success) {
        toast.success('تم مسح الخدمة نهائياً من السيستم');
        setServiceToDelete(null);
        fetchData();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'فشل في مسح الخدمة.');
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-right">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">إدارة الخدمات</h1>
          <p className="text-sm text-slate-400 font-medium">تقدر تضيف خدمات جديدة، تعدل أسعارها بالجنيه المصري، أو تعطلها.</p>
        </div>
        <button
          onClick={openCreateModal}
          disabled={categories.length === 0}
          className="flex items-center justify-center gap-2 bg-indigo-655 hover:bg-indigo-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Plus size={16} />
          إضافة خدمة جديدة
        </button>
      </div>

      {categories.length === 0 && !loading && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-sm text-right">
          تنبيه: مافيش أي تخصصات نشطة دلوقتي. يا ريت تضيف تخصص نشط الأول من قائمة "التخصصات" قبل ما تضيف خدمات.
        </div>
      )}

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-900/60 border border-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
          مافيش خدمات متسجلة لسه، اضغط على "إضافة خدمة جديدة" للبدء.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-right">
          {services.map((service) => (
            <div
              key={service._id}
              className={`bg-slate-900 border rounded-2xl overflow-hidden hover:border-slate-700 transition flex flex-col ${
                service.isActive ? 'border-slate-800' : 'border-slate-850 opacity-70'
              }`}
            >
              {/* Image box */}
              <div className="h-40 bg-slate-950 flex items-center justify-center relative overflow-hidden shrink-0">
                {service.image ? (
                  <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                ) : (
                  <Image className="text-slate-700" size={40} />
                )}
                {/* Price tag */}
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-slate-900/80 backdrop-blur border border-slate-850 text-indigo-400 font-bold text-sm">
                  {service.price} ج.م
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col space-y-3 justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between flex-row-reverse">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                      {service.category?.name || 'غير مصنف'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        service.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-800 text-slate-500 border-slate-800'
                      }`}
                    >
                      {service.isActive ? 'نشطة' : 'معطلة'}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base truncate" title={service.name}>
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2" title={service.description}>
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-850 pt-3 flex-row-reverse">
                  <button
                    onClick={() => handleActiveToggle(service)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition cursor-pointer ${
                      service.isActive
                        ? 'bg-slate-800 text-slate-400 hover:text-white border-slate-850'
                        : 'bg-indigo-650/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-650 hover:text-white'
                    }`}
                  >
                    {service.isActive ? (
                      <>
                        <EyeOff size={14} /> تعطيل الخدمة
                      </>
                    ) : (
                      <>
                        <Eye size={14} /> تفعيل الخدمة
                      </>
                    )}
                  </button>

                  <div className="flex gap-1 flex-row-reverse">
                    <button
                      onClick={() => openEditModal(service)}
                      className="p-2 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 rounded-lg transition cursor-pointer"
                      title="تعديل بيانات الخدمة"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => setServiceToDelete(service)}
                      className="p-2 hover:bg-slate-800 text-rose-450 hover:text-rose-350 rounded-lg transition cursor-pointer"
                      title="حذف الخدمة"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-850 border-b border-slate-850 flex items-center justify-between flex-row-reverse">
              <h3 className="font-bold text-white text-lg">
                {modalMode === 'create' ? 'إضافة خدمة جديدة' : 'تعديل بيانات الخدمة'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white font-semibold cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4 max-h-[480px] overflow-y-auto text-right">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-505 uppercase tracking-wider block mb-1">اسم الخدمة</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: تغيير زيت فرامل"
                      className="block w-full px-4 py-2.5 bg-slate-955 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-700 text-sm focus:outline-none text-right"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-505 block mb-1">السعر (ج.م)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="مثال: 500"
                      className="block w-full px-4 py-2.5 bg-slate-955 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-700 text-sm focus:outline-none text-right"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1">تخصص الخدمة</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right"
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1">وصف وتفاصيل الخدمة</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="اكتب تفاصيل الخدمة والخطوات هنا..."
                    className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-slate-700 text-sm focus:outline-none transition resize-none text-right"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1">صورة الخدمة</label>
                  <div className="flex items-center gap-3 flex-row-reverse">
                    {image && (
                      <div className="w-16 h-16 rounded-xl border border-slate-800 overflow-hidden shrink-0 bg-slate-950">
                        <img src={image} alt="preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label className="flex-1 flex flex-col justify-center items-center h-16 border border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/40 rounded-xl cursor-pointer transition">
                      <div className="flex flex-col items-center justify-center text-xs text-slate-400">
                        <span className="font-semibold text-indigo-400">ارفع ملف صورة</span>
                        <span className="text-[10px] text-slate-500">امتدادات JPG, PNG, GIF حتى 20 ميجا</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-850 pt-3 flex-row-reverse">
                  <div>
                    <label className="text-sm font-semibold text-slate-205">تفعيل الخدمة فوراً</label>
                    <p className="text-xs text-slate-500">العملاء هيقدروا يطلبوا الخدمة دي أول ما تفعلها.</p>
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
                  className="flex-1 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white text-sm font-semibold rounded-xl transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 px-4 bg-indigo-650 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition flex justify-center items-center cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : modalMode === 'create' ? (
                    'إضافة الخدمة'
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
      {serviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-955/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-550">
                <ShieldAlert size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">حذف الخدمة؟</h3>
                <p className="text-xs text-slate-400">
                  هل أنت متأكد إنك عاوز تمسح الخدمة <span className="font-semibold text-slate-205">{serviceToDelete.name}</span> نهائياً من السيستم؟ الخطوة دي ملهاش رجوع.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-850 flex gap-3 flex-row-reverse">
              <button
                onClick={() => setServiceToDelete(null)}
                className="flex-1 py-2 px-4 bg-slate-805 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-semibold rounded-xl transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteService}
                className="flex-1 py-2 px-4 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-xl transition cursor-pointer"
              >
                احذف الخدمة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
