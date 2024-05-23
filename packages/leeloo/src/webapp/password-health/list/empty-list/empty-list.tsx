import * as React from 'react';
import { jsx, Paragraph } from '@dashlane/design-system';
import { AllGoodIcon, ExcludedIcon } from '@dashlane/ui-components';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { HealthFilter } from '@dashlane/password-security-contracts';
import { assertUnreachable } from 'libs/assert-unreachable';
import useTranslate from 'libs/i18n/useTranslate';
import { useCredentialsCountData } from '../../hooks/use-credentials-count-data';
const I18N_KEYS = {
    EMPTY_TEXT: 'webapp_password_health_list_empty',
    EMPTY_COMPROMISED_TEXT: 'webapp_password_health_list_empty_compromised',
    EMPTY_EXCLUDED_TEXT: 'webapp_password_health_list_empty_excluded',
    EMPTY_REUSED_TEXT: 'webapp_password_health_list_empty_reused',
    EMPTY_VAULT_TEXT: 'webapp_password_health_list_empty_vault',
    EMPTY_WEAK_TEXT: 'webapp_password_health_list_empty_weak',
};
const getEmptyTranslationFromFilter = (filter: HealthFilter): string => {
    switch (filter) {
        case HealthFilter.All:
            return I18N_KEYS.EMPTY_TEXT;
        case HealthFilter.Compromised:
            return I18N_KEYS.EMPTY_COMPROMISED_TEXT;
        case HealthFilter.Excluded:
            return I18N_KEYS.EMPTY_EXCLUDED_TEXT;
        case HealthFilter.Reused:
            return I18N_KEYS.EMPTY_REUSED_TEXT;
        case HealthFilter.Weak:
            return I18N_KEYS.EMPTY_WEAK_TEXT;
        default:
            assertUnreachable(filter);
    }
};
const getEmptyIconFromFilter = (filter: HealthFilter): React.ReactNode => {
    switch (filter) {
        case HealthFilter.All:
        case HealthFilter.Compromised:
        case HealthFilter.Weak:
        case HealthFilter.Reused:
            return <AllGoodIcon size={96} color="ds.text.inverse.standard"/>;
        case HealthFilter.Excluded:
            return <ExcludedIcon size={96} color="ds.text.inverse.standard"/>;
        default:
            assertUnreachable(filter);
    }
};
interface EmptyListProps {
    healthFilter: HealthFilter;
    spaceId: string | null;
}
export const EmptyList: React.FC<EmptyListProps> = ({ healthFilter, spaceId, }) => {
    const { translate } = useTranslate();
    const credentialsCountData = useCredentialsCountData(spaceId);
    if (credentialsCountData.status !== DataStatus.Success) {
        return null;
    }
    const text = credentialsCountData.data > 0
        ? getEmptyTranslationFromFilter(healthFilter)
        : I18N_KEYS.EMPTY_VAULT_TEXT;
    const icon = credentialsCountData.data > 0 ? (getEmptyIconFromFilter(healthFilter)) : (<ExcludedIcon size={96} color="ds.text.inverse.standard"/>);
    return (<div data-testid="empty-list" sx={{
            margin: 'auto',
            textAlign: 'center',
        }}>
      <div sx={{
            display: 'inline-block',
            marginBottom: '27px',
        }}>
        {icon}
      </div>
      <Paragraph sx={{
            width: '384px',
            color: 'ds.text.neutral.standard',
            variant: 'ds.body.standard.regular',
        }}>
        {translate(text)}
      </Paragraph>
    </div>);
};
