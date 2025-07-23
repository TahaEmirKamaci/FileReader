import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

const Layout = () => {
  return (
    <div>
      <Navigation />
      <div className="container mx-auto p-4">
        <Outlet />
      </div>
    </div>
  );
};
export default Layout;