import React from 'react';
import { ScreensItem } from './view.screens';
import { useDeviceSize } from '../../../hooks/screen';
import { DesktopHeader } from './view.desktop-header';
import { MobileHeader } from './view.mobile-header';

const Screens = () => {
  const isMobile = useDeviceSize('<', 'tablet');

  return (
    <div className="h-full flex-1 flex flex-col py-4 gap-4">
      {!isMobile && <DesktopHeader />}
      {isMobile && <MobileHeader />}
      <ScreensItem />
    </div>
  );
};

export { Screens };
