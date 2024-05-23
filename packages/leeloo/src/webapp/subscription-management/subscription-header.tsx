import * as React from 'react';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { CancelPlanStep } from '@dashlane/hermes';
import { BackIcon, Button, Heading } from '@dashlane/ui-components';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import useTranslate from 'libs/i18n/useTranslate';
import { CancellationStep } from 'webapp/subscription-management/subscription-page';
import { Header } from 'webapp/components/header/header';
import { HeaderAccountMenu } from 'webapp/components/header/header-account-menu';
import { logCancellationEvent } from 'webapp/subscription-management/logs';
import { Connected as NotificationsDropdown } from 'webapp/bell-notifications/connected';
import styles from './subscription.css';
const I18N_KEYS = {
    PAGE_TITLE: 'manage_subscription_page_title',
    GO_BACK: 'manage_subscription_cancel_section_back',
};
const StartWidgets = ({ cancellationStep, setCancellationStep, }: SubscriptionHeaderProps) => {
    const premiumStatus = usePremiumStatus();
    const { translate } = useTranslate();
    if (premiumStatus.status !== DataStatus.Success || !premiumStatus.data) {
        return null;
    }
    if (cancellationStep === CancellationStep.SUBSCRIPTION) {
        return <Heading>{translate(I18N_KEYS.PAGE_TITLE)}</Heading>;
    }
    else {
        return (<Button className={styles.backButton} nature={'ghost'} type={'button'} onClick={() => {
                if (cancellationStep === CancellationStep.CANCEL_CONFIRM) {
                    logCancellationEvent(CancelPlanStep.Abandon, premiumStatus.data);
                }
                setCancellationStep(CancellationStep.SUBSCRIPTION);
            }}>
        <BackIcon className={styles.backButtonArrow} size={16}/>
        {translate(I18N_KEYS.GO_BACK)}
      </Button>);
    }
};
export interface SubscriptionHeaderProps {
    cancellationStep: CancellationStep;
    setCancellationStep: (step: CancellationStep) => void;
}
export const SubscriptionHeader = ({ cancellationStep, setCancellationStep, }: SubscriptionHeaderProps) => {
    return (<Header className={styles.headerContainer} startWidgets={() => (<StartWidgets cancellationStep={cancellationStep} setCancellationStep={setCancellationStep}/>)} endWidget={<>
          <HeaderAccountMenu />
          <NotificationsDropdown />
        </>}/>);
};
