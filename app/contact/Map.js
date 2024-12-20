'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  useEffect(() => {
    const redIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const map = L.map('map').setView([32.6996, 35.2972], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const marker = L.marker([32.6996, 35.2972], { icon: redIcon }).addTo(map);
    marker.bindPopup('<b>זועבי נאדר - רואה חשבון</b><br>אכסאל 702, נצרת').openPopup();

    return () => map.remove();
  }, []);

  return <div id="map" style={{ height: '400px', width: '100%' }} />;
};

export default Map; 