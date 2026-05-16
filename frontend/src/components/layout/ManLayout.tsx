import { Outlet } from 'react-router-dom';
import Header from '../shared/Header';

const ManLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default ManLayout;
