'use client';

import { useState, useEffect } from 'react';
import Section from '@/components/Section';

const Hero = () => {
  const TYPING_SPEED = 120;
  const DELETING_SPEED = 80;
  const PAUSE_DURATION = 2000;

  const quotes = [
    {
      text: '没有什么是完美的，这个世界并不完美，所以才显得美丽',
      source: '钢之炼金术师',
    },
    {
      text: '相信奇迹的人，本身就和奇迹一样了不起！',
      source: '星游记',
    },
  ];

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentQuote = quotes[quoteIndex].text;

    const handleTyping = () => {
      if (isDeleting) {
        if (displayText.length > 0) {
          setDisplayText((prev) => prev.slice(0, -1));
        } else {
          setIsDeleting(false);
          setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        }
      } else {
        if (displayText.length < currentQuote.length) {
          setDisplayText((prev) => prev + currentQuote.charAt(prev.length));
        } else {
          setTimeout(() => setIsDeleting(true), PAUSE_DURATION);
        }
      }
    };

    const timeout = setTimeout(
      handleTyping,
      isDeleting ? DELETING_SPEED : TYPING_SPEED
    );

    return () => clearTimeout(timeout);
  }, [
    displayText,
    isDeleting,
    quoteIndex,
    quotes,
    DELETING_SPEED,
    TYPING_SPEED,
    PAUSE_DURATION,
  ]);

  return (
    <Section className="bg-black">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-white">
        欢迎来到我的博客
      </h1>

      <div className="mt-8 p-4 min-h-[120px] text-center flex flex-col justify-center items-center">
        <p className="text-2xl font-serif text-white leading-relaxed">
          {displayText}
          <span className="font-bold ml-1">|</span>
        </p>
        <cite className="mt-4 block text-base text-gray-500 not-italic">
          — {quotes[quoteIndex].source}
        </cite>
      </div>
    </Section>
  );
};

export default Hero;
