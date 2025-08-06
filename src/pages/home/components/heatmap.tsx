import { GoogleMap, HeatmapLayer } from '@react-google-maps/api';
import { getEjeDetailsApiEndpointIdentifier } from 'apis/use-get-eje-details-api';
import { useGetQueryData } from 'hooks/use-get-query-data';
import { usePageParams } from 'hooks/use-page-params';
import { useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '200px',
};

const mapOptions = {
  styles: [
    {
      elementType: 'geometry',
      stylers: [{ color: '#2c2c2c' }],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#2c2c2c' }],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{ color: '#e0e0e0' }],
    },
    {
      featureType: 'administrative',
      elementType: 'geometry',
      stylers: [{ color: '#3d3d3d' }],
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [{ color: '#444444' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#36454f' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#5e5e5e' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d0d0d0' }],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#3b3b3b' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#1e2a38' }],
    },
  ],
  disableDefaultUI: true,
};

const center = { lat: 25.276987, lng: 55.296249 };

const validLatLng = (lat: number | undefined, lng: number | undefined) => {
  return lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng);
};

export const HeatMap = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const { getPageParams } = usePageParams();

  const { from, to, courtId, missionType, agentId } = getPageParams();

  const { data } =
    useGetQueryData([
      getEjeDetailsApiEndpointIdentifier,
      {
        from,
        to,
        courtId,
        missionType,
        agentId,
      },
    ]) ?? {};

  const dashboardDetails = data?.dashboardDetails?.details || [];
  const missionMarkers = dashboardDetails.filter(
    (mission: any) => mission?.missionCategoryId === 1 && mission?.missionAddressLatLng,
  );

  const heatmapData = missionMarkers
    .map((mission: any) => {
      const [lat, lng] = mission?.missionAddressLatLng?.split(',')?.map(Number) ?? [null, null];
      return validLatLng(lat, lng) ? new window.google.maps.LatLng(lat, lng) : null;
    })
    .filter((latLng: any) => latLng !== null);
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={8}
      options={mapOptions}
      onLoad={() => setMapLoaded(true)}>
      {mapLoaded && heatmapData.length > 0 && (
        <HeatmapLayer
          data={heatmapData}
          options={{
            radius: 50,
            opacity: 0.7,
          }}
        />
      )}
    </GoogleMap>
  );
};
