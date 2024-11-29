import * as React from "react";
import {
  CloseIcon,
  colors,
  DashlaneLogoIcon,
  Heading,
  ThemeUIStyleObject,
} from "@dashlane/ui-components";
import useTranslate from "../../../libs/i18n/useTranslate";
interface Props {
  backLink?: React.ReactNode;
  displayLogo?: boolean;
  domain?: string;
  title: string;
  onClose?: () => void;
}
const headerStyles: ThemeUIStyleObject = {
  display: "flex",
  alignItems: "center",
  backgroundColor: colors.dashGreen06,
  padding: "16px 18px",
  gap: "16px",
};
const titleContainerStyles: ThemeUIStyleObject = {
  paddingRight: "16px",
  flex: "1",
  overflowX: "hidden",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
};
const domainStyles: ThemeUIStyleObject = {
  fontSize: "10px",
  textTransform: "uppercase",
  color: "#0e353d",
  letterSpacing: "0.2px",
  lineHeight: "100%",
  fontWeight: "500",
};
const actionStyles: ThemeUIStyleObject = {
  width: "36px",
  height: "36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  backgroundColor: colors.dashGreen06,
  ":hover": {
    backgroundColor: colors.midGreen04,
    svg: {
      fill: colors.dashGreen00,
    },
  },
};
export const Header = ({
  backLink,
  displayLogo,
  domain,
  title,
  onClose,
}: Props) => {
  const { translate } = useTranslate();
  return (
    <header sx={headerStyles}>
      {displayLogo ? <DashlaneLogoIcon aria-hidden size={27} /> : null}
      {backLink}
      <div sx={titleContainerStyles}>
        {domain ? <div sx={domainStyles}>{domain}</div> : null}
        <Heading
          sx={{
            fontWeight: "500",
            fontSize: "16px",
            color: colors.dashGreen00,
          }}
        >
          {title}
        </Heading>
      </div>
      {onClose ? (
        <button
          type="button"
          sx={actionStyles}
          onClick={onClose}
          aria-label={translate("closeWindow")}
        >
          <CloseIcon aria-hidden color={colors.dashGreen02} size={20} />
        </button>
      ) : null}
    </header>
  );
};
