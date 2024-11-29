import { accountRecoveryKeyApi } from "@dashlane/account-recovery-contracts";
import {
  DataStatus,
  useModuleCommands,
  useModuleQuery,
} from "@dashlane/framework-react";
export const useRecoveryNotification = () => {
  const { data, status } = useModuleQuery(
    accountRecoveryKeyApi,
    "shouldNotifyOfRecoveryActivation"
  );
  const { acknowledgeRecoveryActivation } = useModuleCommands(
    accountRecoveryKeyApi
  );
  const showNotification = status === DataStatus.Success ? data : false;
  return {
    showNotification,
    acknowledgeNotification: acknowledgeRecoveryActivation,
  };
};
