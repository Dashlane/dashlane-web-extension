import { Button, Infobox } from "@dashlane/design-system";
import {
  ClickOrigin,
  Button as HermesButton,
  UserClickEvent,
} from "@dashlane/hermes";
import {
  DataStatus,
  useModuleCommands,
  useModuleQueries,
} from "@dashlane/framework-react";
import { teamAdminNotificationsApi } from "@dashlane/team-admin-contracts";
import { logEvent } from "../../../libs/logs/logEvent";
import { Link, useRouterGlobalSettingsContext } from "../../../libs/router";
import useTranslate from "../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  FAILED_PROVISIONINGS_TITLE: "team_idp_errors_infobox_title",
  BUY_SEATS: "team_idp_errors_infobox_button_buy_seats",
  PENDING_PROVISIONINGS_TITLE: "team_idp_pending_warning_infobox_title",
  PENDING_PROVISIONINGS_DESCRIPTION:
    "team_idp_pending_warning_infobox_description",
  DISMISS: "team_idp_infoboxes_dismiss_button",
};
export const FailedIdPProvisioningsInfobox = () => {
  const { routes } = useRouterGlobalSettingsContext();
  const { translate } = useTranslate();
  const idpQueries = useModuleQueries(
    teamAdminNotificationsApi,
    {
      getIdPFailedProvisioningsData: {},
      hasSeenIdPNeedsSeatsInfobox: {},
      hasSeenIdPProvisioningsPendingInfobox: {},
    },
    []
  );
  const {
    markIdPNeedsSeatsInfoboxSeen,
    markIdPProvisioningsPendingInfoboxSeen,
  } = useModuleCommands(teamAdminNotificationsApi);
  const {
    getIdPFailedProvisioningsData: failedProvisionings,
    hasSeenIdPNeedsSeatsInfobox,
    hasSeenIdPProvisioningsPendingInfobox,
  } = idpQueries;
  if (
    failedProvisionings.status !== DataStatus.Success ||
    !failedProvisionings.data?.nbOfFailedCreations ||
    hasSeenIdPNeedsSeatsInfobox.status !== DataStatus.Success ||
    hasSeenIdPProvisioningsPendingInfobox.status !== DataStatus.Success
  ) {
    return null;
  }
  const { nbOfPendingProvisionings, requiredSeats, shouldShowNotifications } =
    failedProvisionings.data;
  const showWarningProvisioningsPending =
    !hasSeenIdPProvisioningsPendingInfobox.data &&
    shouldShowNotifications.warningProvisioningsPending;
  const showAlertFailuresNeedSeats =
    !hasSeenIdPNeedsSeatsInfobox.data &&
    shouldShowNotifications.alertFailuresNeedSeats;
  const handleBuySeats = () => {
    logEvent(
      new UserClickEvent({
        button: HermesButton.BuySeats,
        clickOrigin: ClickOrigin.InsufficientSeatsProvisioningErrorBanner,
      })
    );
  };
  const handleDismissIdPNeedsSeatsInfobox = () => {
    logEvent(
      new UserClickEvent({
        button: HermesButton.Dismiss,
        clickOrigin: ClickOrigin.InsufficientSeatsProvisioningErrorBanner,
      })
    );
    markIdPNeedsSeatsInfoboxSeen();
  };
  const handleDismissPendingProvisioningsInfobox = () => {
    logEvent(
      new UserClickEvent({
        button: HermesButton.Dismiss,
        clickOrigin: ClickOrigin.ProvisionRemainingSeatsReminder,
      })
    );
    markIdPProvisioningsPendingInfoboxSeen();
  };
  return (
    <>
      {showWarningProvisioningsPending ? (
        <Infobox
          size="large"
          mood="warning"
          title={translate(I18N_KEYS.PENDING_PROVISIONINGS_TITLE, {
            count: nbOfPendingProvisionings,
            nbOfFailedUsers: nbOfPendingProvisionings,
          })}
          description={translate(I18N_KEYS.PENDING_PROVISIONINGS_DESCRIPTION)}
          icon="FeedbackWarningOutlined"
          actions={[
            <Button
              size="small"
              intensity="quiet"
              onClick={handleDismissPendingProvisioningsInfobox}
              key="dismiss-pending-provisionings"
            >
              {translate(I18N_KEYS.DISMISS)}
            </Button>,
          ]}
        />
      ) : null}
      {showAlertFailuresNeedSeats ? (
        <Infobox
          size="large"
          mood="danger"
          title={translate(I18N_KEYS.FAILED_PROVISIONINGS_TITLE, {
            count: requiredSeats,
            nbOfFailedUsers: requiredSeats,
          })}
          icon="FeedbackFailOutlined"
          actions={[
            <Button
              size="small"
              intensity="quiet"
              onClick={handleDismissIdPNeedsSeatsInfobox}
              key="dismiss-failed-provisionings"
            >
              {translate(I18N_KEYS.DISMISS)}
            </Button>,
            <Button
              as={Link}
              size="small"
              intensity="catchy"
              to={`${routes.teamAccountRoutePath}?showSeatsDialog=true&seatsToBuy=${requiredSeats}`}
              onClick={handleBuySeats}
              key="buy-seats-idp"
            >
              {translate(I18N_KEYS.BUY_SEATS, { count: requiredSeats })}
            </Button>,
          ]}
        />
      ) : null}
    </>
  );
};
