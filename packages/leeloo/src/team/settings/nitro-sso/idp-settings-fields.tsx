import { confidentialSSOApi } from '@dashlane/sso-scim-contracts';
import { Heading, Infobox, jsx, Paragraph } from '@dashlane/design-system';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { InputWithCopyButton } from 'libs/dashlane-style/text-input-with-action-button/input-with-copy-button.ds';
import { CreateMarkup } from './react-markdown-wrapper';
import useTranslate from 'libs/i18n/useTranslate';
type NestedList = {
    li: string;
    ol?: NestedList;
}[];
const I18N_INSTRUCTION_VALUES: NestedList = [
    { li: 'In a separate window, log in to your IdP account.' },
    {
        li: 'Find the section to create a new SSO application.',
        ol: [
            { li: 'Add the ID and URLs provided here to your application.' },
            {
                li: 'Add members who will log in to Dashlane with SSO to your application.',
            },
        ],
    },
];
const I18N_KEYS = {
    HEADING: 'sso_confidential_idp_setup_page_title',
    INFOBOX_MESSAGE: 'sso_confidential_idp_setup_infobox_message',
    ENTITY_ID_LABEL: 'sso_confidential_idp_setup_entity_id_label',
    ACS_URL_LABEL: 'sso_confidential_idp_setup_acs_url_label',
    SIGN_ON_URL_LABEL: 'sso_confidential_idp_setup_sign_on_url_label',
};
const NestedOrderedList = ({ content }: {
    content: NestedList;
}) => {
    return (<ol sx={{ color: 'ds.text.neutral.quiet' }}>
      {content.map(({ li, ol }, index) => (<Paragraph key={index} as="li" textStyle="ds.body.standard.regular">
          <CreateMarkup markdownValue={li}/>
          {ol ? <NestedOrderedList content={ol}/> : null}
        </Paragraph>))}
    </ol>);
};
export const IdPSettingsFields = () => {
    const { translate } = useTranslate();
    const state = useModuleQuery(confidentialSSOApi, 'ssoProvisioning');
    const isLoading = state.status === DataStatus.Loading;
    const formData = {
        entityId: state.data?.idpApplication.entityId ?? '',
        acsUrl: state.data?.idpApplication.acsUrl ?? '',
        signOnUrl: state.data?.idpApplication.signOnUrl ?? '',
    };
    return (<div sx={{
            display: 'grid',
            gridTemplateColumns: 'auto',
            gridAutoRows: 'auto',
            gap: '24px',
            marginBottom: '32px',
        }}>
      <div sx={{
            ol: {
                listStyleType: 'decimal',
                ml: '20px',
                ol: {
                    listStyleType: 'lower-alpha',
                },
            },
        }}>
        <Heading as="h2" textStyle="ds.title.section.medium" color="ds.text.neutral.standard" sx={{ mb: '8px' }}>
          {translate(I18N_KEYS.HEADING)}
        </Heading>
        <NestedOrderedList content={I18N_INSTRUCTION_VALUES}/>
      </div>
      <Infobox mood="brand" size="small" title={translate(I18N_KEYS.INFOBOX_MESSAGE)}/>
      <div sx={{
            display: 'grid',
            gridTemplateColumns: 'auto',
            gridAutoRows: 'auto',
            gap: '24px',
        }}>
        <InputWithCopyButton isLoading={isLoading} value={formData.entityId} label={translate(I18N_KEYS.ENTITY_ID_LABEL)} readOnly/>
        <InputWithCopyButton isLoading={isLoading} value={formData.acsUrl} label={translate(I18N_KEYS.ACS_URL_LABEL)} readOnly/>
        <InputWithCopyButton isLoading={isLoading} value={formData.signOnUrl} label={translate(I18N_KEYS.SIGN_ON_URL_LABEL)} readOnly/>
      </div>
    </div>);
};
