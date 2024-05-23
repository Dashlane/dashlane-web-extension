import { Heading, jsx, Paragraph } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { LEARN_DARK_WEB_INSIGHTS_LINK, VIEW_DOMAIN_VERIFICATION_GUIDE_LINK, } from '../dark_web_insights_urls';
import { HelpCenterArticleCta, UserOpenHelpCenterEvent, } from '@dashlane/hermes';
import { InfoCard } from 'team/settings/components/layout/info-card';
import { logEvent } from 'libs/logs/logEvent';
import { ExternalLink } from 'team/settings/components/layout/link-card';
const I18N_KEYS = {
    NEED_HELP: 'team_breach_report_need_help',
    NEED_HELP_DESCRIPTION: 'team_dark_web_insights_need_help_description',
    LEARN_DARK_WEB_INSIGHTS_TXT: 'team_dark_web_insights_learn_more_txt',
    LEARN_DOMAIN_VERIFICATION_TXT: 'team_breach_report_learn_domain_verification_txt',
};
export const HelpMenu = () => {
    const { translate } = useTranslate();
    return (<div>
      <InfoCard>
        <Heading as="h3" textStyle="ds.title.block.medium">
          {translate(I18N_KEYS.NEED_HELP)}
        </Heading>
        <Paragraph textStyle="ds.body.standard.regular" color="ds.text.neutral.quiet">
          {translate(I18N_KEYS.NEED_HELP_DESCRIPTION)}
        </Paragraph>

        <ExternalLink href={LEARN_DARK_WEB_INSIGHTS_LINK} onClick={() => {
            logEvent(new UserOpenHelpCenterEvent({
                helpCenterArticleCta: HelpCenterArticleCta.LearnAboutDarkWebInsights,
            }));
        }}>
          {translate(I18N_KEYS.LEARN_DARK_WEB_INSIGHTS_TXT)}
        </ExternalLink>
        <ExternalLink href={VIEW_DOMAIN_VERIFICATION_GUIDE_LINK} onClick={() => {
            logEvent(new UserOpenHelpCenterEvent({
                helpCenterArticleCta: HelpCenterArticleCta.LearnAboutDomainVerification,
            }));
        }}>
          {translate(I18N_KEYS.LEARN_DOMAIN_VERIFICATION_TXT)}
        </ExternalLink>
      </InfoCard>
    </div>);
};
