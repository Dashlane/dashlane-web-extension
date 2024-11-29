import { useState } from "react";
import { AlertSeverity } from "@dashlane/ui-components";
import {
  AnyFunctionalError,
  isSuccess,
  Result,
} from "@dashlane/framework-types";
import { CommandSuccess } from "@dashlane/framework-contracts";
import { useEventWrapper } from "@dashlane/framework-react";
import { useAlert } from "../../libs/alert-notifications/use-alert";
import useTranslate from "../../libs/i18n/useTranslate";
export const useLoadingCommandWithAlert = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { translate } = useTranslate();
  const { showAlert } = useAlert();
  const { wrap } = useEventWrapper();
  const commandHandler = async (
    command: () => Promise<Result<CommandSuccess, AnyFunctionalError>>,
    successMessage: string,
    errorMessage: string,
    undoAction?: () => void
  ) => {
    const wrappedEventHandler = wrap(
      async () => {
        setIsLoading(true);
        const commandSucceeded = isSuccess(await command());
        showAlert(
          commandSucceeded ? successMessage : errorMessage,
          commandSucceeded ? AlertSeverity.SUCCESS : AlertSeverity.ERROR,
          undefined,
          undoAction ? translate("common_alert_undo_action") : undefined,
          undoAction
        );
        setIsLoading(false);
      },
      () => showAlert(errorMessage, AlertSeverity.ERROR)
    );
    await wrappedEventHandler();
  };
  return { commandHandler, isLoading };
};
