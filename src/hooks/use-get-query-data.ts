import { QueryKey, useQueryClient } from '@tanstack/react-query';

export const useGetQueryData = (identifier: QueryKey) => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData(identifier) as any;
};
