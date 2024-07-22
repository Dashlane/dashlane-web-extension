import * as React from "react";
import { jsx, mergeSx, ThemeUIStyleObject } from "@dashlane/design-system";
const LINK_BUTTON_SX_STYLE: Partial<ThemeUIStyleObject> = {
  background: "none",
  cursor: "pointer",
  fontSize: "12px",
  lineHeight: "1.43",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
};
interface Props {
  sxStyle?: Partial<ThemeUIStyleObject>;
  children: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  colorToken?: string;
  withUnderline?: boolean;
}
export const LinkButton = ({
  children,
  colorToken,
  sxStyle,
  onClick: propsOnClick,
  withUnderline = false,
}: Props) => {
  const onClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    propsOnClick(event);
  };
  return (
    <a
      onClick={onClick}
      type="button"
      sx={mergeSx([
        LINK_BUTTON_SX_STYLE,
        sxStyle ?? {},
        colorToken ? { color: colorToken } : {},
        withUnderline ? { textDecoration: "underline !important" } : {},
      ])}
      href="#"
      data-testid={"link-button"}
    >
      {children}
    </a>
  );
};
