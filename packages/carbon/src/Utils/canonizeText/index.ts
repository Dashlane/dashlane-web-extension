export function canonizeText(inputString: string | undefined | null): string {
  if (!inputString) {
    return "";
  }
  let result = inputString.trim();
  if (result.normalize) {
    result = result.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  result = result
    .toLowerCase()
    .replace(/[\+_\\\/\?\.\-_{}\[\]\(\)\*&!@#\$~`%\^=\|:,;"'<>]/g, " ");
  return result.replace(/\s+/g, " ");
}
