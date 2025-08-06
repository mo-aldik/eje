import { Box, Text, VStack } from '@chakra-ui/react';
import { getEjeDetailsApiEndpointIdentifier } from 'apis/use-get-eje-details-api';
import { ArcElement, Chart as ChartJS, ChartOptions, Legend, Tooltip } from 'chart.js';
import dayjs from 'dayjs';
import { useGetQueryData } from 'hooks/use-get-query-data';
import { usePageParams } from 'hooks/use-page-params';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export function RequestsPlatform() {
  const { getPageParams } = usePageParams();
  const { from, to, courtId, missionType, agentId } = getPageParams();

  const { data: details } =
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

  const data = details?.dashboardDetails?.details || [];

  const extractExactDate = (dateStr: string): string => {
    return dayjs(dateStr).format('YYYY') + ' ' + dayjs(dateStr).format('MMM');
  };

  const processData = () => {
    const missions: { [key: string]: { created: number; ended: number; canceled: number } } = {};

    data.forEach((mission: any) => {
      const createDate = extractExactDate(mission.createDate);
      const endDateExact = extractExactDate(mission.endDate);

      if (!missions[createDate]) {
        missions[createDate] = { created: 0, ended: 0, canceled: 0 };
      }
      missions[createDate].created += 1;

      if (mission.status === 7 || mission.status === 8) {
        missions[createDate].canceled += 1;
      }

      if (endDateExact !== '1901 Jan') {
        if (!missions[endDateExact]) {
          missions[endDateExact] = { created: 0, ended: 0, canceled: 0 };
        }
        missions[endDateExact].ended += 1;
      }
    });

    return missions;
  };

  const missions = processData();

  let totalCreated = 0;
  let totalEnded = 0;
  let totalCanceled = 0;

  Object.values(missions).forEach((entry: any) => {
    totalCreated += entry.created;
    totalEnded += entry.ended;
    totalCanceled += entry.canceled;
  });

  const doughnutData = {
    labels: ['الطلبات المنشأة', 'الطلبات المكتملة', 'الطلبات الملغاة'],
    datasets: [
      {
        data: [totalCreated, totalEnded, totalCanceled],
        backgroundColor: ['#4CBB17', '#007BFF', '#FF6347'],
        borderColor: ['#4CBB17', '#007BFF', '#FF6347'],
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    rotation: -90,
    circumference: 180,
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false,
        position: 'bottom',
        labels: {
          color: '#fff',
        },
      },
    },
    maintainAspectRatio: false,
    cutout: '93%',
  };

  return (
    <VStack align={'stretch'}>
      <Text>الطلبات</Text>

      {data?.length !== 0 ? (
        <Box>
          <Doughnut data={doughnutData} options={options} />
        </Box>
      ) : (
        <Text mx={'auto'} my={'lg'}>
          No data available for the selected criteria.
        </Text>
      )}
    </VStack>
  );
}
