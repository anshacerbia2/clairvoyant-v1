import { MutableRefObject, useEffect, useState } from "react";

export const useElementSize = (
  elementRef: MutableRefObject<HTMLElement | null>
): number[] => {
  //   const [size, setSize] = useState<number[]>([window.innerWidth, window.innerHeight]);

  //   useEffect((): (() => void) => {
  //     const updateSize = (): void => setSize([window.innerWidth, window.innerHeight]);
  //     window.addEventListener("resize", updateSize);
  //     return (): void => window.removeEventListener("resize", updateSize);
  //   }, []);

  //   return size;
  const width = elementRef.current ? elementRef.current.clientWidth : 0;
  const height = elementRef.current ? elementRef.current.clientHeight : 0;
  const [size, setSize] = useState<number[]>([0, 0]);

  useEffect(() => {
    setSize([width, height]);
  }, [width, height]);

  return size;
};

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    setCounter((prevState) => prevState + 1);
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return counter === 1 ? value : debouncedValue;
};
