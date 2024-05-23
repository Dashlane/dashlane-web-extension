import { InfoBox, jsx } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { HELPCENTER_CANNOT_LOGIN_SECURITY_CODE_URL } from 'app/routes/constants';
const I18N_KEYS = {
    SYNC_DEVICES_INFOBOX: 'webapp_two_factor_authentication_sync_devices_time_infobox_markup',
};
export const SyncDevicesTimeInfoBox = () => {
    const { translate } = useTranslate();
    const supportArticle = translate.markup(I18N_KEYS.SYNC_DEVICES_INFOBOX, {
        supportArticleLink: HELPCENTER_CANNOT_LOGIN_SECURITY_CODE_URL,
    }, { linkTarget: '_blank' });
    return (<InfoBox sx={{ marginTop: '16px' }} severity="subtle" size="small" title={supportArticle}/>);
};
