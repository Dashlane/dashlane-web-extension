import { Button, InfoBox, jsx } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    PASSWORD_HISTORY_INFOBOX_TITLE: 'webapp_password_history_dismissable_infobox_title',
    PASSWORD_HISTORY_INFOBOX_CONTENT: 'webapp_password_history_dismissable_infobox_content',
    PASSWORD_HISTORY_INFOBOX_BUTTON: 'webapp_password_history_dismissable_infobox_button',
};
interface Props {
    setAsInteracted: () => Promise<void>;
}
export const PasswordHistoryInfobox = ({ setAsInteracted }: Props) => {
    const { translate } = useTranslate();
    return (<InfoBox title={translate(I18N_KEYS.PASSWORD_HISTORY_INFOBOX_TITLE)} severity="subtle" size="descriptive" layout="inline" actions={[
            <Button type="button" nature="primary" key="primary" onClick={setAsInteracted}>
          {translate(I18N_KEYS.PASSWORD_HISTORY_INFOBOX_BUTTON)}
        </Button>,
        ]} sx={{
            margin: '0px 32px 16px 32px',
        }}>
      {translate(I18N_KEYS.PASSWORD_HISTORY_INFOBOX_CONTENT)}
    </InfoBox>);
};
