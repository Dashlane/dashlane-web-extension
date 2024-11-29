import AutofillIllustrationLight from "@dashlane/design-system/assets/illustrations/autofill-never-forget-password@2x-light.webp";
import AutofillIllustrationDark from "@dashlane/design-system/assets/illustrations/autofill-never-forget-password@2x-dark.webp";
import TwoFAIllustrationLight from "@dashlane/design-system/assets/illustrations/additional-protection-2FA@2x-light.webp";
import TwoFAIllustrationDark from "@dashlane/design-system/assets/illustrations/additional-protection-2FA@2x-dark.webp";
import {
  DashlaneBusinessMarketingContainer,
  IllustrationPanel,
  StandardMarketingContainer,
  TeamSignUpContainer,
} from "../left-panels";
import { AccountCreationFlowType, AccountCreationStep } from "./types";
interface AccountCreationLeftPanelProps {
  signUpFlowType: AccountCreationFlowType;
  currentStep: AccountCreationStep;
}
export const AccountCreationLeftPanel = ({
  signUpFlowType,
  currentStep,
}: AccountCreationLeftPanelProps) => {
  if (signUpFlowType === AccountCreationFlowType.EMPLOYEE) {
    return <TeamSignUpContainer />;
  }
  if (signUpFlowType === AccountCreationFlowType.ADMIN) {
    return <DashlaneBusinessMarketingContainer />;
  }
  if (signUpFlowType === AccountCreationFlowType.B2C) {
    switch (currentStep) {
      case AccountCreationStep.InstallExtensionB2C:
        return (
          <IllustrationPanel
            illustrationSrc={AutofillIllustrationLight}
            illustrationDarkSrc={AutofillIllustrationDark}
          />
        );
      case AccountCreationStep.ChooseAccountType:
      case AccountCreationStep.EnterPinCode:
      case AccountCreationStep.ConfirmPinCode:
        return (
          <IllustrationPanel
            illustrationSrc={TwoFAIllustrationLight}
            illustrationDarkSrc={TwoFAIllustrationDark}
          />
        );
    }
  }
  return <StandardMarketingContainer />;
};
