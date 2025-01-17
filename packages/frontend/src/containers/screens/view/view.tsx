import React from 'react';
import { ScreenSelector } from './view.selector';
import { HeaderTabs } from './view.tabs';
import { ScreensItem } from './view.screens';

const Screens = () => {
  return (
    <div className="h-full flex-1 flex flex-col py-4 gap-4">
      <div className="hidden md:block">
        <HeaderTabs />
      </div>
      <div className="block md:hidden">
        <ScreenSelector />
      </div>
      <ScreensItem />
    </div>
  );
};

export { Screens };
