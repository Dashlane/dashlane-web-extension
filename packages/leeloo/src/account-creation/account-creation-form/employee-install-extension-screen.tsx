import { Button, Flex, Heading, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../libs/i18n/useTranslate";
import { openUrl } from "../../libs/external-urls";
import { DASHLANE_DOWNLOAD_EXTENSION_URL } from "../../webapp/urls";
const I18N_KEYS = {
  NO_EXTENSION_HEADER: "webapp_auth_panel_account_creation_no_extension_header",
  NO_EXTENSION_DESCRIPTION:
    "webapp_auth_panel_account_creation_no_extension_description",
  DOWNLOAD_EXTENSION_BUTTON:
    "webapp_auth_panel_account_creation_no_extension_download_button",
};
export const EmployeeInstallExtensionScreen = () => {
  const { translate } = useTranslate();
  const handleInstallExtensionClick = () => {
    openUrl(DASHLANE_DOWNLOAD_EXTENSION_URL);
  };
  return (
    <Flex flexDirection="column" sx={{ margin: "80px" }} gap={4}>
      <Heading
        as={"h2"}
        textStyle="ds.title.section.large"
        color="ds.text.neutral.catchy"
      >
        {translate(I18N_KEYS.NO_EXTENSION_HEADER)}
      </Heading>
      <Paragraph
        color="ds.text.neutral.quiet"
        textStyle="ds.body.standard.regular"
      >
        {translate(I18N_KEYS.NO_EXTENSION_DESCRIPTION)}
      </Paragraph>
      <div sx={{ alignSelf: "end" }}>
        <Button
          onClick={handleInstallExtensionClick}
          size="large"
          mood="brand"
          intensity="catchy"
          type="button"
        >
          {translate(I18N_KEYS.DOWNLOAD_EXTENSION_BUTTON)}
        </Button>
      </div>
    </Flex>
  );
};
