import { Fragment, useEffect } from 'react';
import { colors, LoadingIcon, ThemeUIStyleObject, } from '@dashlane/ui-components';
import { Heading, jsx } from '@dashlane/design-system';
import { PageView } from '@dashlane/hermes';
import { Lee } from 'lee';
import { logPageView } from 'libs/logs/logEvent';
import { HelpMenu } from 'team/dark-web-insights/help-menu/help-menu';
import useTranslate from 'libs/i18n/useTranslate';
import { DomainVerificationStatus, useDomainVerification, } from 'team/helpers/use-domain-verification';
import { VerifyDomainStart } from './verify-domain/verify-domain-start';
import { DWIReport } from './report/dwi-report';
import { VerifyDomainPending } from './verify-domain/verify-domain-pending';
import { DomainLabels } from './domain-labels';
import { ResponsiveMainSecondaryLayout } from 'team/settings/components/layout/responsive-main-secondary-layout';
const I18N_KEYS = {
    DARK_WEB_INSIGHTS_TITLE: 'team_dashboard_dark_web_insights_heading',
    SCANNING_INCIDENTS_TXT: 'team_dark_web_insights_scanning_incidents_txt',
    PAGINATION_PAGE_SIZE: 'team_dark_web_insights_table_pagination_page_size',
    LOADING_REPORTS_GENERATION_MSG: 'team_dashboard_dark_web_insights_generating_msg',
    ERROR_MSG: 'team_dark_web_insights_generic_error',
};
interface Props {
    lee: Lee;
}
const loadingContainerStyles: ThemeUIStyleObject = {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: `${colors.dashGreen06}`,
    alignItems: 'center',
};
export const DarkWebInsights = ({ lee }: Props) => {
    const { translate } = useTranslate();
    const { verifiedOrPendingDomain: { domain: activeDomain, status: verificationStatus, }, verifiedDomains, updateDomainState, deactivateDomain, tryVerifyDomain, selectVerifiedDomain, } = useDomainVerification();
    useEffect(() => {
        logPageView(PageView.TacDarkWebInsights);
    }, []);
    return (<>
      <div sx={{ px: '48px', pt: '32px', pb: '12px' }}>
        <Heading as="h1">
          {translate(I18N_KEYS.DARK_WEB_INSIGHTS_TITLE)}
        </Heading>
        <DomainLabels activeDomain={activeDomain} verifiedDomains={verifiedDomains} selectVerifiedDomain={selectVerifiedDomain}/>
      </div>
      <ResponsiveMainSecondaryLayout fullWidth mainContent={() => (<div>
            {verificationStatus === DomainVerificationStatus.Loading ? (<div sx={loadingContainerStyles}>
                <LoadingIcon size={120} color={colors.dashGreen00} strokeWidth={1}/>
              </div>) : activeDomain === null ||
                verificationStatus === DomainVerificationStatus.Start ? (<VerifyDomainStart onSuccess={updateDomainState} onError={updateDomainState}/>) : verificationStatus === DomainVerificationStatus.Validated ? (<DWIReport lee={lee} domainName={activeDomain.name}/>) : (<VerifyDomainPending domain={activeDomain} isDeactivating={verificationStatus === DomainVerificationStatus.Deactivating} handleDeactivateDomain={deactivateDomain} handleRetryValidateDomain={tryVerifyDomain}/>)}
          </div>)} secondaryContent={HelpMenu}/>
    </>);
};
