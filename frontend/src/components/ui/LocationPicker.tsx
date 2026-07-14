import { useState, useEffect } from 'react';
import { FaLocationArrow, FaMapMarkerAlt } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type Props = {
  onLocationChange: (location: string, lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
  initialLocation?: string;
};

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18`,
      {
        headers: {
          'Accept-Language': 'ar',
          'User-Agent': 'sy2antekGraduationProject/1.0 (contact: admin@sy2antek.com)',
        },
      },
    );
    const data = await res.json();
    if (!data || !data.address) return 'تعذر تحديد الموقع';
    const a = data.address;
    const street = a.road || a.street || a.pedestrian || a.path || '';
    const village = a.village || a.hamlet || a.quarter || a.neighbourhood || a.suburb || a.city_district || a.municipality || a.town || '';
    const city = a.city || a.county || a.state_district || '';
    const state = a.state || a.governorate || '';
    const parts = [
      street && `الشارع: ${street}`,
      village && `القرية: ${village}`,
      city && `المركز: ${city}`,
      state && `المحافظة: ${state}`,
    ].filter(Boolean);
    return parts.join(' - ') || data.display_name || 'تعذر تحديد الموقع';
  } catch {
    return 'تعذر تحديد الموقع';
  }
}

function ClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onClick(e.latlng.lat, e.latlng.lng) });
  return null;
}

export default function LocationPicker({ onLocationChange, initialLat, initialLng, initialLocation }: Props) {
  const hasInitial = !!(initialLat && initialLat !== 0 && initialLng && initialLng !== 0);

  const [marker, setMarker] = useState<[number, number] | null>(
    hasInitial ? [initialLat!, initialLng!] : null
  );
  const [text, setText] = useState(initialLocation || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialLat && initialLat !== 0 && initialLng && initialLng !== 0) {
      setMarker([initialLat, initialLng]);
      if (initialLocation) setText(initialLocation);
    }
  }, [initialLat, initialLng, initialLocation]);

  const pick = async (lat: number, lng: number) => {
    setMarker([lat, lng]);
    setLoading(true);
    setError('');
    try {
      const location = await reverseGeocode(lat, lng);
      setText(location);
      onLocationChange(location, lat, lng);
    } catch {
      setError('تعذر جلب بيانات الموقع');
    } finally {
      setLoading(false);
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return setError('المتصفح لا يدعم تحديد الموقع');
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => pick(pos.coords.latitude, pos.coords.longitude),
      () => { setLoading(false); setError('يرجى السماح بالوصول للموقع'); },
    );
  };

  const center: [number, number] = marker ?? [26.8206, 30.8025];
  const zoom = marker ? 14 : 6;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative rounded-2xl overflow-hidden border border-gray-200 h-64 md:h-80">
        <MapContainer
          key={`${center[0]}-${center[1]}`}
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {marker && <Marker position={marker} />}
          <ClickHandler onClick={pick} />
        </MapContainer>
        {loading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-[1000]">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={useMyLocation}
          disabled={loading}
          className="flex items-center gap-2 text-blue-600 font-medium disabled:opacity-50 cursor-pointer"
        >
          <FaLocationArrow />
          {loading ? 'جاري تحديد الموقع...' : 'استخدم موقعي الحالي'}
        </button>
        <label className="text-gray-700 font-medium">موقع الخدمة</label>
      </div>

      <div className="relative">
        <input
          dir="rtl"
          readOnly
          value={text}
          placeholder="اضغط على الخريطة أو استخدم موقعك الحالي"
          className="w-full h-14 rounded-2xl border border-gray-205 px-6 pr-12 bg-gray-50 text-sm outline-none text-right font-medium"
        />
        <FaMapMarkerAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      {error && <p className="text-red-500 text-sm text-right">{error}</p>}
    </div>
  );
}
