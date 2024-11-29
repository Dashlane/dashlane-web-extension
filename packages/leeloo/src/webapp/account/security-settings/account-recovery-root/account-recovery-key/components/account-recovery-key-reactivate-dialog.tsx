import { Dialog, Flex, Paragraph, useColorMode } from "@dashlane/design-system";
import EnableArkAgainIllustrationDark from "@dashlane/design-system/assets/illustrations/additional-protection-2FA@2x-dark.webp";
import EnableArkAgainIllustrationLight from "@dashlane/design-system/assets/illustrations/additional-protection-2FA@2x-light.webp";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
import { allIgnoreClickOutsideClassName } from "../../../../../../webapp/variables";
interface Props {
  onClose: () => void;
  onGoToSecuritySettings: () => void;
}
const I18N_KEYS = {
  BUTTON_CLOSE_DIALOG: "_common_dialog_dismiss_button",
  TITLE: "webapp_account_recovery_key_reactivation_pin_title",
  DESCRIPTION: "webapp_account_recovery_key_reactivation_pin_description",
  CANCEL_BUTTON: "_common_action_cancel",
  GO_TO_SETTINGS_BUTTON: "webapp_account_recovery_key_reactivation_pin_cta",
};
export const AccountRecoveryKeyReactivateDialog = ({
  onClose,
  onGoToSecuritySettings,
}: Props) => {
  const { translate } = useTranslate();
  const [colorMode] = useColorMode();
  const illustrationSource =
    colorMode === "dark"
      ? EnableArkAgainIllustrationDark
      : EnableArkAgainIllustrationLight;
  return (
    <Dialog
      dialogClassName={allIgnoreClickOutsideClassName}
      isOpen
      isMandatory
      disableScrolling
      closeActionLabel={translate(I18N_KEYS.BUTTON_CLOSE_DIALOG)}
      onClose={onClose}
      actions={{
        primary: {
          children: translate(I18N_KEYS.GO_TO_SETTINGS_BUTTON),
          autoFocus: true,
          onClick: () => {
            onGoToSecuritySettings();
            onClose();
          },
        },
        secondary: {
          children: translate(I18N_KEYS.CANCEL_BUTTON),
          onClick: onClose,
        },
      }}
    >
      <Flex>
        <Flex
          flexDirection="column"
          alignContent={"center"}
          sx={{
            width: "100%",
            bg: "ds.background.alternate",
            marginBottom: "32px",
          }}
        >
          <img
            src={illustrationSource}
            alt=""
            width={360}
            height={240}
            sx={{ padding: "24px" }}
          />
        </Flex>
        <Paragraph
          textStyle="ds.title.section.medium"
          sx={{ marginBottom: "8px" }}
          as="h2"
        >
          {translate(I18N_KEYS.TITLE)}
        </Paragraph>
        <Paragraph>{translate(I18N_KEYS.DESCRIPTION)}</Paragraph>
      </Flex>
    </Dialog>
  );
};
