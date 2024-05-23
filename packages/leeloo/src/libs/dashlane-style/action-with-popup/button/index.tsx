import { FormEvent, forwardRef, MouseEvent, PropsWithChildren, Ref, useImperativeHandle, useState, } from 'react';
import classnames from 'classnames';
import { jsx } from '@dashlane/ui-components';
import { Button, ButtonIntensity, ButtonMood, Icon, IconName, } from '@dashlane/design-system';
import Popup from 'libs/dashlane-style/action-with-popup/popup';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import styles from './styles.css';
interface ButtonWithPopupProps {
    buttonLabel: string;
    confirmButtonLabel: string;
    cancelButtonLabel: string;
    onConfirmButtonClick?: () => void;
    onCancelButtonClick?: () => void;
    onPopupOpen?: () => void;
    confirmButtonDisabled?: boolean;
    popupClassName?: string;
    buttonMood?: ButtonMood;
    buttonIntensity?: ButtonIntensity;
    buttonIconName?: IconName;
}
export interface ButtonWithPopupRef {
    hidePopup: () => void;
}
export const ButtonWithPopup = forwardRef<ButtonWithPopupRef, PropsWithChildren<ButtonWithPopupProps>>(({ buttonLabel, confirmButtonLabel, cancelButtonLabel, onConfirmButtonClick, onCancelButtonClick, onPopupOpen, confirmButtonDisabled, popupClassName, buttonMood = 'brand', buttonIntensity = 'catchy', buttonIconName = 'ActionAddOutlined', children, }, ref: Ref<ButtonWithPopupRef>) => {
    const { openDialog: openTrialDiscontinuedDialog, shouldShowTrialDiscontinuedDialog, } = useTrialDiscontinuedDialogContext();
    const [showPopup, setShowPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const handleClickOnMainButton = () => {
        if (shouldShowTrialDiscontinuedDialog) {
            openTrialDiscontinuedDialog();
            return;
        }
        setShowPopup(true);
        onPopupOpen?.();
    };
    const hidePopup = () => {
        setIsLoading(false);
        setShowPopup(false);
    };
    useImperativeHandle(ref, () => ({
        hidePopup() {
            hidePopup();
        },
    }));
    const handleConfirmAction = (e?: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => {
        if (e) {
            e.preventDefault();
        }
        if (confirmButtonDisabled || !onConfirmButtonClick) {
            return;
        }
        setShowPopup(true);
        setIsLoading(true);
        onConfirmButtonClick();
    };
    const handleCancelAction = () => {
        hidePopup();
        onCancelButtonClick?.();
    };
    if (shouldShowTrialDiscontinuedDialog === null) {
        return null;
    }
    return (<div style={{ position: 'relative' }}>
        <Button mood={buttonMood} intensity={buttonIntensity} onClick={handleClickOnMainButton} disabled={showPopup} layout="iconLeading" icon={<Icon name={buttonIconName}/>}>
          {buttonLabel}
        </Button>

        {showPopup && (<Popup className={classnames(styles.popup, popupClassName)} onClickOutside={handleCancelAction}>
            <form onSubmit={handleConfirmAction}>
              {children}
              <div sx={{ display: 'flex', justifyContent: 'right' }}>
                <Button style={{ marginRight: 16 }} onClick={handleCancelAction} mood="neutral" intensity="supershy">
                  {cancelButtonLabel}
                </Button>
                <Button isLoading={isLoading} disabled={confirmButtonDisabled} onClick={handleConfirmAction}>
                  {confirmButtonLabel}
                </Button>
              </div>
            </form>
          </Popup>)}
      </div>);
});
