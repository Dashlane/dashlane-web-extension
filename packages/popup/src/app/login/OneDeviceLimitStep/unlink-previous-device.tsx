import * as React from 'react';
import { fromUnixTime } from 'date-fns';
import { Button } from '@dashlane/design-system';
import { AndroidIcon, AppleIcon, BackIcon, FlexChild, FlexContainer, Heading, jsx, Link, Paragraph, WebIcon, WindowsIcon, } from '@dashlane/ui-components';
import { PreviousDeviceInfo as PreviousDeviceInfoData } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import { LocalizedTimeAgo } from 'src/components/localized-time-ago/localized-time-ago';
import { openExternalUrl, PRICING_PAGE_URL } from 'src/libs/externalUrls';
import { getUrlGivenQuery } from 'src/libs/getUrlGivenQuery';
const I18N_KEYS = {
    CANCEL: 'login/unlink_previous_device_cancel',
    DESCRIPTION: 'login/unlink_previous_device_text',
    DEVICE_INFO_LAST_ACTIVE: 'login/unlink_previous_device_last_active',
    TITLE: 'login/unlink_previous_device_title',
    UNLINK: 'login/unlink_previous_device_unlink',
    TITLE_V2: 'login/unlink_previous_device_title_v2',
    DESCRIPTION_V2: 'login/unlink_previous_device_text_v2',
    CONFIRM_AND_UNLINK: 'login/unlink_previous_device_confirm_and_unlink',
    GET_UNLIMITED: 'login/unlink_previous_device_get_unlimited',
};
interface UnlinkPreviousDeviceStepProps {
    previousDeviceInfo: PreviousDeviceInfoData | undefined;
    onCancel: () => void;
    onUnlinkPreviousDevice: () => void;
}
const PreviousDeviceDetails = ({ name, lastActive, }: PreviousDeviceInfoData) => {
    return (<FlexContainer flexDirection="column">
      <Paragraph as="span" size="medium" color={'ds.text.neutral.catchy'}>
        {name}
      </Paragraph>
      <Paragraph size="x-small" color={'ds.text.neutral.quiet'}>
        <LocalizedTimeAgo date={fromUnixTime(lastActive)} i18n={{
            key: I18N_KEYS.DEVICE_INFO_LAST_ACTIVE,
            param: 'timeAgo',
        }}/>
      </Paragraph>
    </FlexContainer>);
};
const PreviousDeviceIcon = ({ platform }: PreviousDeviceInfoData) => {
    switch (platform) {
        case 'android':
            return <AndroidIcon aria-hidden={true} viewBox="0 0 24 30"/>;
        case 'windows':
            return <WindowsIcon aria-hidden={true} viewBox="0 0 28 28"/>;
        case 'macosx':
        case 'iphone':
        case 'ipad':
        case 'ipod':
            return <AppleIcon aria-hidden={true} viewBox="0 0 25 30"/>;
        case 'saex':
        case 'tac':
        case 'webapp':
        case 'other':
        default:
            return <WebIcon aria-hidden={true} viewBox="0 0 20 20"/>;
    }
};
const PreviousDeviceInfo = (previousDeviceInfo: PreviousDeviceInfoData) => {
    return (<FlexContainer flexDirection="row" alignItems="center" sx={{
            margin: '0 13px',
            height: '60px',
            borderTop: '1px solid',
            borderBottom: '1px solid',
            borderColor: 'ds.border.neutral.quiet.idle',
        }}>
      <div sx={{
            margin: '0 18px 0 26px',
            height: '24px',
            width: '24px',
        }}>
        <PreviousDeviceIcon {...previousDeviceInfo}/>
      </div>
      <PreviousDeviceDetails {...previousDeviceInfo}/>
    </FlexContainer>);
};
const UnlinkPreviousDeviceStep = ({ previousDeviceInfo, onUnlinkPreviousDevice, onCancel, }: UnlinkPreviousDeviceStepProps) => {
    const { translate } = useTranslate();
    const onGetUnlimited = (): void => {
        void openExternalUrl(getUrlGivenQuery(PRICING_PAGE_URL, {
            page: 'personal',
            currentPlan: 'free',
            variant: 'devices',
        }));
    };
    return (<FlexContainer alignItems="stretch" flexDirection="column" justifyContent="space-between" sx={{
            backgroundColor: 'ds.background.default',
            height: '100%',
            padding: '24px',
        }}>
      <Link onClick={onCancel}>
        <BackIcon size={20} color={'ds.text.brand.standard'}/>
      </Link>
      <Heading size="small" sx={{
            color: 'ds.text.neutral.catchy',
            padding: '0 6px',
            textAlign: 'center',
            marginTop: '75px',
            marginBottom: '32px',
            maxHeight: '56px',
        }}>
        {translate(I18N_KEYS.TITLE_V2, {
            deviceName: previousDeviceInfo?.name,
        })}
      </Heading>
      {previousDeviceInfo ? (<PreviousDeviceInfo {...previousDeviceInfo}/>) : null}
      <FlexChild as={Paragraph} flex="1" size="large" sx={{
            padding: '0 6px',
            color: 'ds.text.neutral.quiet',
            textAlign: 'center',
            marginTop: '33px',
            marginBottom: '36px',
        }}>
        {translate(I18N_KEYS.DESCRIPTION_V2)}
      </FlexChild>
      <Button fullsize mood="brand" size="large" onClick={onUnlinkPreviousDevice} sx={{
            marginBottom: '8px',
        }}>
        {translate(I18N_KEYS.CONFIRM_AND_UNLINK)}
      </Button>
      <Button fullsize onClick={onGetUnlimited} mood="brand" intensity="quiet" size="large">
        {translate(I18N_KEYS.GET_UNLIMITED)}
      </Button>
    </FlexContainer>);
};
export default React.memo(UnlinkPreviousDeviceStep);
