import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import axiosInstance from '../../services/Api';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaSave, FaArrowRight } from 'react-icons/fa';
import LocationPicker from '../../components/ui/LocationPicker';

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setLocation(user.location || '');
      setLatitude(user.latitude || 0);
      setLongitude(user.longitude || 0);
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (user?.role === 'technician' && !location) {
      toast.error('يرجى تحديد موقعك الجغرافي على الخريطة');
      return;
    }

    setIsSaving(true);
    try {
      const payload: any = { name, email, phone };
      if (password) {
        if (password.length < 6) {
          toast.error('يجب أن تكون كلمة المرور 6 أحرف على الأقل');
          setIsSaving(false);
          return;
        }
        payload.password = password;
      }

      if (user?.role === 'technician') {
        payload.location = location;
        payload.latitude = latitude;
        payload.longitude = longitude;
      }

      const res = await axiosInstance.put('/auth/profile', payload);
      if (res.data.success && res.data.user) {
        // update client context
        setUser({
          ...res.data.user,
        });
        toast.success('تم تحديث الحساب بنجاح');
        setPassword(''); // clear password field
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'فشل في تحديث بيانات الحساب';
      toast.error(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (user?.role === 'technician') {
      navigate('/technician');
    } else {
      navigate('/app');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 flex justify-center items-center font-sans" dir="rtl">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-3xl overflow-hidden border border-slate-100 animate-in fade-in duration-300">
        
        {/* Profile Header banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-8 text-white relative">
          <button
            onClick={handleBack}
            className="absolute top-6 left-6 text-white/80 hover:text-white flex items-center gap-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-xl transition duration-200 cursor-pointer"
          >
            <span>رجوع</span>
            <FaArrowRight className="text-[10px]" />
          </button>
          <h2 className="text-2xl font-extrabold tracking-tight">إعدادات الحساب</h2>
          <p className="text-white/70 text-xs mt-1">تعديل بيانات حسابك الشخصي وكلمة المرور في منصة صيانتي.</p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSave} className="p-8 space-y-6">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block text-right">الاسم الكامل</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <FaUser size={14} />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسمك الكامل"
                className="block w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-800 text-sm focus:outline-none transition-all duration-200 text-right"
              />
            </div>
          </div>

          {/* Email address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block text-right">البريد الإلكتروني</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <FaEnvelope size={14} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="block w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-800 text-sm focus:outline-none transition-all duration-200 text-right"
              />
            </div>
          </div>

          {/* Phone number */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block text-right">رقم الهاتف</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <FaPhone size={14} />
              </div>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01xxxxxxxxx"
                className="block w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-800 text-sm focus:outline-none transition-all duration-200 text-right"
              />
            </div>
          </div>

          {/* New password (optional) */}
          <div className="space-y-1.5 border-t border-slate-100 pt-5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block text-right">كلمة المرور الجديدة (اختياري)</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <FaLock size={14} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="اتركها فارغة للمحافظة على الحالية"
                className="block w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-800 text-sm focus:outline-none transition-all duration-200 text-right"
              />
            </div>
          </div>

          {/* Geolocation update for Technicians */}
          {user?.role === 'technician' && (
            <div className="space-y-3 pt-5 border-t border-slate-100 text-right">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block text-right">تحديث الموقع الجغرافي للعمل</label>
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-inner">
                <LocationPicker
                  initialLat={latitude}
                  initialLng={longitude}
                  initialLocation={location}
                  onLocationChange={(loc, lat, lng) => {
                    setLocation(loc);
                    setLatitude(lat);
                    setLongitude(lng);
                  }}
                />
              </div>
              {location && (
                <p className="text-xs text-slate-500 text-right mt-1.5">
                  الموقع المحدد حالياً: <span className="font-semibold text-slate-700">{location}</span>
                </p>
              )}
            </div>
          )}

          {/* Submit */}
          <div className="pt-4 flex justify-end gap-3 flex-row-reverse">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl text-sm transition shadow-lg shadow-blue-500/10 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FaSave />
                  حفظ التعديلات
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 bg-slate-105 hover:bg-slate-200 text-slate-600 rounded-2xl text-sm font-semibold transition cursor-pointer"
            >
              إلغاء
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
