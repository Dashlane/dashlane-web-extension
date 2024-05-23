import { jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { LinkCard, LinkType } from 'team/settings/components/layout/link-card';
const I18N_KEYS = {
    CONTACT_SUPPORT_HEADER: 'team_settings_contact_us_support_header',
    CONTACT_HEADING: 'team_settings_contact_us_heading',
    CONTACT_DESCRIPTION: 'team_settings_contact_us_description',
    CONTACT_LINK_TITLE: 'team_settings_contact_us_link_title',
};
export const ContactUsSideContent = (openContactDialog: () => void) => {
    const { translate } = useTranslate();
    return (<LinkCard supportHeading={translate(I18N_KEYS.CONTACT_SUPPORT_HEADER)} heading={translate(I18N_KEYS.CONTACT_HEADING)} description={translate(I18N_KEYS.CONTACT_DESCRIPTION)} linkText={translate(I18N_KEYS.CONTACT_LINK_TITLE)} linkProps={{
            linkType: LinkType.InternalLink,
            internalAction: openContactDialog,
        }}/>);
};
