import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      const scrollContainer = document.getElementById('main-scroll-container');

      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
