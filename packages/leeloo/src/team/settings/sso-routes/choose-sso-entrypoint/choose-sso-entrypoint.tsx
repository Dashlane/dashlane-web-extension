import { useEffect } from 'react';
import { jsx } from '@dashlane/design-system';
import { DataStatus, useFeatureFlip, useModuleQuery, } from '@dashlane/framework-react';
import { confidentialSSOApi, InferredSsoState, scimApi, } from '@dashlane/sso-scim-contracts';
import { GridContainer } from '@dashlane/ui-components';
import { SsoSetupStep } from '@dashlane/hermes';
import { redirect, useRouteMatch } from 'libs/router';
import { useTeamBillingInformation } from 'libs/hooks/use-team-billing-information';
import { TabMenu } from 'team/page/tab-menu/tab-menu';
import { ResponsiveMainSecondaryLayout } from 'team/settings/components/layout/responsive-main-secondary-layout';
import { logNitroSSOSetupStep, logSelfHostedSSOSetupStep, logSSOLandingPageView, } from 'team/settings/sso-setup-logs';
import { TeamSettingsSsoRoutes } from '../sso-routes';
import { NitroBadge } from './nitro-badge';
import { SideContent } from './side-content';
import { SSOOptionCard } from './sso-option-card';
import { PageContext, SsoInfobox } from '../../scim-sso-infoboxes/sso-infobox';
import { getConfidentialSSOValues, I18N_VALUES, SELF_HOSTED_SSO_VALUES, } from './text-content';
import { ResetButton } from '../reset-button';
const MainContent = () => {
    const { path } = useRouteMatch();
    const teamBillingInfo = useTeamBillingInformation();
    const resetButtonFF = useFeatureFlip('setup_rollout_reset_confidential_button');
    const nitroState = useModuleQuery(confidentialSSOApi, 'ssoProvisioning');
    const confidentialScim = useModuleQuery(scimApi, 'scimConfiguration');
    useEffect(() => {
        logSSOLandingPageView();
    }, []);
    const confidentialSSOValues = getConfidentialSSOValues();
    if (nitroState.status !== DataStatus.Success ||
        confidentialScim.status !== DataStatus.Success ||
        !teamBillingInfo) {
        return null;
    }
    const { inferredSsoState: ssoSetupState, ssoCapable } = nitroState.data.global;
    const ctasDisabled = !ssoCapable || ssoSetupState === InferredSsoState.enum.Unknown;
    const selfHostedCtaClicked = () => {
        logSelfHostedSSOSetupStep({
            currentBillingPlanTier: teamBillingInfo.spaceTier,
            ssoSetupStep: SsoSetupStep.ChooseYourSsoSolution,
        });
        redirect(`${path}${TeamSettingsSsoRoutes.SELF_HOSTED_SSO}`);
    };
    const nitroCtaClicked = () => {
        logNitroSSOSetupStep({
            currentBillingPlanTier: teamBillingInfo.spaceTier,
            ssoSetupStep: SsoSetupStep.ChooseYourSsoSolution,
        });
        redirect(`${path}${TeamSettingsSsoRoutes.CONFIDENTIAL_SSO}`);
    };
    return (<GridContainer gap="32px" alignContent="start">
      <SsoInfobox pageContext={PageContext.ChooseSso}/>
      
      <GridContainer gap="32px" gridTemplateColumns="1fr 1fr">
        <SSOOptionCard title={SELF_HOSTED_SSO_VALUES.TITLE} infoList={SELF_HOSTED_SSO_VALUES.INFO_LIST} ctaText={ssoSetupState === InferredSsoState.enum.SelfHostedIncomplete
            ? SELF_HOSTED_SSO_VALUES.CONTINUE_CTA
            : SELF_HOSTED_SSO_VALUES.CTA} ctaAction={selfHostedCtaClicked} ctaMuted={ssoSetupState === InferredSsoState.enum.NitroIncomplete} ctaDisabled={ctasDisabled ||
            ssoSetupState === InferredSsoState.enum.NitroComplete ||
            !!confidentialScim.data.token}/>
        <SSOOptionCard title={confidentialSSOValues.TITLE} badge={<NitroBadge nitroStateStatus={nitroState.status} nitroState={nitroState.data}/>} infoList={confidentialSSOValues.INFO_LIST} ctaText={ssoSetupState === InferredSsoState.enum.NitroIncomplete
            ? confidentialSSOValues.CONTINUE_CTA
            : confidentialSSOValues.CTA} ctaAction={nitroCtaClicked} ctaMuted={ssoSetupState === InferredSsoState.enum.SelfHostedIncomplete} ctaDisabled={ctasDisabled ||
            ssoSetupState === InferredSsoState.enum.SelfHostedComplete}/>
      </GridContainer>

      {resetButtonFF ? <ResetButton /> : null}
    </GridContainer>);
};
export const ChooseSsoEntrypoint = () => {
    return (<GridContainer gridTemplateColumns="auto" gridTemplateRows="auto 1fr" alignItems="start" fullWidth>
      <div sx={{ px: '48px', pt: '32px', pb: '4px' }}>
        
        
        <TabMenu title={I18N_VALUES.PAGE_TITLE}/>
      </div>
      <ResponsiveMainSecondaryLayout mainContent={MainContent} secondaryContent={SideContent} sx={{ bg: 'ds.container.agnostic.neutral.quiet', pt: '0px' }}/>
    </GridContainer>);
};
