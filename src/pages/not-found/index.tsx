import { Center, Text } from '@chakra-ui/react';
import { LogoIcon } from 'icons/logo-icon';
import { Layout } from 'layouts';
import { useNavigate } from 'react-router-dom';
import { URL } from 'utils/constants';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Center minH='100vh' flexDirection='column'>
        <LogoIcon mb={4} onClick={() => navigate(URL.HOME)} cursor='pointer' />

        <Text fontSize='xl'>عذرًا، الصفحة غير موجودة.</Text>
      </Center>
    </Layout>
  );
};
export default NotFoundPage;
