import { memo } from 'react';
import { Button, Infobox, jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { openWebAppAndClosePopup } from 'src/app/helpers';
const I18N_KEYS = {
    TITLE: 'embed_alert_weak_master_password_title',
    DESCRIPTION: 'embed_alert_weak_master_password_description_markup',
    SKIP_NOW: 'embed_alert_weak_master_password_dismiss',
    OPEN_SETTINGS: 'embed_alert_weak_master_password_action_open_settings',
};
interface MasterPasswordWeakAlertProps {
    onDismiss: () => void;
}
export const MasterPasswordWeakAlert = ({ onDismiss, }: MasterPasswordWeakAlertProps) => {
    const { translate, translateMarkup } = useTranslate();
    const onSettingsClick = () => {
        void openWebAppAndClosePopup({
            route: '/security-settings',
        });
    };
    return (<Infobox title={translate(I18N_KEYS.TITLE)} description={translateMarkup(I18N_KEYS.DESCRIPTION)} mood="danger" size="large" sx={{
            margin: '0 16px',
        }} actions={[
            <Button key="blog-link" mood="danger" intensity="quiet" onClick={onDismiss} size="small">
          {translate(I18N_KEYS.SKIP_NOW)}
        </Button>,
            <Button key="setting-link" mood="danger" onClick={onSettingsClick} size="small">
          {translate(I18N_KEYS.OPEN_SETTINGS)}
        </Button>,
        ]}/>);
};
