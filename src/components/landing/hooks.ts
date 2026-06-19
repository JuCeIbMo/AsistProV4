import { useEffect, useRef, useState } from 'react';
import { chatMessages } from './content';

export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );

    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

export function useStickyHeaderOffset(): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return scrolled;
}

export function useChatPlayback() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    function show(index: number) {
      if (index >= chatMessages.length) {
        timerRef.current = setTimeout(() => {
          setVisibleCount(0);
          setIsTyping(false);
          timerRef.current = setTimeout(() => show(0), 900);
        }, 4200);
        return;
      }

      if (chatMessages[index].side === 'bot') {
        setIsTyping(true);
        timerRef.current = setTimeout(() => {
          setIsTyping(false);
          setVisibleCount(index + 1);
          timerRef.current = setTimeout(() => show(index + 1), 1100);
        }, 1000);
        return;
      }

      setVisibleCount(index + 1);
      timerRef.current = setTimeout(() => show(index + 1), 850);
    }

    timerRef.current = setTimeout(() => show(0), 1000);
    return () => clearTimeout(timerRef.current);
  }, []);

  return { visibleCount, isTyping };
}
