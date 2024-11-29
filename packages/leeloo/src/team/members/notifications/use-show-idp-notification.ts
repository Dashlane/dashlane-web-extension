import {
  CallToAction,
  ToastName,
  UserCallToActionEvent,
} from "@dashlane/hermes";
import { AlertSeverity } from "@dashlane/ui-components";
import {
  DataStatus,
  useModuleCommands,
  useModuleQueries,
} from "@dashlane/framework-react";
import { teamAdminNotificationsApi } from "@dashlane/team-admin-contracts";
import { redirect, useRouterGlobalSettingsContext } from "../../../libs/router";
import { logEvent } from "../../../libs/logs/logEvent";
import { Notification } from "../../../libs/notifications/types";
const I18N_KEYS = {
  IDP_ERROR_NOTIFICATION_DESCRIPTION: "team_idp_error_notification_description",
  IDP_ERROR_NOTIFICATION_CTA: "team_idp_error_notification_cta",
};
export const useGetIdpErrorNotification = (): Notification[] => {
  const { routes } = useRouterGlobalSettingsContext();
  const failedProvisionings = useModuleQueries(
    teamAdminNotificationsApi,
    {
      getIdPFailedProvisioningsData: {},
      hasSeenIdPFailedNotification: {},
    },
    []
  );
  const { markIdPFailedNotificationSeen } = useModuleCommands(
    teamAdminNotificationsApi
  );
  if (
    failedProvisionings.getIdPFailedProvisioningsData.status !==
      DataStatus.Success ||
    failedProvisionings.hasSeenIdPFailedNotification.status !==
      DataStatus.Success ||
    !failedProvisionings.getIdPFailedProvisioningsData.data?.nbOfFailedCreations
  ) {
    return [];
  }
  const { requiredSeats } =
    failedProvisionings.getIdPFailedProvisioningsData.data;
  const handleClickOnBuySeats = () => {
    void logEvent(
      new UserCallToActionEvent({
        callToActionList: [CallToAction.Close, CallToAction.BuySeats],
        toastName: ToastName.InsufficientSeatsProvisioningError,
        chosenAction: CallToAction.BuySeats,
        hasChosenNoAction: false,
      })
    );
    redirect(
      `${routes.teamAccountRoutePath}?showSeatsDialog=true&seatsToBuy=${requiredSeats}`
    );
  };
  const handleCloseToast = () => {
    void logEvent(
      new UserCallToActionEvent({
        callToActionList: [CallToAction.Close, CallToAction.BuySeats],
        toastName: ToastName.InsufficientSeatsProvisioningError,
        chosenAction: CallToAction.Close,
        hasChosenNoAction: false,
      })
    );
    markIdPFailedNotificationSeen();
  };
  return !failedProvisionings.hasSeenIdPFailedNotification.data &&
    failedProvisionings.getIdPFailedProvisioningsData.data
      .shouldShowNotifications.alertFailuresNeedSeats
    ? [
        {
          key: "idpErrorNotification",
          level: AlertSeverity.ERROR,
          textKey: I18N_KEYS.IDP_ERROR_NOTIFICATION_DESCRIPTION,
          isPluralKey: true,
          keyParams: {
            count: requiredSeats,
          },
          buttonTextKey: I18N_KEYS.IDP_ERROR_NOTIFICATION_CTA,
          handleClose: handleCloseToast,
          handleButtonClick: handleClickOnBuySeats,
        },
      ]
    : [];
};
