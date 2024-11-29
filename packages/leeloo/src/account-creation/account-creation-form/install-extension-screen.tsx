import { AccountCreationFlowType } from "../types";
import { AdminInstallExtensionScreen } from "./admin-install-extension-screen";
import { EmployeeInstallExtensionScreen } from "./employee-install-extension-screen";
import { PasswordlessInstallExtensionScreen } from "./passwordless-install-extension-screen";
interface InstallExtensionPageProps {
  signUpFlow: AccountCreationFlowType;
  onSkipInstallExtension: () => void;
}
export const InstallExtensionScreen = ({
  signUpFlow,
  onSkipInstallExtension,
}: InstallExtensionPageProps) => {
  if (signUpFlow === AccountCreationFlowType.B2C) {
    return <PasswordlessInstallExtensionScreen />;
  }
  if (signUpFlow === AccountCreationFlowType.ADMIN) {
    return (
      <AdminInstallExtensionScreen
        onSkipInstallExtension={onSkipInstallExtension}
      />
    );
  }
  return <EmployeeInstallExtensionScreen />;
};
