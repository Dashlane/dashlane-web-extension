import * as React from 'react';
import classnames from 'classnames';
import { DeviceInfo } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import { DeviceDeactivateButton } from './deactivate-button';
import { DeactivationConfirm } from './deactivation-confirm';
import { DeviceDetails } from './device-details';
import { DeviceName } from './device-name';
import styles from './styles.css';
export interface Props {
    device: DeviceInfo;
    onDeactivationRequest: (deviceId: string) => void;
    isDeactivationRequested?: boolean;
    hideDeactivationButton?: boolean;
    onDeactivationCancelled: () => void;
    onConfirmedDeactivationRequest: (deviceId: string) => void;
    onSave: (deviceId: string, updatedName: string) => void;
    onChange?: () => void;
}
export enum ActionState {
    'CanRemoveDevice',
    'NamedEdited',
    'EditInProgress'
}
const I18N_KEYS_ARIA = {
    NAME_UPDATED: 'webapp_account_devices_name_updated_aria',
};
export const Device = ({ device, onDeactivationRequest, isDeactivationRequested, hideDeactivationButton, onDeactivationCancelled, onConfirmedDeactivationRequest, onSave, onChange, }: Props) => {
    const timer = React.useRef<NodeJS.Timeout | null>(null);
    const [actionState, setActionState] = React.useState(ActionState.CanRemoveDevice);
    const { translate } = useTranslate();
    React.useEffect(() => {
        return () => {
            if (timer.current) {
                clearTimeout(timer.current);
            }
        };
    }, []);
    const handleChange = () => {
        setActionState(ActionState.EditInProgress);
        if (onChange) {
            onChange();
        }
    };
    const handleSave = (deviceName: string, feedbackDurationMs: number) => {
        if (onSave) {
            onSave(device.deviceId, deviceName);
        }
        setActionState(ActionState.EditInProgress);
        timer.current = setTimeout(() => {
            if (actionState === ActionState.EditInProgress) {
                setActionState(ActionState.NamedEdited);
            }
        }, feedbackDurationMs * 2);
    };
    const handleCancel = () => {
        setActionState(ActionState.CanRemoveDevice);
    };
    const containerClassName = classnames(styles.container, {
        [styles.deactivate]: isDeactivationRequested,
    });
    return (<section className={containerClassName}>
      <div className={styles.infoContainer}>
        <div className={styles.iconContainer}>
          <div className={classnames(styles.platformIcon, styles['platformIcon_' + device.devicePlatform])}/>
        </div>
        <div className={styles.textContainer}>
          {!device.isCurrentDevice && !hideDeactivationButton ? (<DeviceDeactivateButton actionState={actionState} handleClick={() => onDeactivationRequest(device.deviceId)}/>) : null}
          <DeviceName canToggle={!isDeactivationRequested} name={device.deviceName} onCancel={handleCancel} onChange={handleChange} onSave={handleSave}/>
          <div role="status" style={{
            height: '1px',
            width: '1px',
            overflow: 'hidden',
            position: 'absolute',
            whiteSpace: 'nowrap',
            clipPath: 'inset(50%)',
        }}>
            {actionState === ActionState.NamedEdited
            ? translate(I18N_KEYS_ARIA.NAME_UPDATED)
            : ''}
          </div>
          {isDeactivationRequested ? (<DeactivationConfirm key="deactivation-confirm" onConfirm={() => onConfirmedDeactivationRequest(device.deviceId)} onCancel={onDeactivationCancelled}/>) : (<DeviceDetails creationDate={new Date(device.creationDate)} lastUpdateDate={new Date(device.lastUpdateDate)}/>)}
        </div>
      </div>
    </section>);
};
