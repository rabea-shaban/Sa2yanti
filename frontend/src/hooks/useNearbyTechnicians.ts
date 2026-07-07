import { useState, useEffect, useCallback, useMemo } from 'react';
import { getNearbyTechnicians } from '../services/nearby.service';
import type { NearbyTechnician } from '../services/nearby.service';
import axiosInstance from '../services/Api';

export interface ServiceType {
  _id: string;
  name: string;
}

export function useNearbyTechnicians() {
  const [technicians, setTechnicians] = useState<NearbyTechnician[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // User current location coordinates
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);

  // Filters State
  const [radius, setRadius] = useState<number>(20); // default 20 KM
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('كل الخدمات');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'experience'>('distance');
  const [availableOnly, setAvailableOnly] = useState(false);

  // Services list
  const [allServices, setAllServices] = useState<ServiceType[]>([]);

  // 1. Fetch all services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axiosInstance.get('/services');
        if (res.data?.success && Array.isArray(res.data.services)) {
          setAllServices(res.data.services);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      }
    };
    fetchServices();
  }, []);

  // 2. Request user GPS location
  const requestLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    setGpsError(null);

    if (!navigator.geolocation) {
      setError('المتصفح لا يدعم تحديد الموقع.');
      setGpsError('GPS Disabled');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLat(position.coords.latitude);
        setUserLng(position.coords.longitude);
        setGpsError(null);
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError('يرجى السماح بالوصول إلى موقعك.');
          setGpsError('Permission Denied');
        } else {
          setError('يرجى تشغيل خدمة الموقع.');
          setGpsError('GPS Disabled');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Request location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // 3. Fetch nearby technicians from API
  const fetchData = useCallback(async () => {
    if (userLat === null || userLng === null) return;
    setLoading(true);
    setError(null);
    try {
      const service = allServices.find((s) => s.name === serviceFilter);
      const serviceId = serviceFilter === 'كل الخدمات' ? '' : (service?._id || '');

      const res = await getNearbyTechnicians(userLat, userLng, radius, serviceId);
      setTechnicians(res.data || []);
    } catch (err: any) {
      console.error('Error getting nearby technicians:', err);
      setError(err.response?.data?.message || 'تعذر الاتصال بالخادم.');
    } finally {
      setLoading(false);
    }
  }, [userLat, userLng, radius, serviceFilter, allServices]);

  // Fetch when coordinates or radius change
  useEffect(() => {
    if (userLat !== null && userLng !== null) {
      fetchData();
    }
  }, [userLat, userLng, radius, serviceFilter, fetchData]);

  // 4. Client-side filtering, sorting, searching
  const filteredTechnicians = useMemo(() => {
    let result = [...technicians];

    // Filter by search query (name)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => t.name.toLowerCase().includes(q));
    }

    // Sort technicians
    result.sort((a, b) => {
      if (sortBy === 'distance') {
        return a.distance - b.distance;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'experience') {
        return b.completedJobs - a.completedJobs;
      }
      return 0;
    });

    return result;
  }, [technicians, searchQuery, sortBy]);

  return {
    technicians: filteredTechnicians,
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
    availableOnly,
    setAvailableOnly,
    allServices,
    requestLocation,
    refresh: fetchData,
  };
}
