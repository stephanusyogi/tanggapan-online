"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";

interface TpsMapProps {
  latitude: number;
  longitude: number;
  tpsLabel: string;
  locationName: string;
}

export default function TpsMap({ latitude, longitude, tpsLabel, locationName }: TpsMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fix default marker icon in Leaflet webpack/next bundling
    const DefaultIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([latitude, longitude], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      const marker = L.marker([latitude, longitude]).addTo(map);
      marker.bindPopup(`<b>${tpsLabel}</b><br>${locationName}`).openPopup();

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([latitude, longitude], 15);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, tpsLabel, locationName]);

  return <div id="map-container" ref={mapContainerRef} />;
}
