export const getTokenURL = (token: string): string | null => {
  try {
    return token ? decodeURIComponent(atob(token)) : null;
  } catch (e) {
    return null;
  }
};
