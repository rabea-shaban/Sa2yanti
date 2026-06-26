import { FaBatteryHalf, FaClock, FaMapMarkerAlt, FaPhone, FaSearch, FaWrench } from 'react-icons/fa';
import type { Order, OrderStatus } from '../../types';

const STATUS_CONFIG: Record<OrderStatus, { text: string; className: string }> = {
  pending: { text: 'قيد الانتظار', className: 'bg-amber-100 text-amber-700' },
  accepted: { text: 'تم القبول', className: 'bg-blue-100 text-blue-700' },
  'in-progress': { text: 'جارٍ التنفيذ', className: 'bg-purple-100 text-purple-700' },
  completed: { text: 'مكتمل', className: 'bg-green-100 text-green-700' },
  cancelled: { text: 'ملغي', className: 'bg-red-100 text-red-700' },
};

const SERVICE_ICONS = {
  'تغيير زيت': <FaWrench />,
  بطارية: <FaBatteryHalf />,
  'كشف أعطال': <FaSearch />,
};

export default function OrderCard({ order }: { order: Order }) {
  const status = STATUS_CONFIG[order.status] ?? { text: order.status, className: 'bg-gray-100 text-gray-600' };

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-slate-100" dir="rtl">
      <div className="flex justify-between items-start gap-3">
        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${status.className}`}>
          {status.text}
        </span>

        <div className="flex gap-3 items-start">
          <div className="text-right">
            <h3 className="text-lg md:text-2xl font-bold text-slate-900">{order.service}</h3>

            <div className="flex items-center gap-1.5 text-slate-500 mt-2 justify-end text-sm">
              <FaMapMarkerAlt className="shrink-0" />
              <span>{order.location}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-slate-500 mt-2 justify-end text-xs">
              <FaClock className="shrink-0" />
              <span>{new Date(order.updatedAt).toLocaleDateString('ar-EG')}</span>
              {order.technicianId && (
                <>
                  <span>الفني:</span>
                  <span className="text-slate-700 font-medium">{order.technicianId.name}</span>
                </>
              )}
            </div>
          </div>

          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-lg shrink-0">
            {SERVICE_ICONS[order.service]}
          </div>
        </div>
      </div>

      {/* Actions */}
      {(order.status === 'accepted' || order.status === 'in-progress') && (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {order.technicianId?.phone && (
            <a
              href={`tel:${order.technicianId.phone}`}
              className="h-11 flex items-center justify-center gap-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-sm font-medium transition"
            >
              <FaPhone className="text-blue-600" />
              تواصل مع الفني
            </a>
          )}
          <div className="h-11 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 text-sm font-medium">
            {order.status === 'in-progress' ? '🔧 جارٍ التنفيذ الآن' : '✓ تم قبول طلبك'}
          </div>
        </div>
      )}

      {order.status === 'completed' && (
        <div className="mt-5 h-11 flex items-center justify-center rounded-xl bg-green-50 text-green-700 text-sm font-medium">
          ✓ تم إنجاز الطلب بنجاح
        </div>
      )}

      {order.status === 'cancelled' && (
        <div className="mt-5 h-11 flex items-center justify-center rounded-xl bg-red-50 text-red-500 text-sm font-medium">
          تم إلغاء الطلب
        </div>
      )}
    </div>
  );
}
