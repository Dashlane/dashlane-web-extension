export function handleSpecialCharacter(content?: string): string {
  if (content === undefined) {
    return "";
  }
  if (content.match(/[,"\n\r]/g)) {
    const escaped = content
      .split("")
      .map((char) => (char === `"` ? `""` : char));
    return [`"`, ...escaped, `"`].join("");
  }
  return content;
}
