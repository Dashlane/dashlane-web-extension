import React from "react";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { colors, ForwardIcon, Link } from "@dashlane/ui-components";
import { ActivePanel } from "../../security-settings";
const I18N_KEYS = {
  TWO_FACTOR_AUTHENTICATION_OPTIONS:
    "webapp_account_security_settings_two_factor_authentication_options",
};
type Props = {
  changeActivePanel: (panel: ActivePanel) => void;
};
const SX_STYLES = {
  BUTTON: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: colors.midGreen00,
  },
  CONTENT: { marginRight: "5px" },
};
export const TwoFactorAuthenticationOptions = ({
  changeActivePanel,
}: Props) => {
  const { translate } = useTranslate();
  const handleOnClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    changeActivePanel(ActivePanel.TwoFactorAuthentication);
  };
  return (
    <Link href="#" role="button" sx={SX_STYLES.BUTTON} onClick={handleOnClick}>
      <span sx={SX_STYLES.CONTENT}>
        {translate(I18N_KEYS.TWO_FACTOR_AUTHENTICATION_OPTIONS)}
      </span>
      <span aria-hidden="true">
        <ForwardIcon size={12} color={colors.midGreen00} />
      </span>
    </Link>
  );
};
