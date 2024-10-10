let publicPath: string | undefined = undefined;
export const setPublicPath = (path: string | undefined) => {
  if (typeof path !== "string") {
    throw new Error(
      "[Assets] - setPublicPath: provided public path is not a string."
    );
  }
  publicPath = path;
};
export const getPublicPath = (): string => {
  if (!publicPath) {
    throw new Error(
      "[Assets] - getPublicPath: trying to access public path before it was set."
    );
  }
  return publicPath;
};
