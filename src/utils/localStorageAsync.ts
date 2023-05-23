import { resolve } from "path";

export function setLocalStorageAsync(key: string, value: string) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      reject();
    }, 2000);
    localStorage.setItem(key, value);
    resolve();
  });
}

export function getLocalStorageAsync(key: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject();
    }, 2000);
    resolve(localStorage.getItem(key));
  });
}
