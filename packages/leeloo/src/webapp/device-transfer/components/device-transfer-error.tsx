import { FlexContainer } from '@dashlane/ui-components';
import { Button, Icon, jsx, Paragraph } from '@dashlane/design-system';
import { DeviceTransferContracts } from '@dashlane/authentication-contracts';
import { useModuleCommands } from '@dashlane/framework-react';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_ERROR_KEYS: Record<Exclude<DeviceTransferContracts.TrustedDeviceFlowErrors, DeviceTransferContracts.TrustedDeviceFlowErrors.INVALID_PASSPHRASE>, string> = {
    GENERIC_ERROR: '_common_generic_error',
    TIMEOUT: 'webapp_device_transfer_page_error_timeout',
    PASSPHRASE_ATTEMPTS_LIMIT: 'webapp_login_form_device_to_device_authentication_rate_limit',
};
export const I18N_KEYS = {
    ...I18N_ERROR_KEYS,
    BACK_BUTTON: 'webapp_device_transfer_page_error_back_button',
};
type Props = {
    error: DeviceTransferContracts.TrustedDeviceFlowErrors;
};
export const DeviceTransferError = ({ error }: Props) => {
    const { translate } = useTranslate();
    const { returnToDeviceSetup } = useModuleCommands(DeviceTransferContracts.deviceTransferApi);
    const handleGoBack = () => {
        returnToDeviceSetup();
    };
    return (<FlexContainer flexDirection="column" alignItems="center">
      <Icon name="FeedbackFailOutlined" color="ds.text.danger.quiet" sx={{ width: '77px', height: '77px' }}/>
      <Paragraph sx={{
            textAlign: 'center',
            margin: '32px 0',
            color: 'ds.text.danger.standard',
        }}>
        {translate(I18N_KEYS[error ?? 'GENERIC_ERROR'])}
      </Paragraph>
      <Button onClick={handleGoBack}>{translate(I18N_KEYS.BACK_BUTTON)}</Button>
    </FlexContainer>);
};
