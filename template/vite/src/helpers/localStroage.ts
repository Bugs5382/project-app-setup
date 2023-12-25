// @ts-nocheck
export const getLocalStorage = (key: string): string | null => {
  return localStorage.getItem(key);
};

export const setLocalStorage = (
  key: string,
  value: string,
): boolean | Error => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    return new Error("Setting Local Storage Failed");
  }
};
