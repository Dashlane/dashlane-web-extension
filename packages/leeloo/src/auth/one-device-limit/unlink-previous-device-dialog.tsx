import { Fragment } from 'react';
import { PreviousDeviceInfo as PreviousDeviceInfoData } from '@dashlane/communication';
import { Button, jsx } from '@dashlane/design-system';
import { Dialog, DialogBody, DialogTitle, FlexContainer, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { PreviousDeviceInfo } from './previous-device-info';
export interface UnlinkPreviousDeviceDialogProps {
    isOpen: boolean;
    handleOnCancel: () => void;
    handleOnConfirm: () => void;
    handleOnGetUnlimitedAccess: () => void;
    previousDeviceInfo: PreviousDeviceInfoData | undefined;
}
const I18N_KEYS = {
    CANCEL_BUTTON: 'webapp_login_one_device_limit_dialog_cancel',
    TEXT: 'webapp_login_one_device_limit_dialog_text',
    TITLE: 'webapp_login_one_device_limit_dialog_title',
    UNLINK_BUTTON: 'webapp_login_one_device_limit_dialog_unlink',
    CLOSE: '_common_dialog_dismiss_button',
    CONFIRM_TITLE: 'webapp_login_one_device_limit_dialog_title_confirm',
    TRANSFER_TEXT: 'webapp_login_one_device_limit_dialog_transfer_text',
    UPGRADE_TEXT: 'webapp_login_one_device_limit_dialog_upgrade_text',
    UNLIMITED_ACCESS_BUTTON: 'webapp_login_one_device_limit_dialog_unlimited_access',
    CONFIRM_UNLINK_BUTTON: 'webapp_login_one_device_limit_dialog_confirm_unlink',
};
export const UnlinkPreviousDeviceDialog = ({ handleOnCancel, handleOnConfirm, handleOnGetUnlimitedAccess, isOpen, previousDeviceInfo, }: UnlinkPreviousDeviceDialogProps) => {
    const { translate } = useTranslate();
    return (<Dialog closeIconName={translate(I18N_KEYS.CLOSE)} isOpen={isOpen} onClose={handleOnCancel}>
      <>
        <DialogTitle title={translate(I18N_KEYS.CONFIRM_TITLE, {
            deviceName: previousDeviceInfo?.name,
        })}/>
        <DialogBody sx={{ color: 'ds.text.neutral.standard' }}>
          {previousDeviceInfo ? (<PreviousDeviceInfo previousDeviceInfo={previousDeviceInfo}/>) : null}
          <Paragraph sx={{
            marginTop: '20px',
        }}>
            {translate(I18N_KEYS.TRANSFER_TEXT)}
          </Paragraph>
          <Paragraph sx={{
            marginTop: '20px',
        }}>
            {translate(I18N_KEYS.UPGRADE_TEXT)}
          </Paragraph>
        </DialogBody>
        <FlexContainer sx={{
            justifyContent: 'flex-end',
        }}>
          <Button intensity="quiet" mood="brand" onClick={handleOnGetUnlimitedAccess} sx={{ marginRight: '16px' }}>
            {translate(I18N_KEYS.UNLIMITED_ACCESS_BUTTON)}
          </Button>
          <Button mood="brand" onClick={handleOnConfirm}>
            {translate(I18N_KEYS.CONFIRM_UNLINK_BUTTON)}
          </Button>
        </FlexContainer>
      </>
    </Dialog>);
};
