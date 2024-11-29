import { Paragraph } from "@dashlane/design-system";
import useTranslate from "../../i18n/useTranslate";
import { DASHLANE_DOWNLOAD_EXTENSION_URL } from "../../../webapp/urls";
import { logBannerInstallExtensionClick } from "./logs";
import { useSignUpCookie } from "../../../account-creation/hooks/use-signup-cookie";
import { AccountCreationFlowType } from "../../../account-creation/types";
const I18N_KEYS = {
  BANNER_MESSAGE: "webapp_install_extension_banner_message",
  BANNER_ACTION: "webapp_install_extension_banner_action",
};
export const InstallExtensionBanner = () => {
  const { translate } = useTranslate();
  const { setCookie } = useSignUpCookie();
  const handleBannerInstallExtensionClick = () => {
    setCookie(AccountCreationFlowType.ADMIN);
    logBannerInstallExtensionClick();
  };
  return (
    <div
      data-testid="install-extension-banner"
      sx={{
        backgroundColor: "ds.container.expressive.brand.catchy.idle",
        height: "34px",
        padding: "8px",
        textAlign: "center",
      }}
    >
      <Paragraph
        as={"span"}
        textStyle={"ds.body.reduced.regular"}
        color={"ds.text.inverse.catchy"}
      >
        {translate(I18N_KEYS.BANNER_MESSAGE)}
        <Paragraph
          as={"a"}
          textStyle={"ds.body.reduced.link"}
          sx={{ marginLeft: "8px" }}
          href={DASHLANE_DOWNLOAD_EXTENSION_URL}
          rel="noopener noreferrer"
          target="_blank"
          onClick={handleBannerInstallExtensionClick}
        >
          {translate(I18N_KEYS.BANNER_ACTION)}
        </Paragraph>
      </Paragraph>
    </div>
  );
};
