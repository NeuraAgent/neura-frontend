import type { MouseEvent } from 'react';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useSectionNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSectionClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      e.preventDefault();

      if (location.pathname !== '/') {
        navigate('/', { replace: false });
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    [location.pathname, navigate]
  );

  return { handleSectionClick };
};
