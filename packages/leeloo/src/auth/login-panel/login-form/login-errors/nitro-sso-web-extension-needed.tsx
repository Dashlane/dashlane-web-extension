import React from 'react';
import { colors, CrossCircleIcon, Dialog, DialogBody, DialogFooter, DialogTitle, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
export const I18N_KEYS = {
    CLOSE: '_common_dialog_dismiss_button'
};
export const I18N_VALUES = {
    DIALOG_TITLE: 'Extension required to log in',
    DIALOG_BODY: 'Because you’re using SSO with Dashlane, you need to log in to your account with the extension.',
    DIALOG_CTA: 'Add extension',
};
interface NitroSSOLoginExtensionNeededProps {
    isOpen: boolean;
    handleButtonClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    handleClose: () => void;
}
export const NitroSSOLoginExtensionNeededDialog = ({ isOpen, handleButtonClick, handleClose, }: NitroSSOLoginExtensionNeededProps) => {
    const { translate } = useTranslate();
    return (<Dialog closeIconName={translate(I18N_KEYS.CLOSE)} isOpen={isOpen} onClose={handleClose}>
      <div style={{ marginBottom: '25px' }}>
        <CrossCircleIcon size={62} color={colors.functionalRed02}/>
      </div>
      <DialogTitle title={I18N_VALUES.DIALOG_TITLE}/>
      <DialogBody>
        <Paragraph>{I18N_VALUES.DIALOG_BODY}</Paragraph>
      </DialogBody>
      <DialogFooter primaryButtonTitle={I18N_VALUES.DIALOG_CTA} primaryButtonOnClick={handleButtonClick}/>
    </Dialog>);
};
