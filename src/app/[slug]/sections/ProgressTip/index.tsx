'use client';

import { useEffect, useState, useRef } from 'react';
import { memo } from 'react';

const ProgressTip = () => {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastProgressRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return; // Prevent multiple RAF calls

      rafRef.current = requestAnimationFrame(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const scrollTop = document.documentElement.scrollTop;

        const scrollPercentage =
          (scrollTop / (scrollHeight - clientHeight)) * 100;

        // Update state only if the change is significant (e.g., >0.5%)
        if (Math.abs(scrollPercentage - lastProgressRef.current) > 0.5) {
          setProgress(scrollPercentage);
          lastProgressRef.current = scrollPercentage;
        }

        rafRef.current = null;
      });
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
    <div className="sticky top-0 left-0 w-full h-1 z-50">
      <div
        className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-amber-300 via-orange-400 to-rose-500 transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default memo(ProgressTip);
