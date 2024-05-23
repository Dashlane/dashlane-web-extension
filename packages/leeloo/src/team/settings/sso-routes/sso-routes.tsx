import { confidentialSSOApi, InferredSsoState, } from '@dashlane/sso-scim-contracts';
import { DataStatus, useModuleCommands, useModuleQuery, } from '@dashlane/framework-react';
import { isFailure } from '@dashlane/framework-types';
import { GridContainer, jsx } from '@dashlane/ui-components';
import { SpaceTier } from '@dashlane/team-admin-contracts';
import { Lee } from 'lee';
import { Redirect, Route, Switch, useRouteMatch } from 'libs/router';
import { useCallback, useEffect, useState } from 'react';
import { useTeamSpaceContext } from '../components/TeamSpaceContext';
import { NitroSSO } from '../nitro-sso/nitro-sso';
import { SsoWithEncryptionService } from '../sso-with-encryption-service/SsoWithEncryptionService';
import { SSOSettings } from '../sso/sso-settings';
import { ChooseSsoEntrypoint } from './choose-sso-entrypoint/choose-sso-entrypoint';
import { useEncryptionServiceConfig } from '../hooks/useEncryptionServiceConfig';
import { useTeamDeviceConfig } from '../hooks/useTeamDeviceConfig';
import { SSOPaywall } from 'team/settings/sso/paywall/sso-paywall';
import { useBuyOrUpgradePaywallDetails } from 'team/helpers/use-buy-or-upgrade-paywall-details';
import { IndeterminateLoader } from '@dashlane/design-system';
import { ContentError } from './content-error';
export const TeamSettingsSsoRoutes = {
    SSO_CONNECTOR: '/sso-connector',
    SELF_HOSTED_SSO: '/self-hosted-sso',
    CONFIDENTIAL_SSO: '/confidential-sso',
    UPGRADE_PAYWALL: '/paywall',
};
const ContentInitializing = () => (<GridContainer justifyItems="center">
    <IndeterminateLoader size={75} sx={{ marginTop: '20vh' }}/>
  </GridContainer>);
const getRedirectPath = (path: string, ssoSetupState: InferredSsoState, isScimEnabled?: boolean, showUpgradePaywall?: boolean): string | null => {
    const selfHostedPath = `${path}${TeamSettingsSsoRoutes.SELF_HOSTED_SSO}`;
    const confidentialSsoPath = `${path}${TeamSettingsSsoRoutes.CONFIDENTIAL_SSO}`;
    const ssoConnectorPath = `${path}${TeamSettingsSsoRoutes.SSO_CONNECTOR}`;
    const upgradePaywall = `${path}${TeamSettingsSsoRoutes.UPGRADE_PAYWALL}`;
    if (isScimEnabled) {
        return selfHostedPath;
    }
    if (showUpgradePaywall) {
        return upgradePaywall;
    }
    const pathMap: Record<InferredSsoState, string | null> = {
        [InferredSsoState.enum.NitroComplete]: confidentialSsoPath,
        [InferredSsoState.enum.NitroIncomplete]: null,
        [InferredSsoState.enum.SelfHostedComplete]: selfHostedPath,
        [InferredSsoState.enum.SelfHostedIncomplete]: null,
        [InferredSsoState.enum.SsoConnectorComplete]: ssoConnectorPath,
        [InferredSsoState.enum.SsoConnectorIncomplete]: null,
        [InferredSsoState.enum.SsoConnectorToSelfHostedMigration]: selfHostedPath,
        [InferredSsoState.enum.None]: null,
        [InferredSsoState.enum.Unknown]: null,
    };
    return pathMap[ssoSetupState];
};
export const SsoRoutes = ({ lee }: {
    lee: Lee;
}) => {
    const routeMatch = useRouteMatch();
    const { teamId } = useTeamSpaceContext();
    const [isInitialized, setIsInitialized] = useState(false);
    const [initError, setInitError] = useState<string>('');
    const { initSsoProvisioning } = useModuleCommands(confidentialSSOApi);
    const { esConfig, esConfigLoading } = useEncryptionServiceConfig();
    const { teamDeviceConfig, teamDeviceConfigLoading } = useTeamDeviceConfig({
        draft: false,
        deviceAccessKey: esConfig?.deviceAccessKey,
    });
    const { shouldShowBuyOrUpgradePaywall, isTrialOrGracePeriod, planType } = useBuyOrUpgradePaywallDetails(lee.permission.adminAccess) ?? {};
    const showUpgradePaywall = shouldShowBuyOrUpgradePaywall &&
        (planType === SpaceTier.Starter || planType === SpaceTier.Team);
    const initialize = useCallback(async (maybeTeamId: string | number | null) => {
        if (!maybeTeamId) {
            return;
        }
        setIsInitialized(false);
        setInitError('');
        const resp = await initSsoProvisioning({ teamId: `${maybeTeamId}` });
        setIsInitialized(true);
        if (isFailure(resp)) {
            setInitError(resp.error.tag);
        }
    }, [initSsoProvisioning]);
    useEffect(() => {
        void initialize(teamId);
    }, [initialize, teamId]);
    const nitroState = useModuleQuery(confidentialSSOApi, 'ssoProvisioning');
    if (initError || nitroState.status === DataStatus.Error) {
        return (<ContentError onReloadData={() => {
                void initialize(teamId);
            }} errorTag={initError}/>);
    }
    if (!isInitialized ||
        esConfigLoading ||
        teamDeviceConfigLoading ||
        nitroState.status === DataStatus.Loading) {
        return <ContentInitializing />;
    }
    const { inferredSsoState } = nitroState.data.global;
    const redirectPath = getRedirectPath(routeMatch.path, inferredSsoState, teamDeviceConfig?.configProperties.scimEnabled, showUpgradePaywall);
    return (<Switch>
      <Route path={`${routeMatch.path}${TeamSettingsSsoRoutes.SELF_HOSTED_SSO}`}>
        <SsoWithEncryptionService backRoute={routeMatch.url}/>
      </Route>
      <Route path={`${routeMatch.path}${TeamSettingsSsoRoutes.CONFIDENTIAL_SSO}`}>
        <NitroSSO backRoute={routeMatch.url}/>
      </Route>
      <Route path={`${routeMatch.path}${TeamSettingsSsoRoutes.UPGRADE_PAYWALL}`}>
        <SSOPaywall isTrialOrGracePeriod={isTrialOrGracePeriod ?? false}/>
      </Route>
      <Route path={`${routeMatch.path}${TeamSettingsSsoRoutes.SSO_CONNECTOR}`}>
        <SSOSettings lee={lee}/>
      </Route>
      <Route exact path={routeMatch.path}>
        {redirectPath ? (<Redirect to={redirectPath}/>) : (<ChooseSsoEntrypoint />)}
      </Route>
    </Switch>);
};
