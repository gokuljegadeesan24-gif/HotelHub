import { useEffect, useState } from 'react';

const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

function MapView({ latitude, longitude, title }) {
  const lat = Number(latitude);
  const lng = Number(longitude);
  const [distance, setDistance] = useState(null);
  const [userPos, setUserPos] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: uLat, longitude: uLng } = pos.coords;
        setUserPos({ lat: uLat, lng: uLng });
        setDistance(getDistance(uLat, uLng, lat, lng));
      },
      () => {}
    );
  }, [lat, lng]);

  const delta = 0.01;
  const mapSrc =
    `https://www.openstreetmap.org/export/embed.html?bbox=${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}` +
    `&layer=mapnik&marker=${lat}%2C${lng}`;

  const directionsUrl = userPos
    ? `https://www.google.com/maps/dir/?api=1&origin=${userPos.lat},${userPos.lng}&destination=${lat},${lng}`
    : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div className="map-box">
      <iframe title={`Map showing the location of ${title}`} src={mapSrc} loading="lazy" />
      <div className="map-info">
        <span>
          {lat.toFixed(5)}, {lng.toFixed(5)}
          {distance !== null && ` • ${distance.toFixed(1)} km from you`}
        </span>
        <a href={directionsUrl} target="_blank" rel="noreferrer">
          {userPos ? 'Get directions' : 'Open in Google Maps'}
        </a>
      </div>
    </div>
  );
}

export default MapView;
