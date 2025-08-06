import { GoogleMap, Marker, MarkerClusterer } from '@react-google-maps/api';
import { getEjeDetailsApiEndpointIdentifier } from 'apis/use-get-eje-details-api';
import { useGetQueryData } from 'hooks/use-get-query-data';
import { usePageParams } from 'hooks/use-page-params';
import { useState } from 'react';
import markPinImg from '../../../assets/dot-pin.png';

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '200px',
};

const mapOptions = {
  styles: [
    {
      elementType: 'geometry',
      stylers: [{ color: '#181818' }],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{ color: '#b0b0b0' }],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#1a1a1a' }],
    },
    {
      featureType: 'administrative',
      elementType: 'geometry',
      stylers: [{ color: '#222222' }],
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [{ color: '#202020' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#1a1a1a' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#2c2c2c' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#1e1e1e' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#aaaaaa' }],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#1f1f1f' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#141414' }],
    },
  ],
  disableDefaultUI: true,
};

const center = { lat: 25.276987, lng: 55.296249 };

const validLatLng = (lat: number | undefined, lng: number | undefined) => {
  return lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng);
};

const colors: any = {
  InProgress: '#B68A35',
  NotStarted: '#B68A35',
  Free: '#B68A35',
  NoDriver: '#B68A35',
  jobOrders: '#B68A35',
  Other: '#B68A35',
};

// نوع البيانات داخل الدونات
type CategoryData = {
  category: string;
  count: number;
};
// توليد رسم SVG للدونات
const createDoughnutChart = (data: CategoryData[], size = 80, strokeWidth = 30): string => {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  let cumulativePercentage = 0;

  const calculateCoordinates = (percentage: number) => {
    const angle = 2 * Math.PI * percentage;
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    return { x, y };
  };

  const paths = data.map((item) => {
    const percentage = item.count / total;
    const start = calculateCoordinates(cumulativePercentage);
    cumulativePercentage += percentage;
    const end = calculateCoordinates(cumulativePercentage);

    const largeArcFlag = percentage > 0.5 ? 1 : 0;

    const pathData = `
      M ${start.x} ${start.y}
      A 1 1 0 ${largeArcFlag} 1 ${end.x} ${end.y}
      L 0 0
    `;

    return `
      <path d="${pathData}" fill="${colors[item.category] || '#999'}" transform="scale(${1 - strokeWidth / size})" />
    `;
  });

  const svg = `
    <svg width="${size}" height="${size}" viewBox="-1 -1 2 2" xmlns="http://www.w3.org/2000/svg">
      ${paths.join('')}
      <circle cx="0" cy="0" r="0.5" fill="#B68A35" />
      <text x="0" y="0.15" text-anchor="middle" font-size="0.4" fill="white">${total}</text>
    </svg>
  `;

  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
};

export const MapComponent = () => {
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

  const missionMarkers = dashboardDetails
    .filter((mission: any) => mission?.missionCategoryId === 1 && mission?.missionAddressLatLng)
    .map((mission: any) => {
      const [lat, lng] = mission.missionAddressLatLng.split(',').map(Number);
      return validLatLng(lat, lng) ? { lat, lng } : null;
    })
    .filter((marker: null) => marker !== null);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      options={mapOptions}
      onLoad={() => setMapLoaded(true)}>
      {mapLoaded && (
        <MarkerClusterer
          options={{
            minimumClusterSize: 3,
            gridSize: 60,
            maxZoom: 15,
            averageCenter: true,
            styles: [
              {
                url: '', // تم التعويض عنه في calculator
                height: 0,
                width: 0,
              },
            ],
            calculator: (markers: any[], _) => {
              // يمكن لاحقًا تقسيم الماركرات حسب أنواع لو عندك النوع موجود
              const groupedData = [{ category: 'jobOrders', count: markers.length }];
              const iconUrl = createDoughnutChart(groupedData);
              return {
                index: 6,
                title: '',
                text: '',
                html: `<div style="width:80px;height:80px;background-color:transparent;"> <img src="${iconUrl}" style="width:100%;height:100%" /> </div>`,
              };
            },
          }}>
          {(clusterer) =>
            missionMarkers.map((marker: any, index: number) => (
              <Marker key={index} position={marker} clusterer={clusterer} icon={{ url: markPinImg }} />
            ))
          }
        </MarkerClusterer>
      )}
    </GoogleMap>
  );
};
