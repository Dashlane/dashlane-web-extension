import { Button, Paragraph } from "@dashlane/design-system";
import {
  DataStatus,
  useModuleCommands,
  useModuleQuery,
} from "@dashlane/framework-react";
import { os } from "@dashlane/browser-utils";
import { vpnNotificationsApi } from "@dashlane/vpn-contracts";
import { VpnAccountStatusType } from "@dashlane/communication";
import useTranslate from "../../../libs/i18n/useTranslate";
import { openUrl } from "../../../libs/external-urls";
import {
  HOTSPOTSHIELD_INSTALL_URL,
  HOTSPOTSHIELD_INSTALL_URL_MAP,
} from "../helpers/links";
import { OPEN_IN_NEW_TAB } from "../helpers/constants";
import { TutorialStepNumberProp } from "../helpers/types";
import { logUserDownloadVpnClient } from "../logs";
import { TutorialStep, TutorialStepStatus } from "./tutorial/tutorial-step";
import { TutorialStepWrapper } from "./tutorial/tutorial-step-wrapper";
const I18N_KEYS = {
  ACCESS: {
    HEADING: "webapp_vpn_page_access_hotspotshield_heading",
    TEXT: "webapp_vpn_page_access_hotspotshield_text_markup",
  },
  INSTALL: {
    BUTTON: "webapp_vpn_page_install_hotspotshield_button",
    BUTTON_INFOBOX:
      "webapp_vpn_page_install_hotspotshield_button_infobox_message",
    HEADING: "webapp_vpn_page_install_hotspotshield_heading",
    TEXT: "webapp_vpn_page_install_hotspotshield_text",
  },
};
const DOWNLOAD_URL =
  HOTSPOTSHIELD_INSTALL_URL_MAP[os.getOSName() ?? ""] ??
  HOTSPOTSHIELD_INSTALL_URL;
export const VpnInstallHotspotshield = ({
  stepNumber,
  vpnCredential,
}: TutorialStepNumberProp) => {
  const { translate } = useTranslate();
  const hasSeenNotification = useModuleQuery(
    vpnNotificationsApi,
    "hasSeenInstallVpn"
  );
  const { markInstallVpnSeen } = useModuleCommands(vpnNotificationsApi);
  const onClickGetTheAppButton = () => {
    markInstallVpnSeen();
    logUserDownloadVpnClient();
    openUrl(DOWNLOAD_URL);
  };
  const hasSeenInstallVpn =
    hasSeenNotification.status === DataStatus.Success &&
    hasSeenNotification.data;
  if (
    hasSeenNotification.status === DataStatus.Loading ||
    hasSeenNotification.status === DataStatus.Error
  ) {
    return null;
  }
  const title = translate(
    !hasSeenInstallVpn ? I18N_KEYS.INSTALL.HEADING : I18N_KEYS.ACCESS.HEADING
  );
  const status = !hasSeenInstallVpn
    ? TutorialStepStatus.INITIAL
    : TutorialStepStatus.COMPLETED;
  const canDownloadApp =
    vpnCredential &&
    (vpnCredential.status === VpnAccountStatusType.Ready ||
      vpnCredential.status === VpnAccountStatusType.Activated);
  return (
    <TutorialStepWrapper>
      <TutorialStep
        number={stepNumber}
        status={status}
        title={title}
        actions={
          !hasSeenInstallVpn ? (
            <Button
              role="link"
              tooltip={translate(I18N_KEYS.INSTALL.BUTTON_INFOBOX)}
              type="button"
              disabled={!canDownloadApp}
              onClick={!canDownloadApp ? undefined : onClickGetTheAppButton}
              icon="ActionOpenExternalLinkOutlined"
              layout="iconTrailing"
            >
              {translate(I18N_KEYS.INSTALL.BUTTON)}
            </Button>
          ) : null
        }
      >
        {!hasSeenInstallVpn ? (
          <Paragraph textStyle="ds.body.reduced.regular">
            {translate(I18N_KEYS.INSTALL.TEXT)}
          </Paragraph>
        ) : (
          <Paragraph textStyle="ds.body.reduced.regular">
            {translate.markup(
              I18N_KEYS.ACCESS.TEXT,
              {
                hotspotShield: DOWNLOAD_URL,
              },
              {
                linkTarget: OPEN_IN_NEW_TAB,
                onLinkClicked: logUserDownloadVpnClient,
              }
            )}
          </Paragraph>
        )}
      </TutorialStep>
    </TutorialStepWrapper>
  );
};
