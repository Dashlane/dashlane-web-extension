import React, { useEffect } from 'react';
import { Button, Icon, IconProps, jsx } from '@dashlane/design-system';
import { FlexContainer, Heading, Paragraph } from '@dashlane/ui-components';
import { openDashlaneUrl } from 'libs/external-urls';
import useTranslate from 'libs/i18n/useTranslate';
import { useOneDeviceLimitReachedStage } from './use-one-device-limit-reached-stage';
import { UnlinkPreviousDeviceDialog } from './unlink-previous-device-dialog';
import { WrapperDeviceLimitFlow } from 'auth/device-limit-flow/wrapper-device-limit-flow';
import { confirmUnlinkPreviousDeviceLog, dismissUnlinkDeviceLog, logoutLogs, logPageViewPaywallDeviceSyncLimit, unlinkPreiousDeviceLog, } from 'auth/device-limit-flow/logs';
import { GET_CURRENT_FREE_PLAN_URL } from 'app/routes/constants';
import { PreviousDeviceInfo } from '@dashlane/communication';
const I18N_KEYS = {
    DESCRIPTION_UPGRADE: 'webapp_login_one_device_limit_description_upgrade',
    HEADER: 'webapp_login_one_device_limit_header',
    SEE_PREMIUM_PLAN: 'webapp_login_one_device_limit_see_premium_plan',
    UNLINK_PREVIOUS_DEVICE: 'webapp_login_one_device_limit_unlink_previous_device',
    HEADER_V2: 'webapp_login_one_device_limit_header_V2',
    FEATURE_COPY: 'webapp_login_one_device_limit_feature_copy_markup',
    FEATURE_UNLIMITED_DEVICES: 'webapp_login_one_device_limit_feature_unlimited_devices',
    FEATURE_DARK_WEB_MONITORING: 'webapp_login_one_device_limit_feature_dark_web_monitoring',
    FEATURE_VPN: 'webapp_login_one_device_limit_feature_vpn',
    NOT_READY: 'webapp_login_one_device_limit_not_ready',
    START_TRANSFER: 'webapp_login_one_device_limit_start_transfer',
};
export interface FeatureRowProps {
    iconName: IconProps['name'];
}
const FeatureRow: React.FC<FeatureRowProps> = ({ iconName, children }) => (<FlexContainer flexDirection="row" gap="12px" alignItems="center">
    <div sx={{
        padding: '8px',
        backgroundColor: 'ds.container.expressive.brand.quiet.idle',
        borderRadius: '8px',
    }}>
      <Icon name={iconName} size="large" color="ds.text.brand.standard"/>
    </div>
    <Paragraph size="large">{children}</Paragraph>
  </FlexContainer>);
export interface OneDeviceLimitProps {
    previousDevice: PreviousDeviceInfo;
}
const OneDeviceLimit = ({ previousDevice }: OneDeviceLimitProps) => {
    const { translate } = useTranslate();
    useEffect(() => {
        logPageViewPaywallDeviceSyncLimit();
    }, []);
    const [unlinkDialogShown, showUnlinkDialog] = React.useState(false);
    const stage = useOneDeviceLimitReachedStage();
    const handleShowUnlinkPreviousDeviceDialog = () => {
        showUnlinkDialog(true);
        unlinkPreiousDeviceLog();
    };
    const handleHideUnlinkPreviousDeviceDialog = () => {
        showUnlinkDialog(false);
        dismissUnlinkDeviceLog();
    };
    const handleLogOut = () => {
        stage?.logOut();
        logoutLogs();
    };
    const handleConfirmUnlinkDevice = () => {
        stage?.unlinkPreviousDevice();
        confirmUnlinkPreviousDeviceLog();
    };
    const handleGetUnlimitedAccess = () => {
        const trackingParams = {
            type: 'oneDeviceLimit',
            action: 'getUnlimitedAccess',
        };
        openDashlaneUrl(GET_CURRENT_FREE_PLAN_URL, trackingParams, {
            newTab: false,
        });
    };
    return (<React.Fragment>
      <WrapperDeviceLimitFlow handleLogOut={handleLogOut}>
        <FlexContainer as="main" flexDirection="column" flexWrap="nowrap" gap="40px" sx={{
            paddingTop: '60px',
            minHeight: '270px',
            maxWidth: '696px',
            minWidth: '429px',
        }}>
          <Heading caps={true} size="large">
            {translate(I18N_KEYS.HEADER_V2)}
          </Heading>
          <FlexContainer flexDirection="column" gap="24px">
            <Paragraph size="large">
              {translate.markup(I18N_KEYS.FEATURE_COPY)}
            </Paragraph>
            <FeatureRow iconName="FeatureAuthenticatorOutlined">
              {translate(I18N_KEYS.FEATURE_UNLIMITED_DEVICES)}
            </FeatureRow>
            <FeatureRow iconName="FeatureDarkWebMonitoringOutlined">
              {translate(I18N_KEYS.FEATURE_DARK_WEB_MONITORING)}
            </FeatureRow>
            <FeatureRow iconName="FeatureVpnOutlined">
              {translate(I18N_KEYS.FEATURE_VPN)}
            </FeatureRow>
            <Paragraph size="large">{translate(I18N_KEYS.NOT_READY)}</Paragraph>
          </FlexContainer>
          <FlexContainer flexDirection="row" flexWrap="nowrap" gap="16px">
            <Button mood="brand" onClick={handleGetUnlimitedAccess} size="large">
              {translate(I18N_KEYS.SEE_PREMIUM_PLAN)}
            </Button>
            <Button mood="neutral" intensity="quiet" onClick={handleShowUnlinkPreviousDeviceDialog} size="large">
              {translate(I18N_KEYS.START_TRANSFER)}
            </Button>
          </FlexContainer>
        </FlexContainer>
      </WrapperDeviceLimitFlow>
      <UnlinkPreviousDeviceDialog isOpen={unlinkDialogShown} handleOnCancel={handleHideUnlinkPreviousDeviceDialog} handleOnConfirm={handleConfirmUnlinkDevice} handleOnGetUnlimitedAccess={handleGetUnlimitedAccess} previousDeviceInfo={previousDevice}/>
    </React.Fragment>);
};
export { OneDeviceLimit };
