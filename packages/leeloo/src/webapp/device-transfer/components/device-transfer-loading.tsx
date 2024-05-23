import { FlexContainer } from '@dashlane/ui-components';
import { IndeterminateLoader, jsx, Paragraph } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
export const I18N_KEYS = {
    LOADING_CHALLENGE: 'webapp_device_to_device_authentication_loading_challenge',
};
export const DeviceTransferLoading = () => {
    const { translate } = useTranslate();
    return (<FlexContainer flexDirection="column" alignItems="center">
      <IndeterminateLoader mood="brand" size={77}/>
      <Paragraph sx={{
            textAlign: 'center',
            margin: '32px 0',
        }}>
        {translate(I18N_KEYS.LOADING_CHALLENGE)}
      </Paragraph>
    </FlexContainer>);
};
