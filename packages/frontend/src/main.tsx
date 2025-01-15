import React from 'react';
import { Sidebar } from './containers/sidebar/sidebar.js';
import { Screens } from './containers/screens/screens.container.js';

const Main = () => {
  return (
    <div className="flex h-full">
      <div>
        <Sidebar />
      </div>
      <div className="flex-1">
        <Screens />
      </div>
    </div>
  );
};

export { Main };
