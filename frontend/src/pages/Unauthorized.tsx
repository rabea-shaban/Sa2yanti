import { FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4" dir="rtl">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaLock className="text-4xl text-red-500" />
        </div>

        {/* Code */}
        <h1 className="text-8xl font-extrabold text-slate-200 leading-none mb-2">403</h1>

        {/* Title */}
        <h2 className="text-2xl font-bold text-slate-800 mb-3">غير مصرح بالوصول</h2>

        {/* Message */}
        <p className="text-gray-500 mb-8">
          ليس لديك صلاحية للوصول إلى هذه الصفحة.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-medium hover:bg-slate-100 transition"
          >
            الرجوع للصفحة السابقة
          </button>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    </div>
  );
}
