import { Fragment, useState } from 'react';
import { Heading, jsx, Paragraph, TextField } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent } from 'libs/logs/logEvent';
import { ScimSetupStep, UserSetupConfidentialScimEvent, } from '@dashlane/hermes';
const I18N_KEYS = {
    HEADER: 'tac_settings_confidential_scim_copy_token_header',
    HEADER_HELPER: 'tac_settings_confidential_scim_copy_token_header_helper',
    TOKEN_LABEL: 'tac_settings_confidential_scim_copy_token_field_token_label',
    ENDPOINT_LABEL: 'tac_settings_confidential_scim_copy_token_field_endpoint_label',
};
interface CopyTokenProps {
    scimApiToken?: string | null;
    scimEndpoint?: string | null;
}
export const CopyToken = ({ scimApiToken, scimEndpoint }: CopyTokenProps) => {
    const { translate } = useTranslate();
    const [isScimApiTokenVisible, setScimApiTokenVisibility] = useState(false);
    const onCopyValue = async (value?: string) => {
        if (value) {
            await navigator.clipboard.writeText(value);
        }
    };
    return (<>
      <Heading as="h2" textStyle="ds.title.section.medium" sx={{ marginBottom: '8px' }}>
        {translate(I18N_KEYS.HEADER)}
      </Heading>
      <Paragraph color="ds.text.neutral.quiet" sx={{ marginBottom: '24px' }}>
        {translate(I18N_KEYS.HEADER_HELPER)}
      </Paragraph>
      <TextField label={translate(I18N_KEYS.TOKEN_LABEL)} type={isScimApiTokenVisible ? 'text' : 'password'} value={scimApiToken ?? ''} disabled={!scimApiToken} readOnly={!!scimApiToken} sx={{ marginBottom: '16px' }} actions={[
            {
                iconName: 'ActionRevealOutlined',
                key: 'copy-token',
                label: '',
                onClick: () => setScimApiTokenVisibility(!isScimApiTokenVisible),
            },
            {
                iconName: 'ActionCopyOutlined',
                key: 'view-token',
                label: '',
                onClick: () => {
                    onCopyValue(scimApiToken ?? '');
                    logEvent(new UserSetupConfidentialScimEvent({
                        scimSetupStep: ScimSetupStep.CopyApiToken,
                    }));
                },
            },
        ]}/>
      <TextField value={scimEndpoint ?? ''} label={translate(I18N_KEYS.ENDPOINT_LABEL)} disabled={!scimEndpoint} readOnly={!!scimEndpoint} actions={[
            {
                iconName: 'ActionCopyOutlined',
                key: 'copy-endpoint',
                label: '',
                onClick: () => {
                    onCopyValue(scimEndpoint ?? '');
                    logEvent(new UserSetupConfidentialScimEvent({
                        scimSetupStep: ScimSetupStep.CopyEndpointLink,
                    }));
                },
            },
        ]}/>
    </>);
};
