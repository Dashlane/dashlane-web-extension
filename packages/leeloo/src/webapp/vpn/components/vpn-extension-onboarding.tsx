import {
  Button,
  Flex,
  Heading,
  Paragraph,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import { openUrl } from "../../../libs/external-urls";
import zIndexVars from "../../../libs/dashlane-style/globals/z-index-variables.css";
import { DASHLANE_DOWNLOAD_EXTENSION_URL } from "../../urls";
import downloadExtensionImage from "../assets/download_extension.png";
const I18N_KEYS = {
  TITLE: "webapp_vpn_download_extension_title",
  TEXT: "webapp_vpn_download_extension_text",
  DOWNLOAD_BUTTON: "webapp_vpn_download_extension_button",
};
const containerStyles: ThemeUIStyleObject = {
  width: "100%",
  height: "100%",
  backgroundColor: "ds.background.default",
  position: "absolute",
  top: "0px",
  zIndex: zIndexVars["--z-index-webapp-feature-onboarding-overlay"],
  overflow: "auto",
};
export const VpnExtensionOnboarding = () => {
  const { translate } = useTranslate();
  return (
    <Flex flexDirection="column" alignItems="center" sx={containerStyles}>
      <img
        sx={{ mt: "64px", maxWidth: "480px" }}
        src={downloadExtensionImage}
        alt={translate(I18N_KEYS.TITLE)}
      />
      <Heading sx={{ marginTop: "40px", maxWidth: "480px" }} as="h1">
        {translate(I18N_KEYS.TITLE)}
      </Heading>
      <Paragraph
        sx={{ marginTop: "18px", maxWidth: "480px" }}
        textStyle="ds.body.standard.regular"
      >
        {translate(I18N_KEYS.TEXT)}
      </Paragraph>
      <Button
        sx={{ mt: "40px" }}
        type="button"
        onClick={() => openUrl(DASHLANE_DOWNLOAD_EXTENSION_URL)}
      >
        {translate(I18N_KEYS.DOWNLOAD_BUTTON)}
      </Button>
    </Flex>
  );
};
