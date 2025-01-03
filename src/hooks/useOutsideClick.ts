import { useEffect, useRef } from 'react';

export function useOutsideClick(handler: () => void, capturePhase = true) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) handler();
    };
    document.addEventListener('click', handleClick, capturePhase);
    return () => document.removeEventListener('click', handleClick);
  }, [handler, capturePhase]);

  return ref;
}
