import React from 'react';
import { Map, useApiLoadingStatus, APILoadingStatus } from '@vis.gl/react-google-maps';

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const GoogleMap: React.FC<GoogleMapProps> = ({
  center = { lat: 30.0444, lng: 31.2357 },
  zoom = 12,
  className = 'w-full h-full min-h-[300px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner',
  style,
}) => {
  const status = useApiLoadingStatus();

  if (status === APILoadingStatus.FAILED) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-red-50 text-red-600 text-sm font-semibold border border-red-200 p-4 text-center ${className}`}
        style={style}
        dir="rtl"
      >
        <span className="text-base mb-1">فشل تحميل خريطة Google Maps</span>
        <span className="text-xs font-normal text-red-500">يرجى التأكد من صلاحية مفتاح الـ API والاتصال بالشبكة.</span>
      </div>
    );
  }

  if (status !== APILoadingStatus.LOADED) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 text-slate-500 text-sm font-semibold animate-pulse ${className}`}
        style={style}
        dir="rtl"
      >
        جاري تحميل خريطة Google Maps...
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={style}>
      <Map
        defaultCenter={center}
        defaultZoom={zoom}
        gestureHandling="cooperative"
        disableDefaultUI={false}
      />
    </div>
  );
};
