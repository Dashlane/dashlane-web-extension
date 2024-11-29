const THRESHOLD = 30;
const THREE_DOTS = "\u2026";
export const getNoteDescription = (isSecured = false, content = "") => {
  if (isSecured) {
    return "*******";
  }
  if (content.length > THRESHOLD) {
    return content.slice(0, THRESHOLD - 3) + THREE_DOTS;
  }
  return content;
};
