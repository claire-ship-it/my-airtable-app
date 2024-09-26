import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const libraries = ["visualization"];

const BookingsHeatMap = ({ bookings }) => {
  const [map, setMap] = useState(null);
  const [heatmap, setHeatmap] = useState(null);
  const [error, setError] = useState(null);

  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  const center = {
    lat: 31.9686, // Approximate center of Texas
    lng: -99.9018
  };

  const zipCoordinates = {
    '79413': { lat: 33.5351, lng: -101.8897 },
    '79424': { lat: 33.4873, lng: -101.9501 },
    '79363': { lat: 33.6620, lng: -101.6835 },
    '79410': { lat: 33.5779, lng: -101.8552 },
  };

  const onLoad = useCallback((map) => {
    console.log("Map loaded successfully");
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (map && window.google && bookings.length > 0) {
      console.log("Processing booking data");
      const heatmapData = bookings.reduce((acc, booking) => {
        const zipCode = booking.fields['Zip'];
        if (zipCode && zipCoordinates[zipCode]) {
          acc.push(new window.google.maps.LatLng(
            zipCoordinates[zipCode].lat,
            zipCoordinates[zipCode].lng
          ));
        }
        return acc;
      }, []);

      console.log("Processed heatmap data:", heatmapData);

      if (heatmap) {
        heatmap.setMap(null);
      }

      const newHeatmap = new window.google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map: map,
      });

      setHeatmap(newHeatmap);
    }
  }, [map, bookings]);

  const handleLoadError = (error) => {
    console.error("Error loading Google Maps:", error);
    setError("Failed to load Google Maps. Please check your internet connection and try again.");
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  console.log("Rendering BookingsHeatMap component");
  console.log("API Key:", process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

  return (
    <div className="bookings-heat-map">
      <h2>Bookings Heat Map by Zip Code in Texas</h2>
      <LoadScript 
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
        onError={handleLoadError}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={6}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {/* Heatmap is added directly to the map in the useEffect */}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default BookingsHeatMap;