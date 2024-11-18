import { kernel } from "../../kernel";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { useModuleCommands } from "@dashlane/framework-react";
export const useLogout = () => {
  const { logout } = useModuleCommands(
    AuthenticationFlowContracts.authenticationFlowApi
  );
  return async () => {
    await logout();
    kernel.browser.closePopover();
  };
};
