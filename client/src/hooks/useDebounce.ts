import { useState, useEffect } from "react";

export const useDebounce = (value: string, delay: number) => {
  let timeout: any = null;
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      setDebouncedValue(value);
    });
  }, [value, delay]);

  return debouncedValue;
};
