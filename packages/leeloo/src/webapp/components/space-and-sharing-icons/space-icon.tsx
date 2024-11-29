import * as React from "react";
import globalFontVars from "../../../libs/dashlane-style/globals/font-variables.css";
import allSpacesIcon from "./all-spaces-icon.svg";
import styles from "./styles.css";
export interface SpaceEntry {
  id: string | null;
  name: string;
  color?: string;
  letter?: string;
}
interface Props {
  color?: string;
  letter?: string;
}
const DEFAULT_COLOR = "#EB5CCB";
export const CustomSpaceIcon = ({ color = DEFAULT_COLOR, letter }: Props) => (
  <svg
    xmlns="__REDACTED__"
    xmlnsXlink="__REDACTED__"
    width="20"
    height="20"
    viewBox="0 0 18 18"
    className={styles.spacedIcon}
  >
    <defs>
      <path id="a" d="M10.667 16H0V5.333L5.333 0H16v10.667z" />
    </defs>
    <g fill="none" fillRule="evenodd">
      <g fillRule="nonzero">
        <use fill={color} fillRule="evenodd" xlinkHref="#a" />
        <path
          stroke="#FFF"
          strokeOpacity=".5"
          d="M10.46 15.5l5.04-5.04V.5H5.54L.5 5.54v9.96h9.96z"
        />
      </g>
      <text
        fill="#FFF"
        fontFamily={globalFontVars["--dashlane-fontfamily-primary"]}
        fontSize="10"
        fontWeight="600"
      >
        <tspan x="7.5" y="12" textAnchor="middle">
          {letter}
        </tspan>
      </text>
    </g>
  </svg>
);
export const SpaceIcon = ({ space }: { space: SpaceEntry }) =>
  space.id === null ? (
    <img src={allSpacesIcon} alt={space.name} />
  ) : (
    <CustomSpaceIcon color={space.color} letter={space.letter} />
  );
