import React from 'react';
import type { NearbyTechnician } from '../../services/nearby.service';
import NearbyCard from './NearbyCard';
import EmptyNearby from './EmptyNearby';

interface NearbyListProps {
  technicians: NearbyTechnician[];
  selectedServiceId?: string;
  onRefresh: () => void;
}

export const NearbyList: React.FC<NearbyListProps> = ({
  technicians,
  selectedServiceId,
  onRefresh,
}) => {
  if (technicians.length === 0) {
    return <EmptyNearby onRefresh={onRefresh} />;
  }

  return (
    <div className="space-y-4 w-full">
      {technicians.map((tech) => (
        <NearbyCard
          key={tech._id}
          tech={tech}
          selectedServiceId={selectedServiceId}
        />
      ))}
    </div>
  );
};

export default NearbyList;
