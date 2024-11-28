import { NoteType } from "@dashlane/communication";
const secureNoteBackgroundColors: Record<string, string> = {
  blue: "#5b9ed9",
  purple: "#b96fd1",
  pink: "#ffafdc",
  red: "#e2614d",
  brown: "#a98259",
  green: "#9cae26",
  orange: "#fa9243",
  yellow: "#ffc466",
  gray: "#717171",
};
const HEX_COLOR_REGEXP = /^#([0-9A-F]{3}){1,2}$/i;
export const getBackgroundColorForNoteType = (noteType: NoteType) => {
  let backgroundColor =
    secureNoteBackgroundColors[noteType.toLocaleLowerCase()];
  if (!HEX_COLOR_REGEXP.test(backgroundColor)) {
    backgroundColor = secureNoteBackgroundColors.gray;
  }
  return backgroundColor;
};
