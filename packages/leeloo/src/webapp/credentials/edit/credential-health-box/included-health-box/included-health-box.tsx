import * as React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Tooltip } from '@dashlane/ui-components';
import { Button, Infobox, jsx } from '@dashlane/design-system';
import { CorruptionData, CorruptionDataSeverity, RiskType, } from '@dashlane/password-security-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import { TranslateFunction } from 'libs/i18n/types';
import { assertUnreachable } from 'libs/assert-unreachable';
import transitionStyles from './transition-styles.css';
const I18N_KEYS = {
    COMPROMISED_TITLE: 'webapp_credential_edition_health_box_compromised_title',
    COMPROMISED_DESCRIPTION: 'webapp_credential_edition_health_box_compromised_description',
    VIEW_COMPROMISED: 'webapp_credential_edition_health_box_view_compromised',
    REUSED_TITLE: 'webapp_credential_edition_health_box_reused_title',
    REUSED_DESCRIPTION: 'webapp_credential_edition_health_box_reused_description_markup',
    VIEW_REUSED: 'webapp_credential_edition_health_box_view_reused',
    WEAK_TITLE: 'webapp_credential_edition_health_box_weak_title',
    WEAK_DESCRIPTION: 'webapp_credential_edition_health_box_weak_description',
    VIEW_WEAK: 'webapp_credential_edition_health_box_view_weak',
    CHANGE_PASSWORD: 'webapp_credential_edition_health_box_change_password',
    LIMITED_RIGHTS_RESTRICTIONS: 'webapp_credential_edition_health_box_change_limited',
};
const TRANSITION_TIME_MS = 600;
interface CredentialHealthTranslation {
    title: string;
    description: React.ReactNode;
    secondary?: string;
}
const riskTranslations = (corruptionData: CorruptionData, translate: TranslateFunction): CredentialHealthTranslation => {
    const { riskType } = corruptionData;
    switch (riskType) {
        case RiskType.Compromised:
            return {
                title: translate(I18N_KEYS.COMPROMISED_TITLE),
                description: translate(I18N_KEYS.COMPROMISED_DESCRIPTION),
                secondary: translate(I18N_KEYS.VIEW_COMPROMISED),
            };
        case RiskType.Reused:
            return {
                title: translate(I18N_KEYS.REUSED_TITLE),
                description: translate.markup(I18N_KEYS.REUSED_DESCRIPTION, {
                    count: corruptionData.reuseCount,
                }),
                secondary: translate(I18N_KEYS.VIEW_REUSED),
            };
        case RiskType.Weak:
            return {
                title: translate(I18N_KEYS.WEAK_TITLE),
                description: translate(I18N_KEYS.WEAK_DESCRIPTION),
                secondary: translate(I18N_KEYS.VIEW_WEAK),
            };
        default:
            return assertUnreachable(riskType);
    }
};
interface IncludedHealthBoxProps {
    onPrimaryClick: (event: React.MouseEvent<HTMLElement>) => void;
    onSecondaryClick: (event: React.MouseEvent<HTMLElement>) => void;
    isLimitedSharingPassword: boolean;
    corruptionData?: CorruptionData;
}
const IncludedHealthBoxComponent = ({ onPrimaryClick, onSecondaryClick, isLimitedSharingPassword, corruptionData, }: IncludedHealthBoxProps) => {
    const { translate } = useTranslate();
    if (!corruptionData) {
        return null;
    }
    const translations = riskTranslations(corruptionData, translate);
    const mood = corruptionData.severity === CorruptionDataSeverity.STRONG
        ? 'warning'
        : 'brand';
    const renderViewPasswordHealth = () => {
        return (<Button onClick={onSecondaryClick} intensity="quiet" key="view_health" size="small">
        {translations.secondary}
      </Button>);
    };
    const renderChangePassword = () => {
        return (<Tooltip passThrough={!isLimitedSharingPassword} key="change_password" content={translate(I18N_KEYS.LIMITED_RIGHTS_RESTRICTIONS)} placement="left" sx={{ maxWidth: '312px', fontSize: 2 }}>
        <Button size="small" onClick={onPrimaryClick} disabled={isLimitedSharingPassword}>
          {translate(I18N_KEYS.CHANGE_PASSWORD)}
        </Button>
      </Tooltip>);
    };
    return (<CSSTransition in appear timeout={TRANSITION_TIME_MS} classNames={transitionStyles}>
      <div sx={{
            position: 'relative',
            backgroundColor: 'ds.background.default',
            marginBottom: '24px',
        }}>
        <Infobox title={translations.title} description={translations.description} mood={mood} size="large" actions={[renderViewPasswordHealth(), renderChangePassword()]}/>
      </div>
    </CSSTransition>);
};
export const IncludedHealthBox = React.memo(IncludedHealthBoxComponent);
