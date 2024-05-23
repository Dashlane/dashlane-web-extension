import React from 'react';
import { Button, FlexContainer, Heading, jsx, Paragraph, } from '@dashlane/ui-components';
import { UnlinkMultipleDevicesDialog } from 'auth/multiple-devices-limit/unlink-multiple-devices-dialog';
import { useMultipleDevicesLimitReachedStage } from 'auth/multiple-devices-limit/use-multiple-devices-limit-reached-stage';
import { WrapperDeviceLimitFlow } from 'auth/device-limit-flow/wrapper-device-limit-flow';
import { confirmUnlinkPreviousDeviceLog, dismissUnlinkDeviceLog, logoutLogs, logPageViewPaywallDeviceSyncLimit, unlinkPreiousDeviceLog, upgradePremiumLog, } from 'auth/device-limit-flow/logs';
import useTranslate from 'libs/i18n/useTranslate';
import { DeviceToDeactivateInfoView, UnlinkMultipleDevicesRequest, } from '@dashlane/communication';
const I18N_KEYS = {
    DESCRIPTION_UPGRADE: 'webapp_login_multiple_devices_limit_description_upgrade',
    HEADER: 'webapp_login_multiple_devices_limit_header',
    SEE_PREMIUM_PLAN: 'webapp_login_multiple_devices_limit_see_premium_plan',
    UNLINK_PREVIOUS_DEVICES: 'webapp_login_multiple_devices_limit_unlink_previous_devices',
};
interface MultipleDevicesLimitProps {
    subscriptionCode: string;
    devicesToDeactivate: DeviceToDeactivateInfoView[];
    wasRefreshed: boolean;
}
export const MultipleDevicesLimit = ({ devicesToDeactivate, subscriptionCode, wasRefreshed, }: MultipleDevicesLimitProps) => {
    const { translate } = useTranslate();
    const stage = useMultipleDevicesLimitReachedStage();
    const onHandleGoToPremiumPlan = () => stage.onHandleGoToPremiumPlan(subscriptionCode);
    const handleLogOut = () => {
        stage?.logOut();
        logoutLogs();
    };
    React.useEffect(() => {
        if (!wasRefreshed) {
            logPageViewPaywallDeviceSyncLimit();
        }
    }, [wasRefreshed]);
    const [displayUnlinkDialog, setDisplayUnlinkDialog] = React.useState(false);
    const handleShowUnlinkDialog = () => {
        setDisplayUnlinkDialog(true);
        unlinkPreiousDeviceLog();
    };
    const handleHideUnlinkDialog = () => {
        setDisplayUnlinkDialog(false);
        dismissUnlinkDeviceLog();
    };
    const handleConfirmUnlinkDevices = async (params: UnlinkMultipleDevicesRequest) => {
        await stage?.unlinkMultipleDevices(params);
        confirmUnlinkPreviousDeviceLog();
    };
    return (<React.Fragment>
      <WrapperDeviceLimitFlow handleLogOut={handleLogOut}>
        <FlexContainer as="main" flexDirection="column" justifyContent="flex-end" flexWrap="nowrap" sx={{
            maxHeight: 'min(50vh, 400px)',
            minHeight: '270px',
            maxWidth: '589px',
            minWidth: '429px',
        }}>
          <Heading caps={true} size="large" sx={{
            marginBottom: '43px',
        }}>
            {translate(I18N_KEYS.HEADER)}
          </Heading>
          <Paragraph size="large">
            {translate(I18N_KEYS.DESCRIPTION_UPGRADE)}
          </Paragraph>
          <FlexContainer flexDirection="row" flexWrap="nowrap" sx={{
            marginTop: '32px',
        }}>
            <Button nature="primary" onClick={() => {
            onHandleGoToPremiumPlan();
            upgradePremiumLog();
        }} size="large" type="button">
              {translate(I18N_KEYS.SEE_PREMIUM_PLAN)}
            </Button>
            <Button nature="ghost" onClick={handleShowUnlinkDialog} size="large" type="button">
              {translate(I18N_KEYS.UNLINK_PREVIOUS_DEVICES)}
            </Button>
          </FlexContainer>
        </FlexContainer>
      </WrapperDeviceLimitFlow>
      <UnlinkMultipleDevicesDialog isOpen={displayUnlinkDialog} handleOnCancel={handleHideUnlinkDialog} onHandleGoToPremiumPlan={onHandleGoToPremiumPlan} handleOnConfirm={handleConfirmUnlinkDevices} devicesToDeactivate={devicesToDeactivate}/>
    </React.Fragment>);
};
