import { Box } from '@chakra-ui/react';
import { getEjeConstantsApiEndpointIdentifier } from 'apis/use-get-eje-constants-api';
import { getEjeDetailsApiEndpointIdentifier } from 'apis/use-get-eje-details-api';
import { ArcElement, Chart as ChartJS, ChartOptions, Legend, Tooltip } from 'chart.js';
import { useGetQueryData } from 'hooks/use-get-query-data';
import { usePageParams } from 'hooks/use-page-params';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const Chart = () => {
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

  const { data: detailsNames } = useGetQueryData([getEjeConstantsApiEndpointIdentifier]) ?? {};

  const missions = details?.dashboardDetails?.details || [];
  const missionTypes = detailsNames?.missionTypes || [];

  const getCategoryCounts = (data: any) => {
    const counts: any = {};

    data.forEach((mission: any) => {
      const categoryId = mission.typeId;

      if (categoryId === 0) return;

      if (counts[categoryId]) {
        counts[categoryId]++;
      } else {
        counts[categoryId] = 1;
      }
    });

    return counts;
  };

  const categoryCounts = getCategoryCounts(missions);

  const dataForChart = [
    ['Mission Type', 'No of Requests'],
    ...Object.entries(categoryCounts).map(([category, count]) => {
      const name = missionTypes?.findIndex((m: any) => {
        return m.id == category;
      });

      return [missionTypes[name]?.missionTypeName, count];
    }),
  ];

  const labels = dataForChart.slice(1).map((item) => item[0]); // اسم المهمة
  const chartData = dataForChart.slice(1).map((item) => item[1]); // عدد الطلبات

  const colors = labels.map(() => generateRandomColor());

  const options: ChartOptions<'doughnut'> = {
    plugins: {
      legend: {
        display: true,
        position: 'right', // أو 'top' أو 'bottom' حسب ما تفضله
        labels: {
          color: '#FFFFFF', // لون النص
          font: {
            size: 14,
          },
          usePointStyle: true,
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  const dataDoughnut = {
    labels: labels,
    datasets: [
      {
        data: chartData,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box>
      <Doughnut data={dataDoughnut} options={options} />
    </Box>
  );
};
