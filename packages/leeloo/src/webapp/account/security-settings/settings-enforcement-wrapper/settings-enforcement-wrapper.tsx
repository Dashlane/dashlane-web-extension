import { PropsWithChildren } from "react";
import { ArkEnforcementContainer } from "../account-recovery-root/account-recovery-key/containers/ark-enforcement-container";
import { PinEnforcementContainer } from "../pin-code-enforcement-root/containers/pin-enforcement-container";
import { useShouldEnforceArk } from "../account-recovery-root/hooks/use-should-enforce-ark";
import { useShouldEnforcePin } from "../pin-code-enforcement-root/hooks/use-should-enforce-pin";
import { useShouldChangeLoginEmail } from "../../../../account-management/change-login-email/hooks/use-should-change-login-email";
import { ChangeLoginEmailContainer } from "../../../../account-management/change-login-email/change-login-email-container";
export const SettingsEnforcementWrapper = ({
  children,
}: PropsWithChildren<unknown>) => {
  const shouldEnforceArk = useShouldEnforceArk().shouldEnforce;
  const shouldEnforcePin = useShouldEnforcePin().shouldEnforce;
  const shouldChangeLoginEmail = useShouldChangeLoginEmail();
  if (shouldChangeLoginEmail) {
    return <ChangeLoginEmailContainer />;
  } else if (APP_PACKAGED_IN_EXTENSION && shouldEnforcePin) {
    return <PinEnforcementContainer />;
  } else if (APP_PACKAGED_IN_EXTENSION && shouldEnforceArk) {
    return <ArkEnforcementContainer />;
  }
  return <>{children}</>;
};
