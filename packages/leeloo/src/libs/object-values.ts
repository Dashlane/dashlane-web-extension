export default (object: Record<string, any>) =>
  Object.keys(object).map((key) => object[key]);
