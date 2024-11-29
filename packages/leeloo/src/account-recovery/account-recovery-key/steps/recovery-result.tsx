import {
  accountRecoveryKeyApi,
  RecoveryFlowViewStep,
} from "@dashlane/account-recovery-contracts";
import { useModuleQuery } from "@dashlane/framework-react";
import { RecoveryErrorStep } from "./recovery-error-step";
import { RecoverySuccessStep } from "./recovery-success-step";
import { Flex } from "@dashlane/design-system";
import { BasePanelContainer } from "../../../left-panels/base-panel-container";
export const AccountRecoveryKeyResult = () => {
  const recoveryFlowStatus = useModuleQuery(
    accountRecoveryKeyApi,
    "recoveryFlowStatus"
  );
  const getResultComponent = () => {
    switch (recoveryFlowStatus.data?.step) {
      case RecoveryFlowViewStep.Success:
        return <RecoverySuccessStep />;
      case RecoveryFlowViewStep.Failure:
        return <RecoveryErrorStep {...recoveryFlowStatus.data} />;
      default:
        return null;
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
        {getResultComponent()}
      </Flex>
    </BasePanelContainer>
  );
};
