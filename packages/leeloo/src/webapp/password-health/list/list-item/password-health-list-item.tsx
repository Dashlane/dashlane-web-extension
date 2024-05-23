import { Fragment, MouseEvent as ReactMouseEvent, ReactNode, useCallback, useMemo, } from 'react';
import { Button, Icon, jsx } from '@dashlane/design-system';
import { FlexContainer, GridChild, GridContainer, Paragraph, Tooltip, } from '@dashlane/ui-components';
import { CorruptionData, CorruptionDataStrength, PasswordHealthCredentialView, RiskType, } from '@dashlane/password-security-contracts';
import { VaultItemType } from '@dashlane/vault-contracts';
import { assertUnreachable } from 'libs/assert-unreachable';
import { CredentialInfo } from 'libs/dashlane-style/credential-info/credential-info';
import useTranslate from 'libs/i18n/useTranslate';
import { TranslatorInterface } from 'libs/i18n/types';
import { useHistory, useLocation } from 'libs/router';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { RiskInfo } from 'webapp/password-health/list/risk-info/risk-info';
import { DatePrecision, getBreachDate, } from 'webapp/dark-web-monitoring/helpers/date';
import styles from './styles.css';
const I18N_PASSWORD_HEALTH_ROW_KEYS = {
    CHANGE_PASSWORD: 'webapp_security_dashboard_change_password',
    TOOLTIP_EXCLUDE: 'webapp_security_dashboard_tooltip_exclude',
    TOOLTIP_INCLUDE: 'webapp_security_dashboard_tooltip_include',
    TOOLTIP_LIMITED_RIGHTS: 'webapp_security_dashboard_tooltip_limited_rights',
};
const I18N_PASSWORD_HEALTH_INFO_LABEL_KEYS = {
    COMPROMISED: 'webapp_security_dashboard_compromised_credential_markup',
    COMPROMISED_WITHOUT_DOMAIN: 'webapp_security_dashboard_compromised_credential_without_domain_markup',
    COMPROMISED_WITHOUT_DOMAIN_MONTH: 'webapp_security_dashboard_compromised_credential_without_domain_month_markup',
    COMPROMISED_WITHOUT_DOMAIN_YEAR: 'webapp_security_dashboard_compromised_credential_without_domain_year_markup',
    WEAK: 'webapp_security_dashboard_weak_credential',
    EXTREMELY_WEAK: 'webapp_security_dashboard_extremely_weak_credential',
    REUSED: 'webapp_security_dashboard_reused_credential',
    REUSED_ONCE: 'webapp_security_dashboard_reused_once_credential',
};
const getCompromisedRiskLabelFromDatePrecision = (translate: TranslatorInterface, date: string | null, precision: DatePrecision) => {
    switch (precision) {
        case DatePrecision.DAY:
            return translate.markup(I18N_PASSWORD_HEALTH_INFO_LABEL_KEYS.COMPROMISED_WITHOUT_DOMAIN, {
                date,
            });
        case DatePrecision.MONTH:
            return translate.markup(I18N_PASSWORD_HEALTH_INFO_LABEL_KEYS.COMPROMISED_WITHOUT_DOMAIN_MONTH, {
                date,
            });
        case DatePrecision.YEAR:
            return translate.markup(I18N_PASSWORD_HEALTH_INFO_LABEL_KEYS.COMPROMISED_WITHOUT_DOMAIN_YEAR, {
                date,
            });
        case DatePrecision.INVALID:
            return '';
        default:
            return assertUnreachable(precision);
    }
};
const getCompromisedRiskLabel = (riskDate: string, riskDomain: string | null, translate: TranslatorInterface): ReactNode => {
    const { date, precision } = getBreachDate(riskDate, 'short', translate);
    if (riskDomain) {
        return translate.markup(I18N_PASSWORD_HEALTH_INFO_LABEL_KEYS.COMPROMISED, {
            domain: riskDomain,
            date: date,
        });
    }
    return getCompromisedRiskLabelFromDatePrecision(translate, date, precision);
};
const getRiskLabel = (corruptionData: CorruptionData, translate: TranslatorInterface) => {
    switch (corruptionData.riskType) {
        case RiskType.Compromised:
            return getCompromisedRiskLabel(corruptionData.date, corruptionData.domain, translate);
        case RiskType.Weak:
            return corruptionData.strength === CorruptionDataStrength.WEAK
                ? translate(I18N_PASSWORD_HEALTH_INFO_LABEL_KEYS.WEAK)
                : translate(I18N_PASSWORD_HEALTH_INFO_LABEL_KEYS.EXTREMELY_WEAK);
        case RiskType.Reused:
            return corruptionData.reuseCount === 1
                ? translate(I18N_PASSWORD_HEALTH_INFO_LABEL_KEYS.REUSED_ONCE)
                : translate(I18N_PASSWORD_HEALTH_INFO_LABEL_KEYS.REUSED, {
                    count: corruptionData.reuseCount,
                });
        default:
            return null;
    }
};
export interface PasswordHealthListItemProps {
    credential: PasswordHealthCredentialView;
    onRowClick: (website: string) => void;
    onChangeNowClick: (website: string, credentialID: string) => void;
    onIncludeButtonClick: (credentialId: string, website: string) => void;
    onExcludeButtonClick: (credentialId: string, website: string) => void;
}
export const PasswordHealthListItem = ({ credential, onRowClick, onChangeNowClick, onIncludeButtonClick, onExcludeButtonClick, }: PasswordHealthListItemProps) => {
    const { id: credentialId, title, login, email, autoProtected, corruptionData, shared, excluded, domain, } = credential;
    const { translate } = useTranslate();
    const { pathname } = useLocation();
    const onPasswordChangeClick = useCallback((e: ReactMouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onChangeNowClick(domain, credential.id);
    }, [onChangeNowClick, credential.id, domain]);
    const onExcludeClick = useCallback((e: ReactMouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onExcludeButtonClick(credentialId, domain);
    }, [credentialId, onExcludeButtonClick, domain]);
    const onIncludeClick = useCallback((e: ReactMouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onIncludeButtonClick(credentialId, domain);
    }, [credentialId, onIncludeButtonClick, domain]);
    const { routes } = useRouterGlobalSettingsContext();
    const history = useHistory();
    const openCredentialEditPanel = useCallback(() => {
        onRowClick(domain);
        history.push(routes.userVaultItem(credentialId, VaultItemType.Credential, pathname));
    }, [credentialId, history, onRowClick, routes, domain]);
    const limitedRights = false;
    const exclusionTooltip = useMemo(() => (<Tooltip placement="left" content={translate(excluded
            ? I18N_PASSWORD_HEALTH_ROW_KEYS.TOOLTIP_INCLUDE
            : I18N_PASSWORD_HEALTH_ROW_KEYS.TOOLTIP_EXCLUDE)}>
        <Button mood="neutral" intensity="quiet" layout="iconOnly" size="small" icon={excluded ? (<Icon name="ActionUndoOutlined"/>) : (<Icon name="ActionRevokeOutlined"/>)} onClick={excluded ? onIncludeClick : onExcludeClick} aria-label={translate(excluded
            ? I18N_PASSWORD_HEALTH_ROW_KEYS.TOOLTIP_INCLUDE
            : I18N_PASSWORD_HEALTH_ROW_KEYS.TOOLTIP_EXCLUDE)}/>
      </Tooltip>), [excluded, onExcludeClick, onIncludeClick, translate]);
    return (<GridContainer as="li" alignItems="center" gridTemplateAreas="'info feedback buttons'" gridTemplateColumns="2fr 2.5fr auto" gridTemplateRows="62px" onClick={openCredentialEditPanel} sx={{
            cursor: 'pointer',
            '&:not(:last-child)': {
                borderBottom: '1px solid transparent',
                borderBottomColor: 'ds.border.neutral.quiet.idle',
            },
            '&:hover div:last-child': {
                opacity: 1,
            },
        }}>
      <GridChild as={CredentialInfo} title={title} login={login} email={email} domain={domain} shared={shared} autoProtected={autoProtected} gridArea={'info'} sxProps={{
            overflow: 'hidden',
            marginRight: '16px',
        }}/>

      <GridChild as={FlexContainer} gridArea="feedback" alignItems="center" alignSelf="center" sx={{
            overflow: 'hidden',
            maxWidth: '100%',
            textOverflow: 'ellipsis',
            height: '100%',
        }}>
        {!excluded && corruptionData ? (<RiskInfo severity={corruptionData.severity}>
            <Paragraph className={styles.riskFeedbackLabel} color="ds.text.neutral.standard" sx={{
                variant: 'ds.body.reduce.regular',
                textOverflow: 'ellipsis',
                wordBreak: 'break-all',
                overflow: 'hidden',
            }}>
              {getRiskLabel(corruptionData, translate)}
            </Paragraph>
          </RiskInfo>) : null}
      </GridChild>
      <GridChild gridArea="buttons">
        <FlexContainer flexDirection="row" justifyContent="flex-end" alignItems="center" gap="6px" className={styles.itemButtons}>
          {excluded ? (exclusionTooltip) : (<>
              <Tooltip passThrough={!limitedRights} placement="left" content={translate(I18N_PASSWORD_HEALTH_ROW_KEYS.TOOLTIP_LIMITED_RIGHTS)}>
                <Button mood="neutral" intensity="quiet" layout="labelOnly" className={styles.passwordChangerButton} size="small" onClick={onPasswordChangeClick} disabled={limitedRights}>
                  <span>
                    {translate(I18N_PASSWORD_HEALTH_ROW_KEYS.CHANGE_PASSWORD)}
                  </span>
                </Button>
              </Tooltip>
              {exclusionTooltip}
            </>)}
        </FlexContainer>
      </GridChild>
    </GridContainer>);
};
