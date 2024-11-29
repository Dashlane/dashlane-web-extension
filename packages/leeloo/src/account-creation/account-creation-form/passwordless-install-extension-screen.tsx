import {
  Button,
  ExpressiveIcon,
  Flex,
  Heading,
  IconProps,
  LinkButton,
  Paragraph,
} from "@dashlane/design-system";
import { openUrl } from "../../libs/external-urls";
import useTranslate from "../../libs/i18n/useTranslate";
import {
  DASHLANE_DOWNLOAD_EXTENSION_URL,
  DASHLANE_LEARN_HOW_THE_EXTENSION_ENHANCES_YOUR_SECURITY,
} from "../../webapp/urls";
const I18N_KEYS = {
  NO_EXTENSION_HEADER:
    "webapp_auth_panel_account_creation_passwordless_install_extension_header",
  NO_EXTENSION_DESCRIPTION:
    "webapp_auth_panel_account_creation_passwordless_install_extension_description",
  ACCESS_VAULT_TEXT:
    "webapp_auth_panel_account_creation_passwordless_install_extension_access_vault_text",
  AUTOFILL_TEXT:
    "webapp_auth_panel_account_creation_passwordless_install_extension_autofill_text",
  SAVE_LOGINS_TEXT:
    "webapp_auth_panel_account_creation_passwordless_install_extension_logins_text",
  INSTALL_BUTTON:
    "webapp_auth_panel_account_creation_passwordless_install_extension_install_button",
  LEARN_MORE_LINK:
    "webapp_auth_panel_account_creation_passwordless_install_extension_learn_more_link",
};
const PLESS_INSTRUCTION_CONTAINER_SX = {
  display: "grid",
  gridTemplateColumns: "40px 1fr auto",
  gap: "16px",
  alignItems: "center",
};
const PasswordlessInstallExtensionInstruction = ({
  iconName,
  instructionText,
}: {
  iconName: IconProps["name"];
  instructionText: string;
}) => (
  <div sx={PLESS_INSTRUCTION_CONTAINER_SX}>
    <ExpressiveIcon size="medium" name={iconName} mood="brand" />
    <Paragraph color="ds.text.neutral.catchy" textStyle="ds.title.block.medium">
      {instructionText}
    </Paragraph>
  </div>
);
export const PasswordlessInstallExtensionScreen = () => {
  const { translate } = useTranslate();
  const handleInstallExtensionClick = () => {
    openUrl(DASHLANE_DOWNLOAD_EXTENSION_URL);
  };
  return (
    <Flex
      flexDirection="column"
      sx={{ margin: "0px 80px", width: "420px" }}
      gap={6}
    >
      <Flex gap="12px">
        <Heading
          as="h1"
          textStyle="ds.title.section.medium"
          color="ds.text.neutral.catchy"
        >
          {translate(I18N_KEYS.NO_EXTENSION_HEADER)}
        </Heading>
        <Paragraph
          textStyle="ds.title.section.large"
          color="ds.text.neutral.catchy"
        >
          {translate(I18N_KEYS.NO_EXTENSION_DESCRIPTION)}
        </Paragraph>
      </Flex>
      <Flex flexDirection="column" gap="20px">
        <PasswordlessInstallExtensionInstruction
          iconName="ProtectionOutlined"
          instructionText={translate(I18N_KEYS.ACCESS_VAULT_TEXT)}
        />
        <PasswordlessInstallExtensionInstruction
          iconName="FeatureAutofillOutlined"
          instructionText={translate(I18N_KEYS.AUTOFILL_TEXT)}
        />
        <PasswordlessInstallExtensionInstruction
          iconName="GoogleChromeOutlined"
          instructionText={translate(I18N_KEYS.SAVE_LOGINS_TEXT)}
        />
      </Flex>
      <Button
        onClick={handleInstallExtensionClick}
        mood="brand"
        icon="ActionOpenExternalLinkOutlined"
        layout="iconTrailing"
        fullsize={true}
        sx={{ marginTop: "8px" }}
      >
        {translate(I18N_KEYS.INSTALL_BUTTON)}
      </Button>

      <LinkButton
        href={DASHLANE_LEARN_HOW_THE_EXTENSION_ENHANCES_YOUR_SECURITY}
        isExternal
      >
        {translate(I18N_KEYS.LEARN_MORE_LINK)}
      </LinkButton>
    </Flex>
  );
};
