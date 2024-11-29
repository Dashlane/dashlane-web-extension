import classnames from "classnames";
import { accountRecoveryKeyApi } from "@dashlane/account-recovery-contracts";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import {
  Dialog,
  Heading,
  Icon,
  LinkButton,
  Paragraph,
} from "@dashlane/design-system";
import { useModuleCommands, useModuleQuery } from "@dashlane/framework-react";
import { FlowStep, UserUseAccountRecoveryKeyEvent } from "@dashlane/hermes";
import {
  ACCOUNT_RECOVERY_KEY_URL_SEGMENT,
  ADMIN_ASSISTED_RECOVERY_URL_SEGMENT,
  HELPCENTER_ACCOUNT_RECOVERY_URL,
} from "../../../../../../app/routes/constants";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
import { logEvent } from "../../../../../../libs/logs/logEvent";
import { redirect } from "../../../../../../libs/router";
import { allIgnoreClickOutsideClassName } from "../../../../../../webapp/variables";
const I18N_KEYS = {
  CHOOSE_ACCOUNT_RECOVERY_METHOD_TITLE:
    "webapp_login_form_choose_account_recovery_key_method_title",
  CHOOSE_ACCOUNT_RECOVERY_METHOD_DESCRIPTION:
    "webapp_login_form_choose_account_recovery_key_method_description",
  CHOOSE_ACCOUNT_RECOVERY_METHOD_LINK:
    "webapp_login_form_choose_account_recovery_key_method_link",
  BUTTON_USE_RECOVERY_KEY:
    "webapp_login_form_choose_account_recovery_key_method_use_ark_button",
  BUTTON_USE_ADMIN_ASSISTED_RECOVERY:
    "webapp_login_form_choose_account_recovery_key_method_use_admin_ar_button",
  BUTTON_CLOSE_DIALOG: "_common_dialog_dismiss_button",
};
interface Props {
  onClose: () => void;
}
export const ChooseAccountRecoveryMethodDialog = ({ onClose }: Props) => {
  const { translate } = useTranslate();
  const { startRecoveryFlow } = useModuleCommands(accountRecoveryKeyApi);
  const authenticationFlowStatus = useModuleQuery(
    AuthenticationFlowContracts.authenticationFlowApi,
    "authenticationFlowStatus"
  );
  const handleStartRecoveryFlow = () => {
    if (authenticationFlowStatus.data?.step !== "MasterPasswordStep") {
      throw new Error(
        "Cant perform AR outside of Master Password step of the Login flow"
      );
    }
    void startRecoveryFlow({
      login: authenticationFlowStatus.data?.loginEmail,
    });
    logEvent(new UserUseAccountRecoveryKeyEvent({ flowStep: FlowStep.Start }));
    redirect(ACCOUNT_RECOVERY_KEY_URL_SEGMENT);
  };
  return (
    <Dialog
      isOpen={true}
      dialogClassName={classnames(allIgnoreClickOutsideClassName)}
      disableScrolling
      closeActionLabel={translate(I18N_KEYS.BUTTON_CLOSE_DIALOG)}
      onClose={onClose}
      aria-label="account-recovery-method-dialog"
      actions={{
        primary: {
          children: translate(I18N_KEYS.BUTTON_USE_ADMIN_ASSISTED_RECOVERY),
          onClick: () => {
            redirect(ADMIN_ASSISTED_RECOVERY_URL_SEGMENT);
          },
        },
        secondary: {
          children: translate(I18N_KEYS.BUTTON_USE_RECOVERY_KEY),
          onClick: handleStartRecoveryFlow,
        },
      }}
    >
      <Icon
        sx={{ size: "77px", marginBottom: "16px" }}
        name="RecoveryKeyOutlined"
        color="ds.text.brand.quiet"
      />

      <Heading as="h2" sx={{ marginBottom: "16px" }}>
        {translate(I18N_KEYS.CHOOSE_ACCOUNT_RECOVERY_METHOD_TITLE)}
      </Heading>

      <Paragraph>
        {translate(I18N_KEYS.CHOOSE_ACCOUNT_RECOVERY_METHOD_DESCRIPTION)}
      </Paragraph>

      <LinkButton href={HELPCENTER_ACCOUNT_RECOVERY_URL} isExternal>
        {translate(I18N_KEYS.CHOOSE_ACCOUNT_RECOVERY_METHOD_LINK)}
      </LinkButton>
    </Dialog>
  );
};
