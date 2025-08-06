/**
 * @name use-api-wrapper
 * @author Mohamed Aldik
 * @summary Custom hooks for fetching and mutating data via react-query.
 * @access private
 *
 * Please don't make any changes to this file.
 */

import {
  MutationFunction,
  QueryFunction,
  QueryKey,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'; // Ensure this is the correct package for v5

type QueryWrapperArgs<TQueryFnData, TError, TData, TQueryKey extends QueryKey> = [
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'>,
];

type MutationWrapperArgs<TData, TError, TVariables, TContext> = [
  mutationFn: MutationFunction<TData, TVariables>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'>,
];

/**
 * Custom hook for data fetching actions using TanStack Query.
 */
export function useQueryWrapper<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(...args: QueryWrapperArgs<TQueryFnData, TError, TData, TQueryKey>): UseQueryResult<TData, TError> {
  const [queryKey, queryFn, options] = args;
  return useQuery({
    queryKey,
    queryFn,
    ...options,
  });
}

/**
 * Custom hook for data mutation actions using TanStack Query.
 */
export function useMutationWrapper<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
  ...args: MutationWrapperArgs<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> {
  const [mutationFn, options] = args;
  return useMutation({
    mutationFn,
    ...options,
  });
}
