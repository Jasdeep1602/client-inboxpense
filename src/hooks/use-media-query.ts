'use client';
import { useState, useEffect } from 'react';

/**
 * A custom hook to track the state of a CSS media query.
 * @param query The media query string to watch (e.g., '(min-width: 768px)').
 * @returns `true` if the query matches, `false` otherwise.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Ensure this code runs only on the client
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => {
      setMatches(media.matches);
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}
