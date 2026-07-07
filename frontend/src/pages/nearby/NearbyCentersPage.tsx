import React from 'react';
import { useNearbyTechnicians } from '../../hooks/useNearbyTechnicians';
import NearbyFilters from '../../components/nearby/NearbyFilters';
import NearbyList from '../../components/nearby/NearbyList';
import NearbyMap from '../../components/nearby/NearbyMap';
import NearbySkeleton from '../../components/nearby/NearbySkeleton';
import { FaCompass, FaExclamationTriangle, FaSync } from 'react-icons/fa';

export const NearbyCentersPage: React.FC = () => {
  const {
    technicians,
    loading,
    error,
    gpsError,
    userLat,
    userLng,
    radius,
    setRadius,
    searchQuery,
    setSearchQuery,
    serviceFilter,
    setServiceFilter,
    sortBy,
    setSortBy,
    allServices,
    requestLocation,
  } = useNearbyTechnicians();

  // Find active service ID if filtered
  const activeService = allServices.find((s) => s.name === serviceFilter);
  const selectedServiceId = activeService?._id;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 text-right" dir="rtl">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#00274C] to-[#EE5A0E] rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden border border-slate-700/30">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-10 -translate-y-10 blur-xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-12 translate-y-12 blur-2xl" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold tracking-wide">
            <FaCompass className="animate-spin text-sm" style={{ animationDuration: '6s' }} />
            البحث الذكي بالموقع الجغرافي
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">أقرب مراكز الصيانة</h1>
          <p className="text-blue-100 text-sm md:text-base font-medium max-w-xl">
            اعثر على أقرب فني أو مركز صيانة بالقرب منك، واطلب الخدمة فوراً مع ميزة الملاحة الحية.
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <NearbyFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        radius={radius}
        setRadius={setRadius}
        serviceFilter={serviceFilter}
        setServiceFilter={setServiceFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        allServices={allServices}
      />

      {/* Main Content Layout */}
      {error ? (
        /* Error States (GPS / Permission Denied) */
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center flex flex-col items-center justify-center max-w-md mx-auto py-12">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-3xl mb-6">
            <FaExclamationTriangle />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">تعذر تحديد موقعك الجغرافي</h3>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            {gpsError === 'Permission Denied'
              ? 'لقد تم رفض صلاحية الوصول للموقع. يرجى السماح للمتصفح بالوصول لموقعك الجغرافي لتحديد مراكز الصيانة القريبة منك.'
              : 'يرجى تشغيل خدمة تحديد المواقع (GPS) في جهازك والضغط على زر إعادة المحاولة.'}
          </p>
          <button
            onClick={requestLocation}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow hover:shadow-md transition cursor-pointer text-sm"
          >
            <FaSync className="text-xs" />
            إعادة المحاولة وتحديث الموقع
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Map Section (Desktop: Left, Mobile: Top) */}
          <div className="w-full lg:w-3/5 h-80 sm:h-96 lg:h-[600px] shrink-0">
            {loading && !userLat ? (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-500 font-semibold animate-pulse rounded-3xl border border-slate-100 shadow-inner">
                جاري تحديد موقعك الجغرافي...
              </div>
            ) : (
              <NearbyMap userLat={userLat} userLng={userLng} technicians={technicians} />
            )}
          </div>

          {/* List Section (Desktop: Right, Mobile: Bottom) */}
          <div className="w-full lg:w-2/5 flex flex-col max-h-[600px] overflow-y-auto space-y-4 pr-1">
            <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center justify-between">
              <span>الفنيين ومراكز الصيانة المتاحة بالقرب منك</span>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                {technicians.length} نتائج
              </span>
            </h3>

            {loading ? (
              <NearbySkeleton />
            ) : (
              <NearbyList
                technicians={technicians}
                selectedServiceId={selectedServiceId}
                onRefresh={requestLocation}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NearbyCentersPage;
