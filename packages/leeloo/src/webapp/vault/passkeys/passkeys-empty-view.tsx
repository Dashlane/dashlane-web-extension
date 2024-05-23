import { Heading, Icon, jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    EMPTY_PASSKEY: 'webapp_passkey_detail_no_passkey',
};
const PasskeysEmptyView = () => {
    const { translate } = useTranslate();
    return (<article sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'center',
            gap: '25px',
            alignItems: 'center',
        }}>
      <Icon name="PasskeyOutlined" sx={{ width: '75px', height: 'auto' }} color="ds.text.neutral.standard"/>
      <Heading as="h2" textStyle="ds.title.section.large" sx={{
            maxWidth: '480px',
            textAlign: 'center',
        }}>
        {translate(I18N_KEYS.EMPTY_PASSKEY)}
      </Heading>
    </article>);
};
export { PasskeysEmptyView };
