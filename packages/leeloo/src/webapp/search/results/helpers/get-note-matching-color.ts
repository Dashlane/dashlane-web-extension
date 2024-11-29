import { DecorativeContainerColor } from "@dashlane/design-system";
import { NoteColors } from "@dashlane/vault-contracts";
export const getNoteMatchingColor = (
  color?: NoteColors | string
): DecorativeContainerColor => {
  switch (color) {
    case NoteColors.BLUE:
      return "blue";
    case NoteColors.GRAY:
      return "grey";
    case NoteColors.GREEN:
      return "green";
    case NoteColors.ORANGE:
      return "orange";
    case NoteColors.PURPLE:
      return "purple";
    case NoteColors.RED:
    case NoteColors.PINK:
      return "red";
    case NoteColors.BROWN:
    case NoteColors.YELLOW:
      return "yellow";
    default:
      return "black";
  }
};
