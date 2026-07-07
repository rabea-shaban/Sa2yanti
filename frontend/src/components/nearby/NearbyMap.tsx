import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { NearbyTechnician } from '../../services/nearby.service';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icons for blue and red markers
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const techIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface NearbyMapProps {
  userLat: number | null;
  userLng: number | null;
  technicians: NearbyTechnician[];
}

function FitBounds({
  userLat,
  userLng,
  technicians,
}: {
  userLat: number | null;
  userLng: number | null;
  technicians: NearbyTechnician[];
}) {
  const map = useMap();

  useEffect(() => {
    if (userLat === null || userLng === null) return;

    const bounds = L.latLngBounds([[userLat, userLng] as [number, number]]);
    technicians.forEach((tech) => {
      if (tech.latitude && tech.longitude) {
        bounds.extend([tech.latitude, tech.longitude] as [number, number]);
      }
    });

    map.fitBounds(bounds, { padding: [35, 35] });
  }, [map, userLat, userLng, technicians]);

  return null;
}

export const NearbyMap: React.FC<NearbyMapProps> = ({
  userLat,
  userLng,
  technicians,
}) => {
  const navigate = useNavigate();

  if (userLat === null || userLng === null) {
    return (
      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-500 font-semibold animate-pulse rounded-3xl border border-slate-100 shadow-inner">
        جاري تهيئة الخريطة وتحديد موقعك...
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[300px] md:min-h-[400px] rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
      <MapContainer
        center={[userLat, userLng] as [number, number]}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* User Location Marker */}
        <Marker position={[userLat, userLng] as [number, number]} icon={userIcon}>
          <Popup>
            <div className="text-center font-bold text-xs">موقعك الحالي</div>
          </Popup>
        </Marker>

        {/* Technicians Markers */}
        {technicians.map((tech) => {
          if (!tech.latitude || !tech.longitude) return null;
          return (
            <Marker
              key={tech._id}
              position={[tech.latitude, tech.longitude] as [number, number]}
              icon={techIcon}
            >
              <Popup>
                <div className="p-2 text-right text-slate-800 min-w-[140px]" dir="rtl">
                  <h5 className="font-bold text-xs mb-1 text-slate-900">{tech.name}</h5>
                  <p className="text-[10px] text-slate-550 mb-0.5 font-semibold">المسافة: {tech.distance} كم</p>
                  <p className="text-[10px] text-amber-500 font-bold mb-2">⭐ {tech.rating.toFixed(1)}</p>
                  <button
                    type="button"
                    onClick={() => navigate(`/technicians/${tech._id}`)}
                    className="w-full text-center py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold cursor-pointer transition border-none"
                  >
                    عرض التفاصيل
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <FitBounds userLat={userLat} userLng={userLng} technicians={technicians} />
      </MapContainer>
    </div>
  );
};

export default NearbyMap;
