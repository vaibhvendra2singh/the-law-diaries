'use client';

// components/ReadingProgressBar.tsx
// Thin reading scroll progress indicator fixed at top of article page

import { useState, useEffect } from 'react';

export default function ReadingProgressBar() {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    function updateScrollProgress() {
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setCompletion(Math.min(100, Math.max(0, (currentScroll / scrollHeight) * 100)));
      }
    }

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress(); // Initial check

    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-[3px] bg-black z-[100] transition-all duration-75 ease-out"
      style={{ width: `${completion}%` }}
      aria-hidden="true"
    />
  );
}
