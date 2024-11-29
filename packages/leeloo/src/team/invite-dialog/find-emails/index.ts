const isBinary = function (value: string) {
  const controlBytes = value.match(/[\x00-\x09\x0e-\x1F]/g);
  if (!controlBytes) {
    return false;
  }
  const controlByteCount = controlBytes.length;
  return controlByteCount / value.length > 0.03;
};
const removeDuplicates = function (emails: string[]) {
  const map = {};
  emails.forEach((email) => (map[email] = true));
  return Object.keys(map);
};
export default function findEmails(value: string): string[] {
  if (isBinary(value)) {
    return [];
  }
  if (!value.includes("@")) {
    return [value];
  }
  const emails: string[] =
    value.match(/[^<> ,;:\t\n\r"']+@[a-zA-Z0-9_.-]+/g) || [];
  return removeDuplicates(emails);
}
