import React from 'react';
import { FaMapMarkerAlt, FaSync } from 'react-icons/fa';

interface EmptyNearbyProps {
  onRefresh: () => void;
}

export const EmptyNearby: React.FC<EmptyNearbyProps> = ({ onRefresh }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-3xl border border-slate-100 shadow-sm" dir="rtl">
      <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-4xl mb-6 animate-bounce">
        <FaMapMarkerAlt />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">لا توجد مراكز صيانة بالقرب منك</h3>
      <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">
        لم نجد أي فنيين أو مراكز صيانة نشطة في نطاق البحث الحالي. يمكنك محاولة زيادة نطاق البحث أو تحديث موقعك الحالي.
      </p>
      <button
        onClick={onRefresh}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all duration-350 cursor-pointer text-sm"
      >
        <FaSync className="text-xs" />
        تحديث الموقع والبحث
      </button>
    </div>
  );
};

export default EmptyNearby;
