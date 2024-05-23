import React from 'react';
import { Domain } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import { DeactivateDomain, SuccessfulDomain, VerifyConfirmDialog, VerifyDomain, VerifyFailedDialog, } from 'team/settings/sso/domain/steps';
import { DomainSteps } from 'team/settings/sso/domain/domain-container';
import styles from './styles.css';
const I18N_KEYS = {
    DEACTIVATE_ERROR: 'team_settings_domain_deactivate_button_tooltip_error',
};
export interface DomainRowProps {
    currentStep: DomainSteps;
    deactivateDomain: (domain: Domain) => Promise<unknown>;
    domain: Domain;
    isDisabled: boolean;
    setCurrentSteps: React.Dispatch<React.SetStateAction<Record<string, DomainSteps>>>;
    verifyDomain: (domain: Domain) => Promise<unknown>;
}
export const DomainRow = ({ currentStep, deactivateDomain, domain, isDisabled, setCurrentSteps, verifyDomain, }: DomainRowProps) => {
    const [showDialogForCurrentStep, setShowDialogForCurrentStep] = React.useState<boolean>(false);
    const { translate } = useTranslate();
    const inputAndButtonForCurrentStep = () => {
        if (!domain) {
            return null;
        }
        switch (currentStep) {
            case DomainSteps.Verify:
            case DomainSteps.VerifyFailed:
                return (<>
            <VerifyDomain domain={domain} verifyDomain={() => setShowDialogForCurrentStep(true)} domainStep={currentStep}/>
            <DeactivateDomain domain={domain} deactivateDomain={() => deactivateDomain(domain)} isDisabled={isDisabled} disabledTooltipText={translate(I18N_KEYS.DEACTIVATE_ERROR)}/>
          </>);
            case DomainSteps.Complete:
                return (<>
            <SuccessfulDomain domain={domain}/>
            <DeactivateDomain domain={domain} deactivateDomain={() => deactivateDomain(domain)} isDisabled={isDisabled} disabledTooltipText={translate(I18N_KEYS.DEACTIVATE_ERROR)}/>
          </>);
            default:
                return null;
        }
    };
    const dialogForCurrentStep = () => {
        if (!domain || !showDialogForCurrentStep) {
            return null;
        }
        switch (currentStep) {
            case DomainSteps.Verify:
                return (<VerifyConfirmDialog domainName={domain.name} onConfirm={() => verifyDomain(domain)} onDismiss={() => setShowDialogForCurrentStep(false)}/>);
            case DomainSteps.VerifyFailed:
                return (<VerifyFailedDialog onDismiss={() => {
                        setCurrentSteps((prevState) => ({
                            ...prevState,
                            [domain.id]: DomainSteps.Verify,
                        }));
                        setShowDialogForCurrentStep(false);
                    }}/>);
            default:
                return null;
        }
    };
    return (<div className={styles.domainContainer} key={domain.id}>
      {inputAndButtonForCurrentStep()}
      {dialogForCurrentStep()}
    </div>);
};
