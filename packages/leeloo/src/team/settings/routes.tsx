import * as React from 'react';
import { CustomRoute, Redirect, RoutesProps, Switch, WrappingRoute, } from 'libs/router';
import { TeamSettingsRoutes } from 'app/routes/constants';
import { withNavLayout } from 'team/page/nav-layout/with-nav-layout';
import DuoSettings from './duo';
import duoSettingsReducer from './duo/reducer';
import MasterPasswordPoliciesSettings from './master-password-policies';
import masterPasswordPoliciesSettingsReducer from './master-password-policies/reducer';
import { PoliciesSettings } from 'team/settings/policies/policies-settings';
import { SsoRoutes } from './sso-routes/sso-routes';
import { DirectorySync } from './directory-sync/routes';
import { TacSettingsTabs } from 'team/settings/types';
const PoliciesSettingsWithNav = withNavLayout(PoliciesSettings, TacSettingsTabs.POLICIES);
const DirectorySyncWithNav = withNavLayout(DirectorySync, TacSettingsTabs.DIRECTORY_SYNC);
const DuoSettingsWithNav = withNavLayout(DuoSettings, TacSettingsTabs.DUO);
const MasterPasswordPoliciesSettingsWithNav = withNavLayout(MasterPasswordPoliciesSettings, TacSettingsTabs.ACCOUNT_RECOVERY);
const SsoInterstitial = withNavLayout(SsoRoutes, TacSettingsTabs.SSO);
export default function routes({ path }: RoutesProps): JSX.Element {
    return (<WrappingRoute path={path} permission={(p) => p.adminAccess.hasFullAccess}>
      <Switch>
        <Redirect exact from={path} to={`${path}${TeamSettingsRoutes.POLICIES}`}/>
        <CustomRoute path={`${path}${TeamSettingsRoutes.POLICIES}`} component={PoliciesSettingsWithNav}/>
        <CustomRoute path={`${path}${TeamSettingsRoutes.DIRECTORY_SYNC}`} component={DirectorySyncWithNav}/>
        <CustomRoute path={`${path}${TeamSettingsRoutes.DUO}`} component={DuoSettingsWithNav} reducer={duoSettingsReducer}/>
        <CustomRoute path={`${path}${TeamSettingsRoutes.MASTER_PASSWORD_POLICIES}`} component={MasterPasswordPoliciesSettingsWithNav} reducer={masterPasswordPoliciesSettingsReducer}/>
        <CustomRoute path={`${path}${TeamSettingsRoutes.SSO}`} component={SsoInterstitial}/>
      </Switch>
    </WrappingRoute>);
}
