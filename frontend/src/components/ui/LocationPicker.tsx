import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { FaLocationArrow, FaMapMarkerAlt } from 'react-icons/fa';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type Props = { onLocationChange: (location: string, lat: number, lng: number) => void };

async function reverseGeocode(lat: number, lng: number) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    { headers: { 'Accept-Language': 'ar' } },
  );
  const { address: a } = await res.json();
  return (
    [a.village || a.suburb || a.neighbourhood, a.city || a.town || a.county, a.state]
      .filter(Boolean)
      .join(' - ') || 'تعذر تحديد الموقع'
  );
}

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
  return null;
}

export default function LocationPicker({ onLocationChange }: Props) {
  const [marker, setMarker] = useState<[number, number] | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      () => {
        setLoading(false);
        setError('يرجى السماح بالوصول للموقع');
      },
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative rounded-2xl overflow-hidden border border-gray-200 h-64 md:h-80">
        <MapContainer
          center={[26.8206, 30.8025]}
          zoom={6}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClickHandler onPick={pick} />
          {marker && <Marker position={marker} />}
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
          className="flex items-center gap-2 text-blue-600 font-medium disabled:opacity-50"
        >
          <FaLocationArrow />
          {loading ? 'جاري تحديد الموقع...' : 'استخدم موقعي الحالي'}
        </button>
        <label className="text-gray-700">موقع الخدمة</label>
      </div>

      <div className="relative">
        <input
          dir="rtl"
          readOnly
          value={text}
          placeholder="اضغط على الخريطة أو استخدم موقعك الحالي"
          className="w-full h-14 rounded-2xl border border-gray-200 px-6 pr-12 bg-gray-50 text-sm outline-none"
        />
        <FaMapMarkerAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      {error && <p className="text-red-500 text-sm text-right">{error}</p>}
    </div>
  );
}
