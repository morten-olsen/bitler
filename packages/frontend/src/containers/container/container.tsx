import React from 'react';
import { Fullscreen } from '../../components/layouts/fullscreen/fullscreen';
import { Screens } from '../screens/screens';
import { Sidebar } from '../sidebar/sidebar';

const Container = () => {
  return (
    <Fullscreen>
      <div className="h-full w-full flex">
        <Sidebar />
        <Screens />
      </div>
    </Fullscreen>
  );
};

export { Container };
