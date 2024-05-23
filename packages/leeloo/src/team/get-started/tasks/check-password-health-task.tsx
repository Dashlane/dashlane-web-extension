import React from 'react';
import { TaskCard } from '../task-card/task-card';
import TaskGraphicThree from './images/task_graphic_3.png';
import { useHistory, useRouterGlobalSettingsContext } from 'libs/router';
import { GetStartedTaskProps } from './types';
import { logOpenDashboardClick } from '../logs';
const I18N_KEYS = {
    PASSWORD_HEALTH_TITLE: 'team_get_started_password_health_title',
    PASSWORD_HEALTH_CONTENT: 'team_get_started_password_health_content',
    PASSWORD_HEALTH_CTA: 'team_get_started_password_health_cta',
    PASSWORD_HEALTH_CTA_DISABLED: 'team_get_started_password_health_cta_disabled',
    PASSWORD_HEALTH_INFOBOX: 'team_get_started_password_health_infobox',
};
const CHECK_PASSWORD_HEALTH_HELP_LINK = '*****';
export const CheckPasswordHealthTask = ({ isCompleted, isUpNext, isCtaDisabled, }: GetStartedTaskProps) => {
    const routeContext = useRouterGlobalSettingsContext();
    const history = useHistory();
    const handleOpenDashboardClick = () => {
        logOpenDashboardClick();
        history.push(routeContext.routes.teamDashboardRoutePath);
    };
    return (<TaskCard isUpNext={isUpNext} upNextImage={<img alt="" src={TaskGraphicThree}/>} isCompleted={isCompleted} isCtaDisabled={isCtaDisabled} title={I18N_KEYS.PASSWORD_HEALTH_TITLE} content={I18N_KEYS.PASSWORD_HEALTH_CONTENT} helpDocLink={CHECK_PASSWORD_HEALTH_HELP_LINK} ctaOnClick={handleOpenDashboardClick} ctaText={I18N_KEYS.PASSWORD_HEALTH_CTA} disabledCtaTooltipText={I18N_KEYS.PASSWORD_HEALTH_CTA_DISABLED} infoBoxText={I18N_KEYS.PASSWORD_HEALTH_INFOBOX}/>);
};
