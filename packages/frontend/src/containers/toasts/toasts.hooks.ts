import { useCallback, useContext, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';

import { Toast, ToastsContext } from './toasts.context.js';

const useToastsContext = () => {
  const context = useContext(ToastsContext);
  if (!context) {
    throw new Error('useToastsContext must be used within a ToastsProvider');
  }
  return context;
};

const useAddToast = () => {
  const { store } = useToastsContext();
  return useCallback(
    (toast: Toast) => {
      store.addToast({
        id: nanoid(),
        ...toast,
      });
    },
    [store],
  );
};

const useToasts = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { store } = useToastsContext();
  useEffect(() => {
    const updateToasts = () => {
      setToasts(store.toasts);
    };
    store.on('updated', updateToasts);
    return () => {
      store.off('updated', updateToasts);
    };
  }, [store]);
  return toasts;
};

export { useAddToast, useToasts };
