import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Paragraph, useToast } from "@dashlane/design-system";
import { DeviceInfo, deviceManagementApi } from "@dashlane/device-contracts";
import { useModuleCommands, useModuleQuery } from "@dashlane/framework-react";
import useTranslate from "../../../libs/i18n/useTranslate";
import { AccountManagementSection } from "../account-details/account-management/account-management-section";
import { AccountSubPanel } from "../account-subpanel/account-subpanel";
import { Device } from "./device/device-tile";
import devicesListTransitionStyles from "./devices-list-transition.css";
import styles from "./styles.css";
import { DeviceManagementProps as Props } from "./types";
import { useState } from "react";
const I18N_KEYS = {
  DOWNLOAD_CTA: "webapp_account_devices_download_cta",
  EMPTY_LIST: "webapp_account_devices_empty_list",
  HEADING: "webapp_account_devices_heading",
  INTRO_DOWNLOAD: "webapp_account_devices_intro_download",
  INTRO_LIST: "webapp_account_devices_intro_list",
  DEACTIVATION_ANNOUNCEMENT: "webapp_account_device_deactivation_announcement",
};
const DeviceManagement = ({ onNavigateOut }: Props) => {
  const [
    deviceIdPendingDeactivateConfirmation,
    setDeviceIdPendingDeactivateConfirmation,
  ] = useState<string | null>(null);
  const [deactivatedDevices, setDeactivatedDevices] = useState<string[]>([]);
  const authorisedDeviceList = useModuleQuery(
    deviceManagementApi,
    "listAuthorisedDevice"
  );
  const { revokeAuthorisedDevice } = useModuleCommands(deviceManagementApi);
  const { renameAuthorisedDevice } = useModuleCommands(deviceManagementApi);
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const activeDevices = authorisedDeviceList.data?.filter(
    (device: { deviceId: string }) =>
      !deactivatedDevices.some(
        (deactivatedId) => deactivatedId === device.deviceId
      )
  );
  const sortDevicesByMostRecentUse = (devices: DeviceInfo[] | undefined) => {
    if (devices !== undefined) {
      return devices
        .map((device) => device)
        .sort((a, b) => {
          const aDate = new Date(a.lastUpdateDate).getTime();
          const bDate = new Date(b.lastUpdateDate).getTime();
          if (aDate < bDate) {
            return 1;
          }
          if (aDate > bDate) {
            return -1;
          }
          return 0;
        });
    }
  };
  const sortedDevices = sortDevicesByMostRecentUse(activeDevices);
  const saveDeviceName = async (deviceId: string, updatedName: string) => {
    await renameAuthorisedDevice({
      deviceId,
      updatedName,
    });
  };
  const onDeactivationRequest = (deviceId: string) => {
    setDeviceIdPendingDeactivateConfirmation(deviceId);
  };
  const onDeactivationCancelled = () => {
    setDeviceIdPendingDeactivateConfirmation(null);
  };
  const onConfirmedDeactivationRequest = async (deviceId: string) => {
    await revokeAuthorisedDevice({
      deviceId,
    });
    setDeactivatedDevices((prevDeactivatedDevices) =>
      prevDeactivatedDevices.concat(deviceId)
    );
    setDeviceIdPendingDeactivateConfirmation(null);
    showToast({
      description: translate(I18N_KEYS.DEACTIVATION_ANNOUNCEMENT),
      closeActionLabel: "Close",
    });
  };
  const listDevices = (devices: DeviceInfo[] | undefined) => {
    const deactivationPending = Boolean(deviceIdPendingDeactivateConfirmation);
    if (devices !== undefined) {
      return devices.map((device) => {
        const deactivationRequested =
          deviceIdPendingDeactivateConfirmation === device.deviceId;
        return (
          <CSSTransition
            classNames={{ ...devicesListTransitionStyles }}
            enter={false}
            timeout={200}
            key={"device-" + device.deviceId}
          >
            <li>
              <Device
                device={device}
                onSave={saveDeviceName}
                onDeactivationRequest={onDeactivationRequest}
                hideDeactivationButton={deactivationPending}
                isDeactivationRequested={deactivationRequested}
                onDeactivationCancelled={onDeactivationCancelled}
                onConfirmedDeactivationRequest={onConfirmedDeactivationRequest}
              />
            </li>
          </CSSTransition>
        );
      });
    }
  };
  return (
    <AccountSubPanel
      headingText={translate(I18N_KEYS.HEADING)}
      onNavigateOut={onNavigateOut}
    >
      <AccountManagementSection
        showBorder={false}
        sectionTitle={translate(I18N_KEYS.HEADING)}
      >
        <Paragraph
          textStyle="ds.body.helper.regular"
          color="ds.text.neutral.standard"
        >
          {translate(I18N_KEYS.INTRO_LIST)}
        </Paragraph>
      </AccountManagementSection>

      {sortedDevices?.length ? (
        <TransitionGroup component="ul">
          {listDevices(sortedDevices)}
        </TransitionGroup>
      ) : (
        <div className={styles.empty}>{translate(I18N_KEYS.EMPTY_LIST)}</div>
      )}
    </AccountSubPanel>
  );
};
export default DeviceManagement;
