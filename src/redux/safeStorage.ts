// src/store/safeStorage.ts
// A wrapper around localStorage that never throws.
// It returns a noop storage when localStorage is unavailable.

const getSafeLocalStorage = () => {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    const testKey = "__rtk_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch {
    return null;
  }
};

const ls = getSafeLocalStorage();

export const safeStorage = {
  getItem: (key: string): Promise<string | null> => {
    if (!ls) return Promise.resolve(null);
    try {
      return Promise.resolve(ls.getItem(key));
    } catch {
      return Promise.resolve(null);
    }
  },
  setItem: (key: string, value: string): Promise<void> => {
    if (!ls) return Promise.resolve();
    try {
      ls.setItem(key, value);
    } catch {
      // ignore quota / security errors
    }
    return Promise.resolve();
  },
  removeItem: (key: string): Promise<void> => {
    if (!ls) return Promise.resolve();
    try {
      ls.removeItem(key);
    } catch {
      // ignore
    }
    return Promise.resolve();
  },
};
