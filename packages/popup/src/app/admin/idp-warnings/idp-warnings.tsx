import { Button, Infobox, jsx } from "@dashlane/design-system";
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
import useTranslate from "../../../libs/i18n/useTranslate";
import { logEvent } from "../../../libs/logs/logEvent";
import { openWebAppAndClosePopup } from "../../helpers";
export const I18N_KEYS = {
  FAILED_PROVISIONING_TITLE: "tab/admin/failed_provisioning/title",
  FAILED_PROVISIONING_DESCRIPTION: "tab/admin/failed_provisioning/description",
  FAILED_PROVISIONING_BUY_SEATS:
    "tab/admin/failed_provisioning/buy_seats_button",
  FAILED_PROVISIONING_DISMISS: "tab/admin/failed_provisioning/dismiss_button",
};
const OPEN_TAC_WITH_BUY_SEATS_DIALOG_QUERY =
  "/console/account?showSeatsDialog=true";
export const IdpWarnings = () => {
  const { translate } = useTranslate();
  const idpQueries = useModuleQueries(
    teamAdminNotificationsApi,
    {
      getIdPFailedProvisioningsData: {},
      hasSeenIdPNeedsSeatsInfoboxInPopup: {},
    },
    []
  );
  const {
    getIdPFailedProvisioningsData: getIdpFailedData,
    hasSeenIdPNeedsSeatsInfoboxInPopup,
  } = idpQueries;
  const { markIdPNeedsSeatsInfoboxInPopupSeen } = useModuleCommands(
    teamAdminNotificationsApi
  );
  if (
    getIdpFailedData.status !== DataStatus.Success ||
    hasSeenIdPNeedsSeatsInfoboxInPopup.status !== DataStatus.Success ||
    !getIdpFailedData.data ||
    !getIdpFailedData.data.shouldShowNotifications.alertFailuresNeedSeats ||
    hasSeenIdPNeedsSeatsInfoboxInPopup.data
  ) {
    return null;
  }
  const { requiredSeats } = getIdpFailedData.data;
  const handleClickOnBuySeats = () => {
    void logEvent(
      new UserClickEvent({
        clickOrigin: ClickOrigin.InsufficientSeatsProvisioningErrorBanner,
        button: HermesButton.BuySeats,
      })
    );
    void openWebAppAndClosePopup({
      route: `${OPEN_TAC_WITH_BUY_SEATS_DIALOG_QUERY}&seatsToBuy=${requiredSeats}`,
    });
  };
  const handleClickOnDismiss = () => {
    void logEvent(
      new UserClickEvent({
        clickOrigin: ClickOrigin.InsufficientSeatsProvisioningErrorBanner,
        button: HermesButton.Dismiss,
      })
    );
    void markIdPNeedsSeatsInfoboxInPopupSeen();
  };
  return (
    <Infobox
      size="large"
      title={translate(I18N_KEYS.FAILED_PROVISIONING_TITLE)}
      description={translate(I18N_KEYS.FAILED_PROVISIONING_DESCRIPTION, {
        count: requiredSeats,
      })}
      mood={"danger"}
      icon={"FeedbackFailOutlined"}
      actions={[
        <Button
          size="small"
          intensity="quiet"
          key="dismiss-failed-provisionings"
          onClick={handleClickOnDismiss}
        >
          {translate(I18N_KEYS.FAILED_PROVISIONING_DISMISS)}
        </Button>,
        <Button
          size="small"
          intensity="catchy"
          key="failed-provisionings-buy-seats"
          onClick={handleClickOnBuySeats}
        >
          {translate(I18N_KEYS.FAILED_PROVISIONING_BUY_SEATS, {
            count: requiredSeats,
          })}
        </Button>,
      ]}
    />
  );
};
