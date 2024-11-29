import { Redirect } from "react-router-dom";
import {
  accountRecoveryKeyApi,
  RecoveryFlowViewStep,
} from "@dashlane/account-recovery-contracts";
import { colors, Flex } from "@dashlane/design-system";
import { useModuleCommands, useModuleQuery } from "@dashlane/framework-react";
import { LoadingIcon } from "@dashlane/ui-components";
import { ACCOUNT_RECOVERY_KEY_RESULT_SEGMENT } from "../../app/routes/constants";
import { BasePanelContainer } from "../../left-panels/base-panel-container";
import { ConfirmAccountRecoveryKeyStep } from "./steps/confirm-account-recovery-key-step";
import { ChangeMasterPasswordStep } from "./steps/change-master-password-step";
import { FinalisingStep } from "./steps/finalising-step";
import { VerifyYourIdentityStep } from "./steps/verify-your-identity-step";
import { assertUnreachable } from "@dashlane/framework-types";
import { EnterPinCode } from "./steps/enter-pin-code";
import { ConfirmPinCode } from "./steps/confirm-pin-code";
export const AccountRecoveryKeyContainer = () => {
  const {
    cancelRecoveryFlow,
    submitRecoveryKey,
    confirmNewPassword,
    createPin,
    submitPin,
    clearWrongRecoveryKeyError,
  } = useModuleCommands(accountRecoveryKeyApi);
  const recoveryFlowStatus = useModuleQuery(
    accountRecoveryKeyApi,
    "recoveryFlowStatus"
  );
  const getCurrentStep = () => {
    const data = recoveryFlowStatus.data;
    if (!data) {
      return (
        <LoadingIcon
          size={78}
          color={colors.lightTheme.ds.text.brand.quiet}
          strokeWidth={1}
        />
      );
    }
    const step = data.step;
    switch (step) {
      case undefined:
      case RecoveryFlowViewStep.InitRecovery:
        return null;
      case RecoveryFlowViewStep.IdentityVerification:
        return <VerifyYourIdentityStep login={data.login} />;
      case RecoveryFlowViewStep.EnterRecoveryKey:
        return (
          <ConfirmAccountRecoveryKeyStep
            {...data}
            onSubmit={submitRecoveryKey}
            onCancel={cancelRecoveryFlow}
            onClearInputError={clearWrongRecoveryKeyError}
          />
        );
      case RecoveryFlowViewStep.ChangeMasterPassword:
        return (
          <ChangeMasterPasswordStep
            onSubmit={confirmNewPassword}
            onCancel={cancelRecoveryFlow}
          />
        );
      case RecoveryFlowViewStep.EnterPin:
        return (
          <EnterPinCode onCreatePin={createPin} onCancel={cancelRecoveryFlow} />
        );
      case RecoveryFlowViewStep.ConfirmPin:
        return (
          <ConfirmPinCode
            {...data}
            onSubmitPin={submitPin}
            onCancel={cancelRecoveryFlow}
          />
        );
      case RecoveryFlowViewStep.Finalising:
        return <FinalisingStep />;
      case RecoveryFlowViewStep.Success:
      case RecoveryFlowViewStep.Failure:
        return <Redirect to={ACCOUNT_RECOVERY_KEY_RESULT_SEGMENT} />;
      default:
        return assertUnreachable(step);
    }
  };
  return (
    <BasePanelContainer backgroundColor="ds.background.default">
      <Flex
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="center"
        sx={{
          margin: "0px auto 0px auto",
          height: "calc(100vh - 50px)",
          width: "550px",
        }}
      >
        {getCurrentStep()}
      </Flex>
    </BasePanelContainer>
  );
};
