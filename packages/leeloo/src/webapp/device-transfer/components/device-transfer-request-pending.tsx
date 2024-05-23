import { Fragment } from 'react';
import { fromUnixTime } from 'date-fns';
import { Button, Heading, Infobox, jsx, Paragraph, } from '@dashlane/design-system';
import { DeviceTransferContracts } from '@dashlane/authentication-contracts';
import { FlexContainer } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { useModuleCommands } from '@dashlane/framework-react';
import { LocaleFormat } from 'libs/i18n/helpers';
type Props = Omit<DeviceTransferContracts.TrustedDeviceFlowNewRequestView, 'step'>;
export const I18N_KEYS = {
    TITLE: 'webapp_device_transfer_page_pending_request_title',
    DESCRIPTION: 'webapp_device_transfer_page_pending_request_description',
    REJECT_BUTTON: 'webapp_device_transfer_page_pending_request_reject_button',
    CONFIRM_BUTTON: 'webapp_device_transfer_page_pending_request_confirm_button',
    ADDITIONAL_SECURITY_INFO: 'webapp_device_transfer_page_pending_request_additional_infobox',
};
export const DeviceTransferRequestPending = ({ untrustedDeviceName, requestTimestamp, untrustedDeviceLocation, }: Props) => {
    const { translate } = useTranslate();
    const { approveRequest, rejectRequest } = useModuleCommands(DeviceTransferContracts.deviceTransferApi);
    return (<>
      <Heading as="h2" textStyle="ds.title.section.medium" sx={{ marginBottom: '8px' }}>
        {translate(I18N_KEYS.TITLE)}
      </Heading>
      <Paragraph>{translate(I18N_KEYS.DESCRIPTION)}</Paragraph>
      <FlexContainer sx={{
            flexDirection: 'column',
            bg: 'ds.container.agnostic.neutral.quiet',
            borderRadius: '8px',
            padding: '24px',
            margin: '32px 0',
        }}>
        <Paragraph>{untrustedDeviceName}</Paragraph>
        <Paragraph sx={{ margin: '12px 0' }}>
          {untrustedDeviceLocation}
        </Paragraph>
        <Paragraph>
          {translate.shortDate(fromUnixTime(requestTimestamp), LocaleFormat.lll)}
        </Paragraph>
      </FlexContainer>
      <Infobox title={translate(I18N_KEYS.ADDITIONAL_SECURITY_INFO)} mood="brand" sx={{ marginBottom: '24px' }}/>
      <FlexContainer flexDirection="row" justifyContent="right" gap="8px">
        <Button mood="neutral" intensity="quiet" onClick={() => rejectRequest()}>
          {translate(I18N_KEYS.REJECT_BUTTON)}
        </Button>
        <Button onClick={() => approveRequest()}>
          {translate(I18N_KEYS.CONFIRM_BUTTON)}
        </Button>
      </FlexContainer>
    </>);
};
