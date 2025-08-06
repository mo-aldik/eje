import HomePage from 'pages/home';
import NotFoundPage from 'pages/not-found';
import { Navigate, Route, Routes } from 'react-router-dom';
import { URL } from 'utils/constants';

function App() {
  const { NOT_FOUND } = URL;

  return (
    <Routes>
      <Route path='/'>
        {/* DEFAULT ROUTE */}
        <Route index element={<HomePage />} />

        {/* NOT FOUND */}
        <Route path='404' element={<NotFoundPage />} />
        <Route path='*' element={<Navigate to={NOT_FOUND} />} />
      </Route>
    </Routes>
  );
}

export default App;
