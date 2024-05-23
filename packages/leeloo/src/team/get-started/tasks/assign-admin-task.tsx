import React from 'react';
import { TaskCard } from '../task-card/task-card';
import TaskGraphicTwo from './images/task_graphic_2.png';
import { useHistory, useRouterGlobalSettingsContext } from 'libs/router';
import { GetStartedTaskProps } from './types';
import { logOpenUsersClick } from '../logs';
const I18N_KEYS = {
    ASSIGN_ADMIN_DISABLED_TOOLTIP: 'team_get_started_assign_admin_disabled_tooltip',
    ASSIGN_ADMIN_TITLE: 'team_get_started_assign_admin_title',
    ASSIGN_ADMIN_CONTENT: 'team_get_started_assign_admin_content',
    ASSIGN_ADMIN_CTA: 'team_get_started_assign_admin_cta',
    ASSIGN_ADMIN_INFOBOX: 'team_get_started_assign_admin_infobox',
};
const ASSIGN_ADMIN_HELP_LINK = '*****';
export const showAssignAdminTipState = 'showAssignAdminTipState';
export const AssignAdminTask = ({ isCompleted, isUpNext, isCtaDisabled, }: GetStartedTaskProps) => {
    const routeContext = useRouterGlobalSettingsContext();
    const history = useHistory();
    const handleOpenUsersClick = () => {
        logOpenUsersClick();
        history.push({
            pathname: routeContext.routes.teamMembersRoutePath,
            state: {
                [showAssignAdminTipState]: true,
            },
        });
    };
    return (<TaskCard isUpNext={isUpNext} upNextImage={<img alt="" src={TaskGraphicTwo}/>} isCompleted={isCompleted} isCtaDisabled={isCtaDisabled} disabledCtaTooltipText={I18N_KEYS.ASSIGN_ADMIN_DISABLED_TOOLTIP} title={I18N_KEYS.ASSIGN_ADMIN_TITLE} content={I18N_KEYS.ASSIGN_ADMIN_CONTENT} helpDocLink={ASSIGN_ADMIN_HELP_LINK} ctaOnClick={handleOpenUsersClick} ctaText={I18N_KEYS.ASSIGN_ADMIN_CTA} infoBoxText={I18N_KEYS.ASSIGN_ADMIN_INFOBOX}/>);
};
