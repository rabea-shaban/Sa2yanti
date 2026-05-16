import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaPhone, FaTools, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { registerSchema, type RegisterFormData } from '../../../schemas/register.schema';
import axiosInstance from '../../../services/Api';

type AccountType = 'user' | 'technician';

export default function Register() {
  const [accountType, setAccountType] = useState<AccountType>('user');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      const payload = {
        ...data,
        role: accountType,
      };
      await axiosInstance.post('auth/register', payload);
      console.log(payload);

      toast.success('تم إنشاء الحساب بنجاح');
    } catch {
      toast.error('حدث خطأ أثناء التسجيل');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-5">
      <div className="w-full max-w-md">
        {/* Logo */}

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center">
            <FaTools className="text-white text-2xl" />
          </div>

          <h1 className="text-4xl font-bold mt-4">صيانتي</h1>

          <p className="text-gray-500">إنشاء حساب جديد</p>
        </div>

        <div className="bg-white rounded-[30px] shadow-md p-8">
          <label className="block text-right mb-3 text-gray-600">نوع الحساب</label>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setAccountType('technician')}
              className={`py-3 rounded-xl transition
              ${accountType === 'technician' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              فني
            </button>

            <button
              type="button"
              onClick={() => setAccountType('user')}
              className={`py-3 rounded-xl transition
              ${accountType === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              عميل
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-right mb-2">الاسم الكامل</label>

              <div className="relative">
                <input
                  dir="rtl"
                  placeholder="أحمد محمد"
                  {...register('name')}
                  className="w-full border rounded-xl py-3 pr-12 px-4 outline-none"
                />

                <FaUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              <p className="text-red-500 text-sm mt-1 text-right">{errors.name?.message}</p>
            </div>

            <div>
              <label className="block text-right mb-2">رقم الجوال</label>

              <div className="relative">
                <input
                  dir="rtl"
                  placeholder="05xxxxxxxx"
                  {...register('phone')}
                  className="w-full border rounded-xl py-3 pr-12 px-4 outline-none"
                />

                <FaPhone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              <p className="text-red-500 text-sm mt-1 text-right">{errors.phone?.message}</p>
            </div>

            <div>
              <label className="block text-right mb-2">البريد الإلكتروني</label>

              <div className="relative">
                <input
                  dir="rtl"
                  placeholder="example@email.com"
                  {...register('email')}
                  className="w-full border rounded-xl py-3 pr-12 px-4 outline-none"
                />

                <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              <p className="text-red-500 text-sm mt-1 text-right">{errors.email?.message}</p>
            </div>

            <div>
              <label className="block text-right mb-2">كلمة المرور</label>

              <div className="relative">
                <input
                  type="password"
                  dir="rtl"
                  placeholder="********"
                  {...register('password')}
                  className="w-full border rounded-xl py-3 pr-12 px-4 outline-none"
                />

                <FaLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              <p className="text-red-500 text-sm mt-1 text-right">{errors.password?.message}</p>
            </div>

            <button
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
            </button>
          </form>

          <div className="text-center mt-6">
            <span className="text-gray-500">لديك حساب بالفعل؟</span>

            <Link to="/auth/login" className="text-blue-600 mr-2">
              تسجيل الدخول
            </Link>
          </div>
        </div>

        <p className="text-center mt-6 text-gray-500">← العودة للرئيسية</p>
      </div>
    </div>
  );
}
