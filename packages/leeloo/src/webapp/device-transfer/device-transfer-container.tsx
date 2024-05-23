import { Fragment } from 'react';
import { Heading, jsx } from '@dashlane/design-system';
import { FlexContainer } from '@dashlane/ui-components';
import { useModuleQuery } from '@dashlane/framework-react';
import { DeviceTransferContracts } from '@dashlane/authentication-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import { Header } from 'webapp/components/header/header';
import { Connected as NotificationsDropdown } from 'webapp/bell-notifications/connected';
import { HeaderAccountMenu } from 'webapp/components/header/header-account-menu';
import { DeviceTransferInstructions } from './components/device-transfer-instructions';
import { DeviceTransferRequestPending } from './components/device-transfer-request-pending';
import { DeviceTransferSecurityChallenge } from './components/device-transfer-security-challenge';
import { DeviceTransferComplete } from './components/device-transfer-complete';
import { DeviceTransferRejected } from './components/device-transfer-rejected';
import { DeviceTransferError } from './components/device-transfer-error';
import { DeviceTransferLoading } from './components/device-transfer-loading';
const I18N_KEYS = {
    DEVICE_TRANSFER_TITLE: 'webapp_device_transfer_page_title',
};
export const DeviceTransferContainer = () => {
    const { translate } = useTranslate();
    const deviceTransferFlowStatus = useModuleQuery(DeviceTransferContracts.deviceTransferApi, 'trustedDeviceFlowStatus');
    const getDeviceTransferComponent = () => {
        switch (deviceTransferFlowStatus.data?.step) {
            case DeviceTransferContracts.TrustedDeviceFlowStep
                .WaitingForNewDeviceRequest:
                return <DeviceTransferInstructions />;
            case DeviceTransferContracts.TrustedDeviceFlowStep
                .NewDeviceRequestAvailable:
                return (<DeviceTransferRequestPending {...deviceTransferFlowStatus.data}/>);
            case DeviceTransferContracts.TrustedDeviceFlowStep.LoadingChallenge:
                return <DeviceTransferLoading />;
            case DeviceTransferContracts.TrustedDeviceFlowStep
                .DisplayPassphraseChallenge:
                return (<DeviceTransferSecurityChallenge {...deviceTransferFlowStatus.data}/>);
            case DeviceTransferContracts.TrustedDeviceFlowStep.DeviceTransferComplete:
                return <DeviceTransferComplete {...deviceTransferFlowStatus.data}/>;
            case DeviceTransferContracts.TrustedDeviceFlowStep.DeviceTransferRejected:
                return <DeviceTransferRejected {...deviceTransferFlowStatus.data}/>;
            case DeviceTransferContracts.TrustedDeviceFlowStep.Error:
                return (<DeviceTransferError error={deviceTransferFlowStatus.data.errorCode}/>);
            default:
                return null;
        }
    };
    return (<div sx={{
            height: '100%',
            bg: 'ds.container.agnostic.neutral.quiet',
            paddingTop: '16px',
        }}>
      <FlexContainer>
        <Header startWidgets={() => (<FlexContainer flexDirection="column">
              <Heading as="h1" textStyle="ds.title.section.large">
                {translate(I18N_KEYS.DEVICE_TRANSFER_TITLE)}
              </Heading>
            </FlexContainer>)} endWidget={<>
              <HeaderAccountMenu />
              <NotificationsDropdown />
            </>}/>
        <FlexContainer sx={{
            width: '640px',
            maxWidth: '',
            flexDirection: 'column',
            bg: 'ds.container.agnostic.neutral.supershy',
            border: '1px solid transparent',
            borderColor: 'ds.border.neutral.quiet.idle',
            borderRadius: '8px',
            padding: '24px',
            margin: '16px 32px',
        }}>
          {getDeviceTransferComponent()}
        </FlexContainer>
      </FlexContainer>
    </div>);
};
