import { Button, jsx } from '@dashlane/design-system';
import { FlexContainer } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { useState } from 'react';
import { SetupOtpDialog } from './setup-otp-dialog';
const I18N_KEYS = {
    SET_UP_BUTTON: 'webapp_credential_edition_field_otp_setup_title',
};
export interface CredentialSetupOtpFieldProps {
    setHasOpenedDialogs?: (hasBeenEdited: boolean) => void;
    onSubmit: (value: string) => void;
    url: string;
    title: string;
}
export const CredentialSetupOtpField = ({ setHasOpenedDialogs, url, title, onSubmit, }: CredentialSetupOtpFieldProps) => {
    const { translate } = useTranslate();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (<FlexContainer justifyContent="flex-end">
      <Button icon="ArrowRightOutlined" layout="iconTrailing" intensity="supershy" mood="brand" onClick={() => {
            setIsOpen(true);
            setHasOpenedDialogs?.(true);
        }}>
        {translate(I18N_KEYS.SET_UP_BUTTON)}
      </Button>
      <SetupOtpDialog url={url} title={title} isOpen={isOpen} onSubmit={onSubmit} onClose={() => {
            setIsOpen(false);
            setHasOpenedDialogs?.(false);
        }}/>
    </FlexContainer>);
};
