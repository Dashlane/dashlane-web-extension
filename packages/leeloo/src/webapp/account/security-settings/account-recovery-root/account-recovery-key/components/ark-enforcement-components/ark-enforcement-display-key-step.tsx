import { ActivationFlowDisplayKeyView } from "@dashlane/account-recovery-contracts";
import {
  Button,
  DisplayField,
  LinkButton,
  Paragraph,
} from "@dashlane/design-system";
import { Result } from "@dashlane/framework-types";
import { AccountRecoveryKeyEnforcementHeading } from "./ark-enforcement-heading";
import {
  FORMATTED_RECOVERY_KEY_SEPARATOR,
  FOUR_CHARACTERS_REGEX,
} from "../../../../../constants";
import useTranslate from "../../../../../../../libs/i18n/useTranslate";
import { CopyToClipboardButton } from "../../../../../../credentials/edit/copy-to-clipboard-control";
import { DASHLANE_ARTICLE_ACCOUNT_RECOVERY_KEY } from "../../../../../../urls";
const I18N_KEYS = {
  ARK_ENFORCE_DISPLAY_KEY_STEP_TITLE:
    "webapp_enforce_account_recovery_key_first_step_title",
  ARK_ENFORCE_DISPLAY_KEY_STEP_DESCRIPTION:
    "webapp_enforce_account_recovery_key_first_step_description",
  ARK_ENFORCE_DISPLAY_KEY_STEP_HELPER_TEXT:
    "webapp_enforce_account_recovery_key_first_step_description_tip",
  ARK_ENFORCE_DISPLAY_KEY_STEP_FIELD_LABEL:
    "webapp_enforce_account_recovery_key_first_step_field_label",
  ARK_ENFORCE_DISPLAY_KEY_STEP_HELPCENTER_LINK:
    "webapp_enforce_account_recovery_key_first_step_learn_more",
  ARK_ENFORCE_DISPLAY_KEY_STEP_BUTTON: "account_creation_button_next",
};
interface Props extends Pick<ActivationFlowDisplayKeyView, "recoveryKey"> {
  goToNextStep: () => Promise<Result<undefined>>;
  isLoading: boolean;
}
export const ArkEnforcementDisplayKeyStep = ({
  recoveryKey,
  goToNextStep,
  isLoading,
}: Props) => {
  const { translate } = useTranslate();
  const formattedRecoveryKey = (
    (recoveryKey ?? "").match(FOUR_CHARACTERS_REGEX) ?? []
  ).join(FORMATTED_RECOVERY_KEY_SEPARATOR);
  return (
    <>
      <AccountRecoveryKeyEnforcementHeading
        title={translate(I18N_KEYS.ARK_ENFORCE_DISPLAY_KEY_STEP_TITLE)}
        iconName="RecoveryKeyOutlined"
      />

      <Paragraph>
        {translate(I18N_KEYS.ARK_ENFORCE_DISPLAY_KEY_STEP_DESCRIPTION)}
      </Paragraph>
      <Paragraph sx={{ marginTop: "16px" }}>
        {translate(I18N_KEYS.ARK_ENFORCE_DISPLAY_KEY_STEP_HELPER_TEXT)}
      </Paragraph>

      <div
        sx={{
          background: "ds.container.agnostic.neutral.quiet",
          borderRadius: "8px",
          margin: "32px 0",
          padding: "16px",
        }}
      >
        <DisplayField
          data-testid="ark-enforce-display-key"
          labelPersists={true}
          label={translate(I18N_KEYS.ARK_ENFORCE_DISPLAY_KEY_STEP_FIELD_LABEL)}
          actions={[
            <CopyToClipboardButton
              buttonId="copyPasswordButton"
              key="copy-password"
              data={formattedRecoveryKey}
            />,
          ]}
          value={formattedRecoveryKey}
        />
      </div>

      <Button fullsize onClick={goToNextStep} isLoading={isLoading}>
        {translate(I18N_KEYS.ARK_ENFORCE_DISPLAY_KEY_STEP_BUTTON)}
      </Button>
      <LinkButton
        isExternal
        size="small"
        href={DASHLANE_ARTICLE_ACCOUNT_RECOVERY_KEY}
        sx={{ marginTop: "32px" }}
      >
        {translate(I18N_KEYS.ARK_ENFORCE_DISPLAY_KEY_STEP_HELPCENTER_LINK)}
      </LinkButton>
    </>
  );
};
