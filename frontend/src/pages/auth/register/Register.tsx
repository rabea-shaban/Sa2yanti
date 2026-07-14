import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaPhone, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import LocationPicker from '../../../components/ui/LocationPicker';
import { registerSchema, type RegisterFormData } from '../../../schemas/register.schema';
import axiosInstance from '../../../services/Api';

type AccountType = 'user' | 'technician';

export default function Register() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<AccountType>('user');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const handleLocationChange = (loc: string, lat: number, lng: number) => {
    setValue('location', loc, { shouldValidate: true });
    setValue('latitude', lat, { shouldValidate: true });
    setValue('longitude', lng, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    if (accountType === 'technician' && !data.location) {
      toast.error('يرجى تحديد موقعك الجغرافي على الخريطة أولاً');
      return;
    }

    try {
      const payload = {
        ...data,
        role: accountType,
      };
      const res = await axiosInstance.post('auth/register', payload);
      toast.success(res.data.message || 'تم إنشاء الحساب بنجاح!');
      reset();
      navigate('/auth/login');
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const msg = err.response?.data.message;
      console.log(err.response?.data);

      toast.error(`${msg}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-5">
      <div className="w-full max-w-md my-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/logo.png" alt="صيانتك" className="w-60 object-contain mx-auto mb-5" />
          <p className="text-gray-500">إنشاء حساب جديد</p>
        </div>

        <div className="bg-white rounded-[30px] shadow-md p-8">
          <label className="block text-right mb-3 text-gray-600">نوع الحساب</label>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setAccountType('technician')}
              className={`py-3 rounded-xl transition font-medium
              ${accountType === 'technician' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              فني (صنايعي)
            </button>

            <button
              type="button"
              onClick={() => setAccountType('user')}
              className={`py-3 rounded-xl transition font-medium
              ${accountType === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              عميل (مستخدم)
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-right mb-2 font-medium text-gray-700">
                الاسم الكامل
              </label>
              <div className="relative">
                <input
                  dir="rtl"
                  placeholder="أحمد محمد"
                  {...register('name')}
                  className="w-full border border-gray-200 rounded-xl py-3 pr-12 px-4 outline-none focus:border-blue-500 transition"
                />
                <FaUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <p className="text-red-500 text-sm mt-1 text-right">{errors.name?.message}</p>
            </div>

            <div>
              <label className="block text-right mb-2 font-medium text-gray-700">رقم الهاتف</label>
              <div className="relative">
                <input
                  dir="rtl"
                  placeholder="01xxxxxxxxx"
                  {...register('phone')}
                  className="w-full border border-gray-200 rounded-xl py-3 pr-12 px-4 outline-none focus:border-blue-500 transition"
                />
                <FaPhone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <p className="text-red-500 text-sm mt-1 text-right">{errors.phone?.message}</p>
            </div>

            <div>
              <label className="block text-right mb-2 font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  dir="rtl"
                  placeholder="example@email.com"
                  {...register('email')}
                  className="w-full border border-gray-200 rounded-xl py-3 pr-12 px-4 outline-none focus:border-blue-500 transition"
                />
                <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <p className="text-red-500 text-sm mt-1 text-right">{errors.email?.message}</p>
            </div>

            <div>
              <label className="block text-right mb-2 font-medium text-gray-700">كلمة المرور</label>
              <div className="relative">
                <input
                  type="password"
                  dir="rtl"
                  placeholder="********"
                  {...register('password')}
                  className="w-full border border-gray-200 rounded-xl py-3 pr-12 px-4 outline-none focus:border-blue-500 transition"
                />
                <FaLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <p className="text-red-500 text-sm mt-1 text-right">{errors.password?.message}</p>
            </div>

            {/* Conditionally display Geographic Location for Technicians */}
            {accountType === 'technician' && (
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <input type="hidden" {...register('location')} />
                <input type="hidden" {...register('latitude')} />
                <input type="hidden" {...register('longitude')} />
                <label className="block text-right font-medium text-gray-700">
                  الموقع الجغرافي للعمل
                </label>
                <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-inner">
                  <LocationPicker onLocationChange={handleLocationChange} />
                </div>
              </div>
            )}

            <button
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 font-bold transition duration-200"
            >
              {isSubmitting ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
            </button>
          </form>

          <div className="text-center mt-6">
            <span className="text-gray-500">لديك حساب بالفعل؟</span>
            <Link to="/auth/login" className="text-blue-600 mr-2 font-medium">
              تسجيل الدخول
            </Link>
          </div>
        </div>

        <Link
          to="/"
          className="block text-center mt-6 text-gray-500 hover:text-gray-700 transition"
        >
          ← العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
