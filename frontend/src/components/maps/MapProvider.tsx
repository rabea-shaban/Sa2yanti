import React from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';

interface MapProviderProps {
  children: React.ReactNode;
}

export const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error('Google Maps API key is missing. Please define VITE_GOOGLE_MAPS_API_KEY inside your .env file.');
  }

  return (
    <APIProvider apiKey={apiKey || ''}>
      {children}
    </APIProvider>
  );
};
