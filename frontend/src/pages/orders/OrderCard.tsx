import { useState } from 'react';
import { FaBatteryHalf, FaClock, FaMapMarkerAlt, FaPhone, FaSearch, FaWrench, FaStar } from 'react-icons/fa';
import LeafletMap from '../../components/ui/LeafletMap';
import type { Order, OrderStatus } from '../../types';
import axiosInstance from '../../services/Api';

const STATUS_CONFIG: Record<OrderStatus, { text: string; className: string }> = {
  pending: { text: 'قيد الانتظار', className: 'bg-amber-50 text-amber-600 border border-amber-200/50' },
  accepted: { text: 'تم القبول', className: 'bg-blue-50 text-blue-600 border border-blue-200/50' },
  'in-progress': { text: 'جارٍ التنفيذ', className: 'bg-orange-50 text-orange-600 border border-orange-200/50' },
  completed: { text: 'مكتمل', className: 'bg-emerald-50 text-emerald-600 border border-emerald-200/50' },
  cancelled: { text: 'ملغي', className: 'bg-red-50 text-red-600 border border-red-200/50' },
};

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  'تغيير زيت': <FaWrench />,
  بطارية: <FaBatteryHalf />,
  'كشف أعطال': <FaSearch />,
};

export default function OrderCard({ order }: { order: Order }) {
  const [showMap, setShowMap] = useState(false);
  const status = STATUS_CONFIG[order.status] ?? { text: order.status, className: 'bg-gray-100 text-gray-600' };
  const hasCoords = order.latitude && order.longitude;

  const [localRating, setLocalRating] = useState(order.rating || 0);
  const [localComment, setLocalComment] = useState(order.comment || '');
  const [ratingInput, setRatingInput] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRate = async () => {
    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post(`/orders/${order._id}/rate`, {
        rating: ratingInput,
        comment: commentInput,
      });
      if (res.data?.success) {
        setLocalRating(ratingInput);
        setLocalComment(commentInput);
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
      alert('تعذر تقديم التقييم، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md transition duration-300 hover:shadow-lg hover:scale-[1.005]" dir="rtl">

      {/* Header */}
      <div className="flex justify-between items-start gap-3">
        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${status.className}`}>
          {status.text}
        </span>

        <div className="flex gap-3 items-start">
          <div className="text-right">
            <h3 className="text-lg md:text-2xl font-bold text-slate-900">{order.service}</h3>

            <div className="flex items-center gap-1.5 text-slate-500 mt-2 justify-end text-sm">
              <span>{order.location}</span>
              <FaMapMarkerAlt className="shrink-0 text-blue-500" />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-slate-500 mt-2 justify-end text-xs">
              <span>{new Date(order.updatedAt).toLocaleDateString('ar-EG')}</span>
              <FaClock className="shrink-0" />
              {order.technicianId && (
                <>
                  <span className="text-slate-400">|</span>
                  <span>الفني:</span>
                  <span className="text-slate-700 font-semibold">{order.technicianId.name}</span>
                </>
              )}
            </div>

            {/* زر الخريطة */}
            {hasCoords && (
              <div className="flex justify-end mt-3">
                <button
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
                >
                  <FaMapMarkerAlt />
                  {showMap ? 'إخفاء الخريطة' : 'عرض الموقع على الخريطة'}
                </button>
              </div>
            )}
          </div>

          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-lg shrink-0">
            {SERVICE_ICONS[order.service] ?? <FaWrench />}
          </div>
        </div>
      </div>

      {/* الخريطة */}
      {showMap && hasCoords && (
        <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200">
          <LeafletMap lat={order.latitude} lng={order.longitude} className="h-52 md:h-64 w-full" />
        </div>
      )}

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
        <div className="space-y-4">
          <div className="mt-5 h-11 flex items-center justify-center rounded-xl bg-green-50 text-green-700 text-sm font-medium">
            ✓ تم إنجاز الطلب بنجاح
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3">
            {localRating > 0 ? (
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 text-right">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-emerald-700 text-[10px] font-bold bg-emerald-100/70 px-2 py-0.5 rounded-md">قيمت الخدمة</span>
                  <div className="flex text-amber-500 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < localRating ? 'text-amber-500' : 'text-slate-200'} />
                    ))}
                  </div>
                </div>
                {localComment && (
                  <p className="text-slate-600 text-xs mt-1.5 font-medium pr-1">« {localComment} »</p>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-right space-y-3">
                <h4 className="text-xs font-bold text-slate-700">كيف تقيم تجربة الصيانة؟</h4>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">التقييم:</span>
                  <div className="flex gap-1 text-lg text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingInput(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="cursor-pointer transition transform hover:scale-110 focus:outline-none"
                      >
                        <FaStar
                          className={
                            star <= (hoverRating || ratingInput) ? 'text-amber-500' : 'text-slate-200'
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <textarea
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="اكتب تعليقك أو أي ملاحظات هنا (اختياري)..."
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 text-slate-800 bg-white placeholder-slate-400 resize-none h-16"
                  />
                  
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleRate}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer"
                  >
                    {isSubmitting ? 'جاري الإرسال...' : 'تقديم التقييم والتعليق'}
                  </button>
                </div>
              </div>
            )}
          </div>
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
