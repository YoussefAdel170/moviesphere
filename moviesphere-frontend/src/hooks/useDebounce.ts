import { useEffect, useState, useRef } from "react";

export function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    cancel();

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return cancel;
  }, [value, delay]);

  return { debouncedValue, cancel };
}
