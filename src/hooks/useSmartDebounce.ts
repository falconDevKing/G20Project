import { useRef, useCallback } from "react";

type AsyncOrSyncFn<T extends any[]> = (...args: T) => Promise<void> | void;

type SmartDebounceOptions = {
  leading?: boolean;
  trailing?: boolean;
};

export const useSmartDebounce = <T extends any[]>(
  fn: AsyncOrSyncFn<T>,
  delay: number,
  options: SmartDebounceOptions = { leading: true, trailing: true },
): ((...args: T) => void) => {
  const { leading = true, trailing = true } = options;

  const isCooldown = useRef(false);
  const isRunning = useRef(false);
  const hasPendingCall = useRef(false);
  const lastArgs = useRef<T | undefined>(undefined);

  const run = useCallback(
    async (args: T) => {
      isRunning.current = true;

      try {
        await fn(...args);
      } finally {
        isRunning.current = false;

        if (trailing && hasPendingCall.current && lastArgs.current) {
          hasPendingCall.current = false;
          run(lastArgs.current);
        } else {
          isCooldown.current = false;
        }
      }
    },
    [fn, trailing],
  );

  const debouncedFn = useCallback(
    (...args: T) => {
      if (!isCooldown.current) {
        if (leading) {
          isCooldown.current = true;
          lastArgs.current = args;
          run(args);

          setTimeout(() => {
            if (trailing && hasPendingCall.current && !isRunning.current && lastArgs.current) {
              run(lastArgs.current);
            }
          }, delay);
        } else if (trailing) {
          // Don't run immediately, but schedule trailing call
          hasPendingCall.current = true;
          lastArgs.current = args;

          isCooldown.current = true;
          setTimeout(() => {
            if (!isRunning.current && lastArgs.current) {
              run(lastArgs.current);
            }
          }, delay);
        }
      } else if (trailing) {
        hasPendingCall.current = true;
        lastArgs.current = args;
      }
    },
    [delay, leading, trailing, run],
  );

  return debouncedFn;
};
