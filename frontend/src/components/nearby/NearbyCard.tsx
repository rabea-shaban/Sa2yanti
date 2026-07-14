import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaWrench, FaMapMarkerAlt, FaCompass, FaChevronLeft } from 'react-icons/fa';
import type { NearbyTechnician } from '../../services/nearby.service';

interface NearbyCardProps {
  tech: NearbyTechnician;
  selectedServiceId?: string;
}

export const NearbyCard: React.FC<NearbyCardProps> = ({ tech, selectedServiceId }) => {
  const navigate = useNavigate();

  const handleOrder = () => {
    navigate('/orders/create', {
      state: {
        technicianId: tech._id,
        serviceId: selectedServiceId || (tech.services?.[0]?._id || ''),
        distance: tech.distance,
      },
    });
  };

  const handleNavigate = () => {
    if (tech.latitude && tech.longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${tech.latitude},${tech.longitude}`,
        '_blank'
      );
    }
  };

  const handleDetails = () => {
    navigate(`/technicians/${tech._id}`);
  };

  return (
    <div
      className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col md:flex-row gap-5 justify-between items-start md:items-center text-right"
      dir="rtl"
    >
      <div className="flex flex-col sm:flex-row gap-4 items-start flex-1 w-full">
        {/* Avatar / Brand Image */}
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl shrink-0 font-bold overflow-hidden border border-blue-100 shadow-inner">
          {tech.avatar ? (
            <img src={tech.avatar} alt={tech.name} className="w-full h-full object-cover" />
          ) : (
            tech.name.charAt(0)
          )}
        </div>

        {/* Text Details */}
        <div className="space-y-1.5 flex-1 text-right w-full">
          <div className="flex flex-wrap items-center gap-2 justify-start sm:justify-start">
            <h4 className="text-lg font-bold text-slate-800">{tech.name}</h4>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full">
              ✓ متاح للخدمة
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-amber-500 justify-start">
            <div className="flex text-xs">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.round(tech.rating) ? 'text-amber-500' : 'text-slate-200'} />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-500">({tech.rating.toFixed(1)})</span>
            <span className="text-slate-350 text-xs">|</span>
            <span className="text-xs text-slate-550 font-medium">المهام المنجزة: {tech.completedJobs}</span>
          </div>

          {/* Location & Distance */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-500 text-xs justify-start font-medium">
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-rose-500" />
              <span>{tech.address || 'عنوان غير محدد'}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span>يبعد عنك:</span>
              <span className="font-bold text-blue-600">{tech.distance} كم</span>
            </div>
          </div>

          {/* Available Services */}
          {tech.services && tech.services.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2 justify-start">
              {tech.services.map((serv) => (
                <span
                  key={serv._id}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-slate-600 text-[10px] font-semibold flex items-center gap-1"
                >
                  <FaWrench className="text-[8px] text-slate-400" />
                  {serv.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:flex md:flex-col gap-2 w-full md:w-auto pt-4 md:pt-0 border-t border-slate-100 md:border-t-0 shrink-0">
        <button
          onClick={handleOrder}
          className="w-full md:w-32 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition cursor-pointer"
        >
          اطلب الخدمة
        </button>
        <button
          onClick={handleNavigate}
          className="w-full md:w-32 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <FaCompass className="text-slate-500" />
          ابدأ الملاحة
        </button>
        <button
          onClick={handleDetails}
          className="w-full md:w-32 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
        >
          عرض التفاصيل
          <FaChevronLeft className="text-[9px]" />
        </button>
      </div>
    </div>
  );
};

export default NearbyCard;
