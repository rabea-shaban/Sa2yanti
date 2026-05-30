import React from 'react';
import { FaBatteryHalf, FaClock, FaMapMarkerAlt, FaSearch, FaWrench } from 'react-icons/fa';
import type { Order, OrderStatus, ServiceType } from '../../types';

interface OrderCardProps {
  order: Order;
}
export default function OrderCard({ order }: OrderCardProps) {
  const statusConfig: Record<
    OrderStatus,
    {
      text: string;
      className: string;
    }
  > = {
    pending: {
      text: 'قيد الانتظار',
      className: 'bg-amber-100 text-amber-700',
    },
    accepted: {
      text: 'تم القبول',
      className: 'bg-blue-100 text-blue-700',
    },
    done: {
      text: 'تم التنفيذ',
      className: 'bg-green-100 text-green-700',
    },
  };

  const serviceIcons: Record<ServiceType, React.ReactNode> = {
    'تغيير زيت': <FaWrench />,
    بطارية: <FaBatteryHalf />,
    'كشف أعطال': <FaSearch />,
  };

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-slate-100">
      <div className="flex justify-between items-start gap-3">
        <span
          className={`px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-medium whitespace-nowrap ${
            statusConfig[order.status].className
          }`}
        >
          {statusConfig[order.status].text}
        </span>

        <div className="flex gap-3 md:gap-4 items-start">
          <div className="text-right">
            <h3 className="text-lg md:text-2xl font-bold text-slate-900">{order.service}</h3>

            <div className="flex items-center gap-1.5 text-slate-500 mt-2 justify-end text-sm md:text-base">
              <FaMapMarkerAlt className="shrink-0" />
              <span>{order.location}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-slate-500 mt-2 justify-end text-xs md:text-sm">
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

          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-lg md:text-xl shrink-0">
            {serviceIcons[order.service]}
          </div>
        </div>
      </div>

      <div className="mt-5 md:mt-8">
        {order.status === 'accepted' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button className="h-11 md:h-12 text-sm md:text-base rounded-xl border border-slate-300 hover:bg-slate-50 transition">
              تواصل مع الفني
            </button>

            <button className="h-11 md:h-12 text-sm md:text-base rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">
              تتبع الطلب
            </button>
          </div>
        )}

        {order.status === 'done' && (
          <button className="w-full h-11 md:h-12 text-sm md:text-base rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition">
            إعادة الطلب
          </button>
        )}
      </div>
    </div>
  );
}
