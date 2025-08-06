import qs, { ParseOptions, StringifyOptions } from 'query-string';
import { useLocation, useSearchParams } from 'react-router-dom';

export type TParam = string | number | boolean | (string | number | boolean | null)[] | null;

export const usePageParams = () => {
  const [, setSearchParams] = useSearchParams();
  const location = useLocation();

  const getPageParams = (options?: ParseOptions) => {
    const params: qs.ParsedQuery<string | number | boolean> = qs.parse(location.search, {
      parseNumbers: true,
      parseBooleans: true,
      ...options,
    });

    // Remove undefined or null values before returning params
    Object.keys(params).forEach((key) => {
      if (params[key] === null || params[key] === undefined || params[key] === '') {
        delete params[key];
      }
    });

    return params;
  };

  const setPageParams = (params: Record<string, any>, options?: StringifyOptions) => {
    const stringified = qs.stringify(params, { skipEmptyString: true, skipNull: true, ...options });
    setSearchParams(stringified, { replace: true });
  };

  return { getPageParams, setPageParams };
};
