import { Center, Spinner } from '@chakra-ui/react';
import { LogoIcon } from 'icons/logo-icon';
import { Layout } from 'layouts';

const FullPageSpinner = () => {
  return (
    <Layout>
      <Center minH='100vh' flexDirection='column'>
        <LogoIcon mb={4} />

        <Spinner size='lg' color='colorPalette.600' colorPalette={'yellow'} />
      </Center>
    </Layout>
  );
};
export default FullPageSpinner;
