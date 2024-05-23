import { Fragment, useState } from 'react';
import { confidentialSSOApi } from '@dashlane/sso-scim-contracts';
import { useFeatureFlip, useModuleCommands } from '@dashlane/framework-react';
import { FlexContainer, jsx } from '@dashlane/ui-components';
import { Button, Dialog, Heading, Icon, Paragraph, } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
const ERROR_MATCH_KEYS = {
    CouldNotGetTeamStatus: 'COULD_NOT_GET_TEAM_STATUS',
    TeamIdNotFound: 'TEAM_ID_NOT_FOUND',
    UserNotAuthorized: 'USER_NOT_AUTHORIZED',
    InvalidSsoState: 'INVALID_SSO_STATE',
    GenericSsoError: 'GENERIC_SSO_ERROR',
};
const I18N_KEYS = {
    ERROR_HEADER: 'team_settings_sso_error_header',
    RETRY: 'team_settings_sso_error_button_retry',
    RESET: 'team_settings_sso_error_button_reset',
    RETRY_MODAL_TITLE: 'team_settings_sso_error_retry_modal_title',
    RETRY_MODAL_BODY: 'team_settings_sso_error_retry_modal_body',
    RETRY_MODAL_CANCEL: 'team_settings_sso_error_retry_modal_button_cancel',
    RETRY_MODAL_CONFIRM: 'team_settings_sso_error_retry_modal_button_confirm',
    COULD_NOT_GET_TEAM_STATUS: 'team_settings_sso_error_message_team_status',
    TEAM_ID_NOT_FOUND: 'team_settings_sso_error_message_team_id',
    USER_NOT_AUTHORIZED: 'team_settings_sso_error_message_not_authorized',
    INVALID_SSO_STATE: 'team_settings_sso_error_message_invalid_sso_state',
    GENERIC_SSO_ERROR: 'team_settings_sso_error_message_generic',
};
interface ContentErrorProps {
    errorTag: string;
    onReloadData: () => void;
}
export const ContentError = ({ onReloadData, errorTag }: ContentErrorProps) => {
    const { translate } = useTranslate();
    const { clearSettings } = useModuleCommands(confidentialSSOApi);
    const resetButtonFF = useFeatureFlip('setup_rollout_reset_confidential_button');
    const [isModalOpened, setModalOpened] = useState(false);
    const [isClearingSettings, setClearingSettings] = useState(false);
    const onClearSsoSettings = async () => {
        setModalOpened(false);
        setClearingSettings(true);
        await clearSettings();
        onReloadData();
    };
    return (<FlexContainer alignItems="center" justifyContent="center" fullWidth gap="40px" sx={{ mt: '20vh', flexDirection: 'column' }}>
      <Icon name="FeedbackFailOutlined" color="ds.text.danger.quiet" sx={{ height: '64px', width: '64px' }}/>
      <FlexContainer alignItems="center" flexDirection="column" gap="8px">
        <Heading textStyle="ds.title.section.large" as="h1">
          {translate(I18N_KEYS.ERROR_HEADER)}
        </Heading>
        <Paragraph>
          {translate(I18N_KEYS[ERROR_MATCH_KEYS[errorTag]])}
        </Paragraph>
      </FlexContainer>
      <FlexContainer gap="16px">
        {resetButtonFF ? (<>
            <Button mood="neutral" intensity="quiet" onClick={() => setModalOpened(true)} isLoading={isClearingSettings}>
              {translate(I18N_KEYS.RESET)}
            </Button>
            <Dialog actions={{
                primary: {
                    children: translate(I18N_KEYS.RETRY_MODAL_CONFIRM),
                    onClick: onClearSsoSettings,
                },
                secondary: {
                    children: translate(I18N_KEYS.RETRY_MODAL_CANCEL),
                    onClick: () => setModalOpened(false),
                },
            }} closeActionLabel="Close" onClose={() => setModalOpened(false)} title={translate(I18N_KEYS.RETRY_MODAL_TITLE)} isOpen={isModalOpened} isDestructive={true}>
              <Paragraph>{translate(I18N_KEYS.RETRY_MODAL_BODY)}</Paragraph>
            </Dialog>
          </>) : null}
        <Button mood="brand" intensity="catchy" onClick={onReloadData} disabled={isClearingSettings}>
          {translate(I18N_KEYS.RETRY)}
        </Button>
      </FlexContainer>
    </FlexContainer>);
};
