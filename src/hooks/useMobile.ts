import { useEffect, useLayoutEffect, useState } from 'react';

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

function matchesMobile(breakpoint: number): boolean {
  return typeof window !== 'undefined' && window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
}

export function useMobile(breakpoint = 768): boolean {
  const [mobile, setMobile] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setMobile(matchesMobile(breakpoint));
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);

  return mobile;
}
