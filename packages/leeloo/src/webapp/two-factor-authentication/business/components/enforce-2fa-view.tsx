import { useEffect } from "react";
import { DataStatus } from "@dashlane/framework-react";
import { useHistory } from "../../../../libs/router";
import { useRouterGlobalSettingsContext } from "../../../../libs/router/RouterGlobalSettingsProvider";
import { DialogContextProvider } from "../../../dialog";
import { ProtectedItemsUnlockerProvider } from "../../../unlock-items";
import { SkeletonVault } from "../../../skeleton-components/skeleton-vault";
import { TwoFactorAuthenticationForBusinessContainer } from "../containers/two-factor-authentication-for-business-container";
import { useShouldEnforceTwoFactorAuthentication } from "../hooks/use-should-enforce-two-factor-authentication";
export const TwoFactorAuthenticationEnforceView = () => {
  const history = useHistory();
  const { routes } = useRouterGlobalSettingsContext();
  const shouldEnforce2FA = useShouldEnforceTwoFactorAuthentication();
  useEffect(() => {
    if (
      shouldEnforce2FA.status === DataStatus.Success &&
      !shouldEnforce2FA.data
    ) {
      history.push(routes.userCredentials);
    }
  }, [shouldEnforce2FA.status]);
  return (
    <ProtectedItemsUnlockerProvider>
      <SkeletonVault />
      <DialogContextProvider>
        <TwoFactorAuthenticationForBusinessContainer />
      </DialogContextProvider>
    </ProtectedItemsUnlockerProvider>
  );
};
