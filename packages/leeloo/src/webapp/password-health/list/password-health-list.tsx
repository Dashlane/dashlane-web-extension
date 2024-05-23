import { Fragment, useCallback, useState } from 'react';
import { FlexContainer, HorizontalNavButton, HorizontalNavMenu, jsx, ThemeUIStyleObject, } from '@dashlane/ui-components';
import { Heading } from '@dashlane/design-system';
import { PageView } from '@dashlane/hermes';
import { HealthFilter, PasswordHealthCredentialView, } from '@dashlane/password-security-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import { logPageView } from 'libs/logs/logEvent';
import { logSelectCredential } from 'libs/logs/events/vault/select-item';
import { PasswordHealthListItem } from 'webapp/password-health/list/list-item/password-health-list-item';
import { EmptyList } from 'webapp/password-health/list/empty-list/empty-list';
import { PasswordChangeDialog } from 'webapp/password-change-dialog/components/dialogs/password-change-dialog';
import { useIsCredentialExcluded } from '../hooks/use-is-credential-excluded';
import { useCredentialsFilter } from '../hooks/use-credentials-filter';
import { passwordHealthStyles } from '../password-health-styles';
const I18N_KEYS = {
    AT_RISK_TITLE: 'webapp_password_health_at_risk_title',
    FILTER_ALL: 'webapp_password_health_list_filter_all',
    FILTER_COMPROMISED: 'webapp_password_health_list_filter_compromised',
    FILTER_EXCLUDED: 'webapp_password_health_list_filter_excluded',
    FILTER_REUSED: 'webapp_password_health_list_filter_reused',
    FILTER_WEAK: 'webapp_password_health_list_filter_weak',
    LOAD_MORE: 'webapp_password_health_list_load_more',
};
const filterToPageView: Record<HealthFilter, PageView> = {
    [HealthFilter.All]: PageView.ToolsPasswordHealthOverview,
    [HealthFilter.Compromised]: PageView.ToolsPasswordHealthListCompromised,
    [HealthFilter.Excluded]: PageView.ToolsPasswordHealthListExcluded,
    [HealthFilter.Reused]: PageView.ToolsPasswordHealthListReused,
    [HealthFilter.Weak]: PageView.ToolsPasswordHealthListWeak,
};
interface PasswordHealthListProps {
    spaceId: string | null;
}
const MenuFiltersStyles: ThemeUIStyleObject = {
    marginLeft: 'auto',
    paddingBottom: 0,
};
export const PasswordHealthList = ({ spaceId }: PasswordHealthListProps) => {
    const { translate } = useTranslate();
    const { updateIsCredentialExcluded } = useIsCredentialExcluded();
    const [activeFilter, setActiveFilter] = useState<HealthFilter>(HealthFilter.All);
    const { filteredCredentials } = useCredentialsFilter(activeFilter, spaceId);
    const getChangeFilterCallback = (filter: HealthFilter) => () => {
        setActiveFilter(filter);
        logPageView(filterToPageView[filter]);
    };
    const [passwordChangeCredentialId, setPasswordChangeCredentialId] = useState<null | string>(null);
    const openPasswordChange = useCallback((credentialID) => setPasswordChangeCredentialId(credentialID), []);
    const closePasswordChange = useCallback(() => {
        setPasswordChangeCredentialId(null);
    }, []);
    const onChangeNowClick = useCallback((website: string, credentialID: string) => {
        openPasswordChange(credentialID);
    }, [openPasswordChange]);
    const onIncludeButtonClick = async (credentialId: string) => {
        updateIsCredentialExcluded(credentialId, false);
    };
    const onExcludeButtonClick = async (credentialId: string) => {
        updateIsCredentialExcluded(credentialId, true);
    };
    return (<>
      <FlexContainer alignItems="center" sx={{ ...passwordHealthStyles.listHeader, position: 'sticky' }}>
        <Heading as="h2" color="ds.text.neutral.quiet" textStyle="ds.title.supporting.small">
          {translate(I18N_KEYS.AT_RISK_TITLE)}
        </Heading>
        {passwordChangeCredentialId && (<PasswordChangeDialog credentialId={passwordChangeCredentialId} dismissCallback={closePasswordChange}/>)}
        <HorizontalNavMenu sx={MenuFiltersStyles}>
          <HorizontalNavButton onClick={getChangeFilterCallback(HealthFilter.All)} selected={activeFilter === HealthFilter.All} size="small" label={translate(I18N_KEYS.FILTER_ALL)} sx={{
            variant: 'ds.body.reduced.regular',
            color: 'ds.text.neutral.standard',
        }}/>
          <HorizontalNavButton onClick={getChangeFilterCallback(HealthFilter.Compromised)} selected={activeFilter === HealthFilter.Compromised} size="small" label={translate(I18N_KEYS.FILTER_COMPROMISED)} sx={{
            variant: 'ds.body.reduced.regular',
            color: 'ds.text.neutral.standard',
        }}/>
          <HorizontalNavButton onClick={getChangeFilterCallback(HealthFilter.Weak)} selected={activeFilter === HealthFilter.Weak} size="small" label={translate(I18N_KEYS.FILTER_WEAK)} sx={{
            variant: 'ds.body.reduced.regular',
            color: 'ds.text.neutral.standard',
        }}/>
          <HorizontalNavButton onClick={getChangeFilterCallback(HealthFilter.Reused)} selected={activeFilter === HealthFilter.Reused} size="small" label={translate(I18N_KEYS.FILTER_REUSED)} sx={{
            variant: 'ds.body.reduced.regular',
            color: 'ds.text.neutral.standard',
        }}/>
          <HorizontalNavButton onClick={getChangeFilterCallback(HealthFilter.Excluded)} selected={activeFilter === HealthFilter.Excluded} size="small" label={translate(I18N_KEYS.FILTER_EXCLUDED)} sx={{
            variant: 'ds.body.reduced.regular',
            color: 'ds.text.neutral.standard',
        }}/>
        </HorizontalNavMenu>
      </FlexContainer>
      <FlexContainer flexDirection="column" sx={passwordHealthStyles.listContainer}>
        {filteredCredentials.length > 0 ? (<ul sx={passwordHealthStyles.listStyle}>
            {filteredCredentials.map((credential: PasswordHealthCredentialView) => {
                return (<PasswordHealthListItem onRowClick={() => {
                        logSelectCredential(credential.id);
                    }} onChangeNowClick={onChangeNowClick} onIncludeButtonClick={onIncludeButtonClick} onExcludeButtonClick={onExcludeButtonClick} key={credential.id} credential={credential}/>);
            })}
          </ul>) : (<EmptyList healthFilter={activeFilter} spaceId={spaceId}/>)}
      </FlexContainer>
    </>);
};
