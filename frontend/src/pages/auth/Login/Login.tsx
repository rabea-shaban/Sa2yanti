import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useForm, type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import useAuth from '../../../hooks/useAuth';
import axiosInstance from '../../../services/Api';

const loginSchema = z.object({
  email: z.email('صيغة البريد الإلكتروني غير صحيحة'),

  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { getMe } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const res = await axiosInstance.post('auth/login', data);

      toast.success(res.data.message);
      await getMe();

      const role = res.data.user?.role;
      if (role === 'technician') navigate('/technician', { replace: true });
      else if (role === 'admin') navigate('/admin', { replace: true });
      else navigate('/app', { replace: true });
    } catch (error) {
      const err = error as AxiosError<{
        message: string;
      }>;

      const msg = err.response?.data.message;

      toast.error(msg || 'حدث خطأ');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-5">
      <div className="w-full max-w-md">
        {/* Logo */}

        <div className="text-center mb-8">
          <img src="/logo.png" alt="صيانتك" className="w-60 object-contain mx-auto mb-5" />


          <p className="text-gray-500">مرحباً بعودتك</p>
        </div>

        {/* Card */}

        <div className="bg-white rounded-[30px] shadow-md p-8">
          <h2 className="text-3xl font-bold text-center mb-8">تسجيل الدخول</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* email */}

            <div>
              <label className="block text-right mb-2">البريد الإلكتروني</label>

              <div className="relative">
                <input
                  dir="rtl"
                  placeholder="example@email.com"
                  {...register('email')}
                  className="w-full border rounded-xl py-3 pr-12 px-4 outline-none focus:border-blue-500"
                />

                <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              {errors.email && (
                <p className="text-red-500 text-sm mt-1 text-right">{errors.email.message}</p>
              )}
            </div>

            {/* password */}

            <div>
              <label className="block text-right mb-2">كلمة المرور</label>

              <div className="relative">
                <input
                  type="password"
                  dir="rtl"
                  placeholder="********"
                  {...register('password')}
                  className="w-full border rounded-xl py-3 pr-12 px-4 outline-none focus:border-blue-500"
                />

                <FaLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1 text-right">{errors.password.message}</p>
              )}
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-blue-600 text-sm hover:underline">
                نسيت كلمة المرور؟
              </Link>
            </div>

            <button
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 duration-300 disabled:opacity-50"
            >
              {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          <div className="text-center mt-6">
            <span className="text-gray-500">ليس لديك حساب؟</span>

            <Link to="/auth/register" className="text-blue-600 mr-2">
              إنشاء حساب جديد
            </Link>
          </div>
        </div>

        <Link to={'/'} className="text-center mt-6 text-gray-500 block">
          ← العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
