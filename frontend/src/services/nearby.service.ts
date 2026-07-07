import axiosInstance from './Api';

export interface NearbyTechnician {
  _id: string;
  name: string;
  email?: string;
  distance: number;
  rating: number;
  completedJobs: number;
  phone: string;
  address: string;
  city: string;
  avatar: string;
  services: {
    _id: string;
    name: string;
  }[];
  latitude: number;
  longitude: number;
}

export const getNearbyTechnicians = (
  lat: number,
  lng: number,
  radius: number,
  serviceId: string
) => {
  return axiosInstance.get<NearbyTechnician[]>('/technicians/nearby', {
    params: {
      lat,
      lng,
      radius,
      ...(serviceId ? { serviceId } : {}),
    },
  });
};

export const getTechnicianById = (id: string) => {
  return axiosInstance.get<{ success: boolean; technician: NearbyTechnician }>(`/technicians/${id}`);
};
