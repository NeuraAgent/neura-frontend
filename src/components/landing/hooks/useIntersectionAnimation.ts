import { useEffect, useRef, useState } from 'react';

import { INTERSECTION_CONFIG } from '../constants';

interface UseIntersectionAnimationOptions {
  itemCount: number;
  staggerDelay?: number;
}

export const useIntersectionAnimation = ({
  itemCount,
  staggerDelay = 100,
}: UseIntersectionAnimationOptions) => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (itemCount === 0) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Array.from({ length: itemCount }).forEach((_, index) => {
            setTimeout(() => {
              setVisibleItems(prev => [...prev, index]);
            }, index * staggerDelay);
          });
          observer.disconnect();
        }
      });
    }, INTERSECTION_CONFIG);

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [itemCount, staggerDelay]);

  return { visibleItems, sectionRef };
};
