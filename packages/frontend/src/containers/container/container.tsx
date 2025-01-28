import React from 'react';
import { Fullscreen } from '../../components/layouts/fullscreen/fullscreen';
import { Screens, ScreensProvider } from '../screens/screens';
import { Sidebar } from '../sidebar/sidebar';
import { useDeviceSize } from '../../hooks/screen';

const Container = () => {
  const isMobile = useDeviceSize('<', 'tablet');
  return (
    <Fullscreen>
      <ScreensProvider>
        <div className="h-full w-full flex">
          {!isMobile && <Sidebar />}
          <Screens />
        </div>
      </ScreensProvider>
    </Fullscreen>
  );
};

export { Container };
