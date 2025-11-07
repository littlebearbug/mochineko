'use client';

import { useEffect, useRef } from 'react';
import { memo } from 'react';

const lerp = (start: number, end: number, t: number) => {
  return start * (1 - t) + end * t;
};

const ProgressTip = () => {
  const barRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const targetProgress = useRef(0);
  const currentProgress = useRef(0);

  useEffect(() => {
    const tick = () => {
      const distance = targetProgress.current - currentProgress.current;

      if (Math.abs(distance) < 0.01) {
        currentProgress.current = targetProgress.current;
      } else {
        currentProgress.current = lerp(
          currentProgress.current,
          targetProgress.current,
          0.1
        );
      }

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${currentProgress.current / 100})`;
      }

      if (Math.abs(targetProgress.current - currentProgress.current) >= 0.01) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollTop = document.documentElement.scrollTop;

      const scrollPercentage = Math.min(
        Math.max((scrollTop / (scrollHeight - clientHeight)) * 100, 0),
        100
      );

      targetProgress.current = scrollPercentage;

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div>
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div
          ref={barRef}
          className="absolute top-0 left-0 h-full w-full origin-left rounded-r-full bg-rose-500"
          style={{ transform: 'scaleX(0)' }}
        ></div>
      </div>
    </div>
  );
};

export default memo(ProgressTip);
