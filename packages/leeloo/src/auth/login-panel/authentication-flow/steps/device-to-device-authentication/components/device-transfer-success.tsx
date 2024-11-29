import { useEffect } from "react";
import classnames from "classnames";
import { Button, Paragraph } from "@dashlane/design-system";
import { analyticsApi } from "@dashlane/framework-contracts";
import { useModuleCommands } from "@dashlane/framework-react";
import {
  ActionDuringTransfer,
  DeviceSelected,
  PageView,
  TransferMethod,
  UserTransferNewDeviceEvent,
} from "@dashlane/hermes";
import { Header, Navigation, WebappLoginLayout } from "../../../components";
import { BasePanelContainer } from "../../../../../../left-panels/base-panel-container";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
import {
  redirect,
  useRouterGlobalSettingsContext,
} from "../../../../../../libs/router";
import { StandardMarketingContainer } from "../../../../../../left-panels";
import styles from "../../../../../styles.css";
import { logEvent } from "../../../../../../libs/logs/logEvent";
import { useShouldEnforcePin } from "../../../../../../webapp/account/security-settings/pin-code-enforcement-root/hooks/use-should-enforce-pin";
export const I18N_KEYS = {
  DEVICE_TRANSFER_SUCCESS_TITLE:
    "webapp_device_to_device_authentication_device_setup_title",
  DESCRIPTION:
    "webapp_device_to_device_authentication_device_setup_description_markup",
  ACCESS_VAULT:
    "webapp_device_to_device_authentication_device_setup_access_vault_cta",
  SET_UP_PIN_DESCRIPTION:
    "webapp_device_to_device_authentication_device_setup_pin_description",
  SET_UP_PIN_BUTTON:
    "webapp_device_to_device_authentication_device_setup_pin_button",
};
export const DeviceTransferSuccess = () => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const { trackPageView } = useModuleCommands(analyticsApi);
  const { shouldEnforce } = useShouldEnforcePin();
  const logUserTransferNewDevice = (
    action: ActionDuringTransfer,
    biometricsEnabled: boolean,
    loggedInDeviceSelected: DeviceSelected,
    transferMethod: TransferMethod
  ) => {
    void logEvent(
      new UserTransferNewDeviceEvent({
        action,
        biometricsEnabled,
        loggedInDeviceSelected,
        transferMethod,
      })
    );
  };
  useEffect(() => {
    trackPageView({
      pageView: PageView.LoginDeviceTransferSuccess,
    });
    logUserTransferNewDevice(
      ActionDuringTransfer.CompleteDeviceTransfer,
      false,
      DeviceSelected.Any,
      TransferMethod.NotSelected
    );
  }, []);
  const handleRedirectToVault = () => {
    redirect(routes.userCredentials);
  };
  return (
    <div
      sx={{ backgroundColor: "ds.container.agnostic.neutral.supershy" }}
      className={styles.panelsContainer}
    >
      <StandardMarketingContainer />
      <div
        className={classnames(
          styles.panelContainer,
          styles.loginPanelContainer
        )}
      >
        <Navigation />
        <BasePanelContainer backgroundColor="ds.background.default">
          <WebappLoginLayout>
            <Header text={translate(I18N_KEYS.DEVICE_TRANSFER_SUCCESS_TITLE)} />
            <Paragraph>
              {shouldEnforce
                ? translate(I18N_KEYS.SET_UP_PIN_DESCRIPTION)
                : translate.markup(I18N_KEYS.DESCRIPTION)}
            </Paragraph>
            <Button
              fullsize
              mood="brand"
              intensity="catchy"
              onClick={handleRedirectToVault}
            >
              {shouldEnforce
                ? translate(I18N_KEYS.SET_UP_PIN_BUTTON)
                : translate(I18N_KEYS.ACCESS_VAULT)}
            </Button>
          </WebappLoginLayout>
        </BasePanelContainer>
      </div>
    </div>
  );
};
