import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  map.setView([lat, lng]);
  return null;
}

type Props = {
  lat: number;
  lng: number;
  zoom?: number;
  myLoc?: { lat: number; lng: number } | null;
  onClick?: (lat: number, lng: number) => void;
  className?: string;
};

export default function LeafletMap({ lat, lng, zoom = 15, myLoc, onClick, className = 'h-44 w-full' }: Props) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={zoom}
      className={`rounded-2xl ${className}`}
      style={{ zIndex: 0 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Recenter lat={lat} lng={lng} />
      <Marker position={[lat, lng]} />
      {myLoc && <Marker position={[myLoc.lat, myLoc.lng]} icon={blueIcon} title="موقعي الحالي" />}
      {onClick && <ClickHandler onClick={onClick} />}
    </MapContainer>
  );
}

function ClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  const map = useMap();
  map.on('click', (e) => onClick(e.latlng.lat, e.latlng.lng));
  return null;
}
