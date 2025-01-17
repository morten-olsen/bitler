import React from 'react';
import { Fullscreen } from '../../components/layouts/fullscreen/fullscreen';
import { Screens } from '../screens/screens';
import { Sidebar } from '../sidebar/sidebar';
import { useDeviceSize } from '../../hooks/screen';

const Container = () => {
  const isMobile = useDeviceSize('<', 'tablet');
  return (
    <Fullscreen>
      <div className="h-full w-full flex">
        {!isMobile && <Sidebar />}
        <Screens />
      </div>
    </Fullscreen>
  );
};

export { Container };
