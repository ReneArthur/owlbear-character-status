import { useEffect, useRef } from "react";

type TimeoutValue = ReturnType<typeof setTimeout>;

export function useDebounce<T extends []>(
  handleFunction: (...args: T) => void,
  delay: number
) {
  const timeout = useRef<TimeoutValue>();

  function debounce(...args: T) {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => handleFunction(...args), delay);
  }

  useEffect(
    () => () => {
      if (!timeout.current) return;
      clearTimeout(timeout.current);
    },
    []
  );

  return debounce;
}
