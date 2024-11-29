import * as React from "react";
import { I18nContext } from "../../../context/i18n";
import { WebcardSpacesData } from "@dashlane/autofill-engine/types";
interface Props {
  letter: string;
  color: string;
  name: string;
}
const DEFAULT_SPACE_COLOR = "#D000AF";
export const useSpaceInfosPatcher = (): ((
  space: WebcardSpacesData
) => WebcardSpacesData) => {
  const defaultSpaceName =
    React.useContext(I18nContext).translate("defaultSpace");
  return (space) =>
    !space.color && !space.letter
      ? {
          displayName: defaultSpaceName,
          letter: defaultSpaceName[0],
          color: DEFAULT_SPACE_COLOR,
          spaceId: space.spaceId,
        }
      : space;
};
export const Space = ({ letter, color, name }: Props) => (
  <svg
    aria-label={name}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="__REDACTED__"
  >
    <path
      d="M0.800014 5.10801V15.148H10.836L15.136 10.876V0.800018H5.06001L0.800014 5.10801Z"
      fill={color}
    />
    <path
      d="M10.5268 14.398H1.55001V5.41622L5.37314 1.55002H14.386V10.5639L10.5268 14.398Z"
      stroke="black"
      strokeOpacity="0.24"
      strokeWidth="1.5"
    />
    <text
      fill="#FFF"
      fontFamily="GT Walsheim Pro"
      fontSize="9"
      fontWeight="600"
    >
      <tspan x="48%" y="50%" textAnchor="middle" dominantBaseline="central">
        {letter}
      </tspan>
    </text>
  </svg>
);
