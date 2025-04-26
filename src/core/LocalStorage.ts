export function getLocalStorage<T>(key: string, def: string = ''): T {
  return JSON.parse(localStorage.getItem(key) ?? def);
}

export function setLocalStorage(key: string, data: unknown) {
  localStorage.setItem(key, JSON.stringify(data));
}
