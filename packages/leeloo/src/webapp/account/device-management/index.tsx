import * as React from 'react';
import { Maybe } from 'tsmonad';
import { isEqual } from 'lodash';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { carbonConnector } from 'libs/carbon/connector';
import * as carbonActions from 'libs/carbon/reducer';
import useTranslate from 'libs/i18n/useTranslate';
import { AccountSubPanel } from 'webapp/account/account-subpanel/account-subpanel';
import { DeviceInfo, DeviceManagementProps as Props } from './types';
import { Device } from './device';
import styles from './styles.css';
import devicesListTransitionStyles from './devices-list-transition.css';
const I18N_KEYS = {
    DOWNLOAD_CTA: 'webapp_account_devices_download_cta',
    EMPTY_LIST: 'webapp_account_devices_empty_list',
    HEADING: 'webapp_account_devices_heading',
    INTRO_DOWNLOAD: 'webapp_account_devices_intro_download',
    INTRO_LIST: 'webapp_account_devices_intro_list',
};
const DeviceManagement = ({ devices, lee, onNavigateOut }: Props) => {
    const [deviceIdPendingDeactivateConfirmation, setDeviceIdPendingDeactivateConfirmation,] = React.useState<string | null>(null);
    const [deactivatedDevices, setDeactivatedDevices] = React.useState<string[]>([]);
    React.useEffect(() => {
        carbonConnector.getDevicesList(null).then((result) => {
            Maybe.maybe(result).caseOf({
                just: ({ devicesList }) => {
                    if (isEqual(devicesList, devices)) {
                        return;
                    }
                    lee.dispatchGlobal(carbonActions.devicesListUpdated(devicesList));
                },
                nothing: () => {
                    lee.reportError(new Error('[Leeloo] Could not retrieve Device list from Carbon'));
                },
            });
        });
    }, []);
    const { translate } = useTranslate();
    const activeDevices = devices.filter((device) => !deactivatedDevices.some((deactivatedId) => deactivatedId === device.deviceId));
    const sortDevicesByMostRecentUse = (devices: DeviceInfo[]): DeviceInfo[] => {
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
    };
    const sortedDevices = sortDevicesByMostRecentUse(activeDevices);
    const saveDeviceName = (deviceId: string, updatedName: string) => {
        carbonConnector.changeDeviceName({ deviceId, updatedName });
    };
    const onDeactivationRequest = (deviceId: string) => {
        setDeviceIdPendingDeactivateConfirmation(deviceId);
    };
    const onDeactivationCancelled = () => {
        setDeviceIdPendingDeactivateConfirmation(null);
    };
    const onConfirmedDeactivationRequest = (deviceId: string) => {
        carbonConnector.deactivateDevice({ deviceId });
        setDeactivatedDevices((prevDeactivatedDevices) => prevDeactivatedDevices.concat(deviceId));
        setDeviceIdPendingDeactivateConfirmation(null);
    };
    const listDevices = (devices: DeviceInfo[]) => {
        const deactivationPending = Boolean(deviceIdPendingDeactivateConfirmation);
        return devices.map((device) => {
            const deactivationRequested = deviceIdPendingDeactivateConfirmation === device.deviceId;
            return (<CSSTransition classNames={{ ...devicesListTransitionStyles }} enter={false} timeout={200} key={'device-' + device.deviceId}>
          <li>
            <Device device={device} onSave={saveDeviceName} onDeactivationRequest={onDeactivationRequest} hideDeactivationButton={deactivationPending} isDeactivationRequested={deactivationRequested} onDeactivationCancelled={onDeactivationCancelled} onConfirmedDeactivationRequest={onConfirmedDeactivationRequest}/>
          </li>
        </CSSTransition>);
        });
    };
    return (<AccountSubPanel headingText={translate(I18N_KEYS.HEADING)} onNavigateOut={onNavigateOut}>
      <div className={styles.intro}>
        <p>{translate(I18N_KEYS.INTRO_LIST)}</p>
      </div>

      {activeDevices.length ? (<TransitionGroup component="ul">
          {listDevices(sortedDevices)}
        </TransitionGroup>) : (<div className={styles.empty}>{translate(I18N_KEYS.EMPTY_LIST)}</div>)}
    </AccountSubPanel>);
};
export default DeviceManagement;
