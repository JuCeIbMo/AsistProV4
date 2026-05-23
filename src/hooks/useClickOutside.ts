import { useEffect, type RefObject } from 'react';

export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  handler: () => void
): void {
  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      const element = ref.current;
      if (!element) return;

      if (!element.contains(event.target as Node)) {
        handler();
      }
    }

    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [ref, handler]);
}
