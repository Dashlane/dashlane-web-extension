import { jsx } from '@dashlane/design-system';
import { Button, ClickOrigin, PageView, UserClickEvent, } from '@dashlane/hermes';
import { logEvent, logPageView } from 'libs/logs/logEvent';
import { ResponsiveMainSecondaryLayout } from 'team/settings/components/layout/responsive-main-secondary-layout';
import { LinkCard, LinkType } from 'team/settings/components/layout/link-card';
import { SetupConfidentialScim } from './setup-confidential-scim';
import useTranslate from 'libs/i18n/useTranslate';
import { BackPageLayout } from '../../components/layout/back-page-layout';
import { useEffect } from 'react';
const I18N_KEYS = {
    HEADER: 'tac_settings_confidential_scim_header',
    HEADER_HELPER: 'tac_settings_confidential_scim_header_helper',
    HELP_CARD_HEADER: 'tac_settings_confidential_scim_help_card_header',
    HELP_CARD_DESCRIPTION: 'tac_settings_confidential_scim_help_card_description',
    HELP_CARD_LINK: 'tac_settings_confidential_scim_help_card_link',
};
export const ConfidentialSCIM = () => {
    const { translate } = useTranslate();
    useEffect(() => {
        logPageView(PageView.TacSettingsDirectorySyncConfidentialScim);
    }, []);
    return (<BackPageLayout title={translate(I18N_KEYS.HEADER)} paragraph={translate(I18N_KEYS.HEADER_HELPER)}>
      {<ResponsiveMainSecondaryLayout sx={{ padding: '0 32px' }} fullWidth mainContent={SetupConfidentialScim} secondaryContent={LinkCard} secondaryProps={{
                heading: translate(I18N_KEYS.HELP_CARD_HEADER),
                description: translate(I18N_KEYS.HELP_CARD_DESCRIPTION),
                linkProps: {
                    linkType: LinkType.ExternalLink,
                    linkHref: '*****',
                    onClick: () => {
                        logEvent(new UserClickEvent({
                            button: Button.SeeSetupGuide,
                            clickOrigin: ClickOrigin.NeedHelp,
                        }));
                    },
                },
                linkText: translate(I18N_KEYS.HELP_CARD_LINK),
            }}/>}
    </BackPageLayout>);
};
