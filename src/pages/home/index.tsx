import { Box, Card, GridItem, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { useGetEjeConstantsApi } from 'apis/use-get-eje-constants-api';
import { useGetEjeDetailsApi } from 'apis/use-get-eje-details-api';
import { usePageParams } from 'hooks/use-page-params';
import { LogoIcon } from 'icons/logo-icon';
import FullPageSpinner from 'pages/full-page-spinner';
import { JSX, useEffect, useMemo } from 'react';
import { Chart } from './components/chart';
import { HeatMap } from './components/heatmap';
import { MapComponent } from './components/map-component';
import { RequestsPlatform } from './components/requests-platform';
import { I24Icon } from './icons/24-icon';
import { I48Icon } from './icons/48-icon';
import { I72Icon } from './icons/72-icon';
import { ClockIcon } from './icons/clock-icon';
import { CompletedIcon } from './icons/completed-icon';
import { ListIcon } from './icons/list-icon';
import { RateIcon } from './icons/rate-icon';
import { RequestsIcon } from './icons/requests-icon';
import { RingIcon } from './icons/ring-icon';
import { ServicesCancelledIcon } from './icons/services-cancelled-icon';
import { ServicesPendingIcon } from './icons/services-pending-icon';
import { ServicesWithoutMissionIcon } from './icons/services-without-mission-icon';
import { UsersIcon } from './icons/users-icon';

const daysInArabic = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

type IconMap = {
  [key: number]: JSX.Element;
};

const iconMap: IconMap = {
  1: <CompletedIcon />,
  2: <RequestsIcon />,
  3: <ServicesPendingIcon />,
  4: <ServicesWithoutMissionIcon />,
  5: <I24Icon />,
  6: <I48Icon />,
  7: <I72Icon />,
  8: <ListIcon />,
  9: <CompletedIcon />,
  10: <ServicesCancelledIcon />,
  11: <ServicesPendingIcon />,
  12: <ServicesWithoutMissionIcon />,
  16: <ServicesWithoutMissionIcon />,
  17: <ServicesPendingIcon />,
};
const HomePage = () => {
  const { getPageParams, setPageParams } = usePageParams();
  const params = getPageParams();
  const { isLoading: isLoadingEjeConstants, data: getEjeConstants } = useGetEjeConstantsApi();
  const { data: details, isLoading } = useGetEjeDetailsApi({ enabled: !!params.from && !!params.to });
  const { data: ejeData } = getEjeConstants ?? {};

  const currentDateText = useMemo(() => {
    const now = new Date();
    const dayName = daysInArabic[now.getDay()];
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    return `${dayName} ${day}/${month}/${year}`;
  }, []);

  useEffect(() => {
    setPageParams({
      from: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0],
      ...params,
    });
  }, []);

  const missions: any = details?.data?.dashboardDetails?.details || [];

  const processData = (missions: any) => {
    const courtData: any = {};

    missions.forEach((mission: any) => {
      const courtId =
        getEjeConstants?.data?.courts?.find((court: any) => court.id === mission?.courtId)?.courtNameAr ?? '-';
      if (!courtData[courtId]) {
        courtData[courtId] = { created: 0, ended: 0 };
      }

      if (mission.createDate) {
        courtData[courtId].created += 1;
      }

      if (mission.endDate && mission.endDate !== '0001-01-01T00:00:00') {
        courtData[courtId].ended += 1;
      }
    });

    const chartData = [['Court', 'Created Missions', 'Ended Missions']];
    Object.keys(courtData).forEach((court) => {
      chartData.push([court, courtData[court].created, courtData[court].ended]);
    });

    return chartData;
  };

  const data = processData(missions);

  const courts = data.slice(1).map((item) => ({
    name: item[0],
    createdMissions: item[1],
    endedMissions: item[2],
  }));

  const totalEndedMissions = courts.reduce((sum, court) => sum + +court.endedMissions, 0);

  if (isLoadingEjeConstants || isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <VStack dir='rtl' alignItems={'stretch'} gap='2' p={'4'} minH={'vh'} bg={'#1A1D21'}>
      <Card.Root
        borderColor={'rgba(255, 255, 255, 0.2)'}
        borderRadius={'16px'}
        bg={'linear-gradient(90deg,#20282B 0%, #1B1E22 50%, #1D2226 100%)'}
        size={'sm'}>
        <Card.Body>
          <HStack justifyContent={'space-between'}>
            <LogoIcon />

            <HStack>
              <RingIcon />

              <Text fontWeight={'semibold'} fontSize={'lg'}>
                {currentDateText}
              </Text>
            </HStack>
          </HStack>
        </Card.Body>
      </Card.Root>

      <HStack>
        {!isLoadingEjeConstants &&
          ejeData?.dashboardDetails?.requestsCounts
            ?.filter((request: any) => {
              return request.key !== 'Total Today' && request.key !== 'Financial Clear Today';
            })
            .map((request: any, index: number) => {
              let label = request.key;
              let value = request.value;

              switch (request.key) {
                case 'Missions UnderExecution Today':
                  label = 'مهام قيد التنفيذ';
                  break;
                case 'Services Pending Payment':
                  label = 'قيد الدفع';
                  break;
                case 'Services With No Mission':
                  label = 'مجدولة';
                  break;
                case 'Services Delayed (>24 Hrs)':
                  label = 'الخدمات المتأخرة\n(> 24 ساعة)';
                  break;
                case 'Services Delayed (> 48 Hrs)':
                  label = 'الخدمات المتأخرة\n(> 48 ساعة)';
                  value = 0;
                  break;
                case 'Services Delayed (> 72 Hrs)':
                  label = 'الخدمات المتأخرة\n(> 72 ساعة)';
                  value = 0;
                  break;
                case 'Total Completed Today':
                  label = 'منتهية اليوم';
                  break;
                default:
                  return null;
              }

              return (
                <Card.Root
                  h={'fill-available'}
                  borderColor={'rgba(255, 255, 255, 0.2)'}
                  borderRadius={'16px'}
                  bg={'linear-gradient(90deg,#20282B 0%, #1B1E22 50%, #1D2226 100%)'}
                  key={index}
                  size='sm'
                  flex={1}>
                  <Card.Body>
                    <HStack justify='space-between'>
                      <VStack align={'stretch'}>
                        <Text>{label}</Text>
                        <Text>{value}</Text>
                      </VStack>

                      {iconMap[request?.id] || <ListIcon />}
                    </HStack>
                  </Card.Body>
                </Card.Root>
              );
            })}
      </HStack>

      <SimpleGrid columns={4} gap='2' flex={1}>
        <VStack alignItems={'stretch'}>
          <Card.Root
            borderColor={'rgba(255, 255, 255, 0.2)'}
            borderRadius={'16px'}
            bg={'linear-gradient(90deg,#20282B 0%, #1B1E22 50%, #1D2226 100%)'}
            size='sm'>
            <Card.Body>
              <HStack justify='space-between'>
                <VStack align={'stretch'}>
                  <Text fontWeight={'semibold'} fontSize={'lg'}>
                    23 ساعة
                  </Text>
                  <Text> من تاريخ الدفع</Text>
                </VStack>

                <ClockIcon />
              </HStack>
            </Card.Body>
          </Card.Root>

          <Card.Root
            borderColor={'rgba(255, 255, 255, 0.2)'}
            borderRadius={'16px'}
            bg={'linear-gradient(90deg,#20282B 0%, #1B1E22 50%, #1D2226 100%)'}
            size='sm'>
            <Card.Body>
              <RequestsPlatform />
            </Card.Body>
          </Card.Root>

          <Card.Root
            borderColor={'rgba(255, 255, 255, 0.2)'}
            borderRadius={'16px'}
            flex={1}
            bg={'linear-gradient(90deg,#20282B 0%, #1B1E22 50%, #1D2226 100%)'}
            size='sm'>
            <Card.Body>
              <VStack align={'stretch'} gap={4} h={'full'}>
                <Text>انتشار الطلبات</Text>

                <HeatMap />
              </VStack>
            </Card.Body>
          </Card.Root>

          <Card.Root borderRadius={'16px'} size='sm' bg={'linear-gradient(90deg, #4A3A19 0%, #312B1E 100%);'}>
            <Card.Body>
              <HStack justify='space-between'>
                <VStack align={'stretch'}>
                  <Text>92.4%</Text>

                  <Text>معدل الرضا الكلي</Text>
                </VStack>

                <RateIcon />
              </HStack>
            </Card.Body>
          </Card.Root>
        </VStack>

        <GridItem colSpan={2} h={'full'} borderRadius={8} overflow={'hidden'}>
          <MapComponent />
        </GridItem>

        <VStack alignItems={'stretch'}>
          <Card.Root
            borderColor={'rgba(255, 255, 255, 0.2)'}
            borderRadius={'16px'}
            bg={'linear-gradient(90deg,#20282B 0%, #1B1E22 50%, #1D2226 100%)'}
            size={'sm'}>
            <Card.Body>
              <Text>انواع الخدمات</Text>

              <Chart />
            </Card.Body>
          </Card.Root>

          <Card.Root
            borderColor={'rgba(255, 255, 255, 0.2)'}
            borderRadius={'16px'}
            bg={'linear-gradient(90deg,#20282B 0%, #1B1E22 50%, #1D2226 100%)'}
            size='sm'
            flex={1}>
            <Card.Body>
              <VStack gap={6} align={'stretch'}>
                <HStack justify='space-between'>
                  <VStack align={'stretch'}>
                    <Text fontWeight={'semibold'} fontSize={'lg'}>
                      {totalEndedMissions.toLocaleString()}
                    </Text>

                    <Text>العدد الكلي </Text>
                  </VStack>
                  <UsersIcon />
                </HStack>

                <Box h='1px' w={'full'} bg='#4E565A' />

                <VStack align={'stretch'} gap={4}>
                  <Text>العدد لكل امارة</Text>

                  <SimpleGrid columns={2} gap={2}>
                    {courts.map((court, index) => (
                      <Card.Root
                        key={index}
                        borderColor={'rgba(255, 255, 255, 0.2)'}
                        borderRadius={'16px'}
                        size='sm'
                        bg={'linear-gradient(90deg,#20282B 0%, #1B1E22 50%, #1D2226 100%)'}>
                        <Card.Body>
                          <VStack align={'stretch'}>
                            <Text>{court.name}</Text>
                            <Text>{court.endedMissions}</Text>
                          </VStack>
                        </Card.Body>
                      </Card.Root>
                    ))}
                  </SimpleGrid>
                </VStack>
              </VStack>
            </Card.Body>
          </Card.Root>
        </VStack>
      </SimpleGrid>
    </VStack>
  );
};

export default HomePage;
