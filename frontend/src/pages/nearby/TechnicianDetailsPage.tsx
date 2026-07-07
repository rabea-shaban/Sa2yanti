import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaStar, FaWrench, FaMapMarkerAlt, FaCompass, FaChevronRight, FaPhone, FaEnvelope } from 'react-icons/fa';
import { getTechnicianById } from '../../services/nearby.service';
import type { NearbyTechnician } from '../../services/nearby.service';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const techIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const TechnicianDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tech, setTech] = useState<NearbyTechnician | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await getTechnicianById(id);
        if (res.data?.success && res.data.technician) {
          setTech(res.data.technician);
          setReviews((res.data as any).reviews || []);
        } else {
          setError('لم يتم العثور على الفني.');
        }
      } catch (err) {
        console.error('Error fetching technician details:', err);
        setError('تعذر تحميل تفاصيل الفني من الخادم.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleOrder = (serviceId: string) => {
    if (!tech) return;
    navigate('/orders/create', {
      state: {
        technicianId: tech._id,
        serviceId,
        distance: tech.distance || 0,
      },
    });
  };

  const handleNavigate = () => {
    if (tech && tech.latitude && tech.longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${tech.latitude},${tech.longitude}`,
        '_blank'
      );
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center animate-pulse" dir="rtl">
        <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-6" />
        <div className="h-6 bg-slate-200 rounded-md w-48 mx-auto mb-3" />
        <div className="h-4 bg-slate-200 rounded-md w-36 mx-auto mb-8" />
        <div className="h-40 bg-slate-200 rounded-3xl w-full" />
      </div>
    );
  }

  if (error || !tech) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center" dir="rtl">
        <div className="text-rose-500 text-5xl mb-4 font-bold">!</div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">حدث خطأ</h3>
        <p className="text-slate-500 text-sm mb-6">{error || 'الفني غير متاح حالياً.'}</p>
        <button
          onClick={() => navigate('/nearby')}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition cursor-pointer text-sm"
        >
          العودة للبحث
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 text-right" dir="rtl">
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate('/nearby')}
          className="flex items-center gap-1 text-slate-500 hover:text-blue-600 font-semibold transition cursor-pointer text-sm"
        >
          <FaChevronRight className="text-[10px]" />
          العودة إلى المراكز القريبة
        </button>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start justify-between border-b border-slate-100 pb-6">
          <div className="flex gap-4 items-start">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl font-extrabold border border-blue-100 shadow-inner overflow-hidden shrink-0">
              {tech.avatar ? (
                <img src={tech.avatar} alt={tech.name} className="w-full h-full object-cover" />
              ) : (
                tech.name.charAt(0)
              )}
            </div>

            {/* Name, rating and completed jobs */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900">{tech.name}</h2>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full">
                  ✓ متاح حالياً
                </span>
              </div>

              {/* Rating block */}
              <div className="flex items-center gap-1.5 text-amber-500 justify-start">
                <div className="flex text-xs">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.round(tech.rating) ? 'text-amber-500' : 'text-slate-200'} />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-500">({tech.rating.toFixed(1)})</span>
                <span className="text-slate-350 text-xs">|</span>
                <span className="text-xs text-slate-550 font-semibold">إجمالي المهام المنجزة: {tech.completedJobs} طلب</span>
              </div>
            </div>
          </div>

          {/* Navigation Action */}
          <button
            onClick={handleNavigate}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow hover:shadow-md transition cursor-pointer text-sm"
          >
            <FaCompass />
            بدء التوجيه والملاحة
          </button>
        </div>

        {/* Contact details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
              <FaPhone />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold">رقم الهاتف</p>
              <p className="text-sm font-bold text-slate-700">{tech.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
              <FaEnvelope />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold">البريد الإلكتروني</p>
              <p className="text-sm font-bold text-slate-700">{tech.email}</p>
            </div>
          </div>
        </div>

        {/* Location / Address block */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <FaMapMarkerAlt className="text-rose-500 text-sm" />
            موقع مركز الصيانة
          </h3>
          <p className="text-sm text-slate-600 font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {tech.address}
          </p>

          {/* Leaflet Map centered on tech coordinates */}
          {tech.latitude && tech.longitude && (
            <div className="h-64 rounded-3xl overflow-hidden border border-slate-200 shadow-inner z-0">
              <MapContainer
                center={[tech.latitude, tech.longitude] as [number, number]}
                zoom={14}
                className="h-full w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[tech.latitude, tech.longitude] as [number, number]} icon={techIcon}>
                  <Popup>
                    <div className="text-center font-bold text-xs">{tech.name}</div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
        </div>
      </div>

      {/* Services List Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <FaWrench className="text-blue-500 text-sm animate-spin" style={{ animationDuration: '8s' }} />
          الخدمات المتاحة وأسعارها
        </h3>

        {tech.services && tech.services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tech.services.map((serv: any) => (
              <div
                key={serv._id}
                className="p-4 border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-sm transition flex justify-between items-center bg-slate-50/50"
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-base">{serv.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">{serv.description || 'صيانة احترافية سريعة'}</p>
                  <p className="text-blue-600 font-bold text-sm">{serv.price} ج.م</p>
                </div>
                <button
                  onClick={() => handleOrder(serv._id)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition cursor-pointer"
                >
                  اطلب هذه الخدمة
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-6">لا توجد خدمات متاحة حالياً.</p>
        )}
      </div>

      {/* Reviews list Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          ⭐ تقييمات وآراء العملاء
        </h3>

        {reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((rev: any) => (
              <div
                key={rev._id}
                className="p-4 border border-slate-100 rounded-2xl bg-slate-50/30 text-right space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 text-sm">{rev.clientName}</span>
                  <div className="flex text-amber-500 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < rev.rating ? 'text-amber-500' : 'text-slate-200'} />
                    ))}
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-semibold">
                  {new Date(rev.date).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                {rev.comment && (
                  <p className="text-slate-600 text-xs mt-1.5 font-medium pr-1">« {rev.comment} »</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-6">لا توجد تقييمات لهذا الفني بعد.</p>
        )}
      </div>
    </div>
  );
};

export default TechnicianDetailsPage;
