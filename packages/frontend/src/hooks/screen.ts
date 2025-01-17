import { useEffect, useState } from 'react';

const deviceSizes = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
};

type Compare = '>' | '<' | '>=' | '<=';

const useDeviceSize = (compare: Compare, key: keyof typeof deviceSizes) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const size = deviceSizes[key];

      switch (compare) {
        case '>':
          setMatches(windowWidth > size);
          break;
        case '<':
          setMatches(windowWidth < size);
          break;
        case '>=':
          setMatches(windowWidth >= size);
          break;
        case '<=':
          setMatches(windowWidth <= size);
          break;
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [key, compare]);

  return matches;
};

export { useDeviceSize };
