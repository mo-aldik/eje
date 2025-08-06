import { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { TParam, usePageParams } from 'hooks/use-page-params';
import http from './config/http-service';
import { useQueryWrapper } from './config/use-api-wrapper';

const endpoint = 'api/Dashboard/GetDashboardData';
export const getEjeDetailsApiEndpointIdentifier = endpoint;

type TData = Record<string, any>;
type TError = AxiosError;

type TQueryKey = [
  typeof endpoint,
  {
    from: TParam;
    to: TParam;
    courtId: TParam;
    missionType: TParam;
    agentId: TParam;
  },
];

type Options = Omit<UseQueryOptions<unknown, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'>;
type ReturnType = UseQueryResult<TData, TError>;

export function useGetEjeDetailsApi(options?: Options): ReturnType {
  const { getPageParams } = usePageParams();
  const { from, to, courtId, missionType, agentId } = getPageParams();

  const queryFn = async () => {
    try {
      const { data } = await http.get(endpoint, {
        params: {
          from,
          to,
          courtId,
          missionType,
          agentId,
        },
      });

      return data;
    } catch (error: any) {
      if (!error.response.status || !error.response.data.Message) throw error;

      // Important to not show the toast in unauthorized case.
      if (error.response?.status === 401) throw error;

      throw error;
    }
  };

  return useQueryWrapper(
    [
      endpoint,
      {
        from,
        to,
        courtId,
        missionType,
        agentId,
      },
    ],
    queryFn,
    {
      ...options,
    },
  );
}
