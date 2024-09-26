export function getWindowLocalStorage(): Storage | null {
  return self.localStorage || null;
}
