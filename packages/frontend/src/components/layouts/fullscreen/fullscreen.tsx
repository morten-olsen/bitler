import React from 'react';

type FullscreenProps = {
  children: React.ReactNode;
};
const Fullscreen = ({ children }: FullscreenProps) => {
  return (
    <div className="fixed inset-0 bg-default-50">
      {children}
    </div>
  );
}

export { Fullscreen };
