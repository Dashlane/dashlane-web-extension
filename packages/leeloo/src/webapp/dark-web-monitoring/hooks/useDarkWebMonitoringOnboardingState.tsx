import { CarbonEndpointResult } from "@dashlane/carbon-api-consumers";
import { useModuleCommands, useModuleQuery } from "@dashlane/framework-react";
import {
  DarkWebOnboardingState,
  emailMonitoringApi,
} from "@dashlane/password-security-contracts";
export interface UseDarkWebMonitoringOnboardingState {
  onboardingState: CarbonEndpointResult<DarkWebOnboardingState>;
  updateOnboardingState: () => Promise<unknown>;
}
export const useDarkWebMonitoringOnboardingState =
  (): UseDarkWebMonitoringOnboardingState => {
    const { dismissOnboardingNotification } =
      useModuleCommands(emailMonitoringApi);
    const onboardingState = useModuleQuery(
      emailMonitoringApi,
      "onboardingNotificationState"
    );
    return {
      updateOnboardingState: dismissOnboardingNotification,
      onboardingState,
    };
  };
