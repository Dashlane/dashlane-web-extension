export const formatMarkdownSource = (value: string) => {
  return value.replace(/\n/gi, "&nbsp; \n");
};
