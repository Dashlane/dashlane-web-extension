import { useModuleCommands, useModuleQuery } from "@dashlane/framework-react";
import {
  accountRecoveryKeyApi,
  ActivationFlowViewStep,
} from "@dashlane/account-recovery-contracts";
import { useColorMode } from "@dashlane/design-system";
import PassKeysSecureIllustrationDark from "@dashlane/design-system/assets/illustrations/passkeys-faster-easier-more-secure@2x-dark.webp";
import PassKeysSecureIllustrationLight from "@dashlane/design-system/assets/illustrations/passkeys-faster-easier-more-secure@2x-light.webp";
import { ArkEnforcementLayout } from "../components/ark-enforcement-components/account-recovery-key-enforcement-layout/account-recovery-key-enforcement-layout";
import { ArkEnforcementDisplayKeyStep } from "../components/ark-enforcement-components/ark-enforcement-display-key-step";
import { AccountRecoveryKeyActivationContainer } from "./account-recovery-key-activation-container";
import { ArkEnforcementConfirmKeyStep } from "../components/ark-enforcement-components/ark-enforcement-confirm-key-step";
import { ArkEnforcementErrorStep } from "../components/ark-enforcement-components/ark-enforcement-error-step";
export const ArkEnforcementContainer = () => {
  const [colorMode] = useColorMode();
  const illustrationSource =
    colorMode === "dark"
      ? PassKeysSecureIllustrationDark
      : PassKeysSecureIllustrationLight;
  const { goToActivationNextStep, requestActivation, goToActivationPrevStep } =
    useModuleCommands(accountRecoveryKeyApi);
  const arkActivationStatus = useModuleQuery(
    accountRecoveryKeyApi,
    "activationFlowStatus"
  );
  const getCurrentStep = () => {
    switch (arkActivationStatus.data?.step) {
      case ActivationFlowViewStep.InitActivation:
        if (!arkActivationStatus.data.isFeatureEnabled) {
          void requestActivation();
        }
        return (
          <ArkEnforcementDisplayKeyStep
            {...arkActivationStatus.data}
            goToNextStep={() => goToActivationNextStep()}
            isLoading={true}
          />
        );
      case ActivationFlowViewStep.RequestActivation:
      case ActivationFlowViewStep.DisplayKey:
        return (
          <ArkEnforcementDisplayKeyStep
            {...arkActivationStatus.data}
            goToNextStep={() => goToActivationNextStep()}
            isLoading={
              arkActivationStatus.data?.step ===
              ActivationFlowViewStep.RequestActivation
            }
          />
        );
      case ActivationFlowViewStep.ConfirmKey:
      case ActivationFlowViewStep.FinaliseActivation:
        return (
          <ArkEnforcementConfirmKeyStep
            {...arkActivationStatus.data}
            goToPrevStep={() => goToActivationPrevStep()}
            goToNextStep={() => goToActivationNextStep()}
            isLoading={
              arkActivationStatus.data?.step ===
              ActivationFlowViewStep.FinaliseActivation
            }
          />
        );
      case ActivationFlowViewStep.ShowError:
        return (
          <ArkEnforcementErrorStep
            {...arkActivationStatus.data}
            goToPrevStep={() => goToActivationPrevStep()}
          />
        );
      case ActivationFlowViewStep.ActivationDone:
      case ActivationFlowViewStep.GenerateNewKey:
      case ActivationFlowViewStep.CancelGenerateNewKey:
      default:
        return <AccountRecoveryKeyActivationContainer onClose={() => {}} />;
    }
  };
  return (
    <ArkEnforcementLayout illustrationSource={illustrationSource}>
      {getCurrentStep()}
    </ArkEnforcementLayout>
  );
};
