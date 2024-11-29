import * as React from "react";
import { Header } from "./Header";
import { colors, ThemeUIStyleObject } from "@dashlane/ui-components";
interface Props {
  children: React.ReactNode;
  displayHeaderLogo?: boolean;
  domain?: string;
  title: string;
  headerBackLink?: React.ReactNode;
  onClose?: () => void;
  withoutHeader?: boolean;
}
const boxShadow = {
  shadow1: "0px 4px 8px rgba(0, 0, 0, 0.16)",
};
const containerStyles: ThemeUIStyleObject = {
  backgroundColor: colors.white,
  margin: 0,
  overflow: "hidden",
  width: "380px",
  borderRadius: "8px",
  boxShadow: boxShadow.shadow1,
};
const mainStyles: ThemeUIStyleObject = {
  padding: "8px",
};
export const CardLayout = ({
  children,
  displayHeaderLogo,
  domain,
  headerBackLink,
  onClose,
  title,
  withoutHeader,
}: Props) => {
  return (
    <div sx={containerStyles}>
      {withoutHeader ? null : (
        <Header
          backLink={headerBackLink}
          displayLogo={displayHeaderLogo}
          domain={domain}
          title={title}
          onClose={onClose}
        />
      )}
      <main sx={mainStyles}>{children}</main>
    </div>
  );
};
