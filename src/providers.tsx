import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { LoadScript } from '@react-google-maps/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ColorModeProvider } from 'components/ui/color-mode';
import { BrowserRouter } from 'react-router-dom';

interface ProvidersProps {
  children: React.ReactNode;
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: ProvidersProps) {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider value={defaultSystem}>
          <ColorModeProvider defaultTheme='dark'>
            <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={['visualization']}>
              {children}
            </LoadScript>
          </ColorModeProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
