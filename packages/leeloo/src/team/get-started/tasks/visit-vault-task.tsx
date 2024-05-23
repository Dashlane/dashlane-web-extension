import React, { useContext } from 'react';
import { browser } from '@dashlane/browser-utils';
import { ShowVaultNavModalContext } from 'team/show-vault-nav-modal/show-vault-nav-modal-provider';
import { WEBAPP_BASE } from 'team/urls';
import { redirectToUrl } from 'libs/external-urls';
import { TaskCard } from '../task-card/task-card';
import TaskGraphicTwo from './images/task_graphic_2.png';
import { GetStartedTaskProps } from './types';
import { useHasVisitedVault } from '../hooks/use-has-visited-vault';
import { logOpenVaultClick } from '../logs';
import { logTACGetStartedTaskCompletion, OnboardingTask, } from '../hooks/notifications/logs';
const I18N_KEYS = {
    VISIT_VAULT_TITLE: 'team_get_started_visit_vault_title',
    VISIT_VAULT_CONTENT: 'team_get_started_visit_vault_content',
    VISIT_VAULT_CTA: 'team_get_started_visit_vault_cta',
    VISIT_VAULT_INFOBOX: 'team_get_started_visit_vault_infobox',
};
const VISIT_VAULT_HELP_LINK = '*****';
export const VisitVaultTask = ({ isCompleted, isUpNext, }: GetStartedTaskProps) => {
    const { setIsVaultNavigationModalOpen, setOnBeforeNavigateCallback } = useContext(ShowVaultNavModalContext);
    const { markVaultAsVisited } = useHasVisitedVault();
    const handleVisitVaultCtaClick = () => {
        logOpenVaultClick();
        if (!APP_PACKAGED_IN_EXTENSION && !browser.isSafari()) {
            setOnBeforeNavigateCallback(() => markVaultAsVisited);
            setIsVaultNavigationModalOpen(true);
        }
        else {
            redirectToUrl(WEBAPP_BASE);
            markVaultAsVisited();
            logTACGetStartedTaskCompletion(OnboardingTask.VisitVault);
        }
    };
    return (<TaskCard isUpNext={isUpNext} upNextImage={<img alt="" src={TaskGraphicTwo}/>} isCompleted={isCompleted} title={I18N_KEYS.VISIT_VAULT_TITLE} content={I18N_KEYS.VISIT_VAULT_CONTENT} helpDocLink={VISIT_VAULT_HELP_LINK} ctaOnClick={handleVisitVaultCtaClick} ctaText={I18N_KEYS.VISIT_VAULT_CTA} infoBoxText={I18N_KEYS.VISIT_VAULT_INFOBOX}/>);
};
