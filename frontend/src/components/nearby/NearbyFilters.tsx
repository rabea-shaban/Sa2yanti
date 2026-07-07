import React from 'react';
import { FaSearch, FaFilter, FaSortAmountDown, FaRoute } from 'react-icons/fa';
import type { ServiceType } from '../../hooks/useNearbyTechnicians';

interface NearbyFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  radius: number;
  setRadius: (radius: number) => void;
  serviceFilter: string;
  setServiceFilter: (service: string) => void;
  sortBy: 'distance' | 'rating' | 'experience';
  setSortBy: (sort: 'distance' | 'rating' | 'experience') => void;
  allServices: ServiceType[];
}

export const NearbyFilters: React.FC<NearbyFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  radius,
  setRadius,
  serviceFilter,
  setServiceFilter,
  sortBy,
  setSortBy,
  allServices,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-100 shadow-sm space-y-4 text-right" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Name Search */}
        <div className="relative">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ابحث باسم الفني</label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الفني أو المركز..."
              className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-150 rounded-2xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all text-right font-medium"
            />
            <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Radius Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">مسافة البحث</label>
          <div className="relative">
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-150 rounded-2xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 appearance-none text-right font-medium"
            >
              <option value={5}>5 كم</option>
              <option value={10}>10 كم</option>
              <option value={20}>20 كم</option>
              <option value={30}>30 كم</option>
              <option value={50}>50 كم</option>
            </select>
            <FaRoute className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Service Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">نوع الخدمة المطلوبة</label>
          <div className="relative">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-150 rounded-2xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 appearance-none text-right font-medium"
            >
              <option value="كل الخدمات">كل الخدمات</option>
              {allServices.map((service) => (
                <option key={service._id} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>
            <FaFilter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Sort option */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ترتيب النتائج حسب</label>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-150 rounded-2xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 appearance-none text-right font-medium"
            >
              <option value="distance">الأقرب مسافة</option>
              <option value="rating">الأعلى تقييماً</option>
              <option value="experience">الأكثر خبرة (عدد المهام المنجزة)</option>
            </select>
            <FaSortAmountDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyFilters;
