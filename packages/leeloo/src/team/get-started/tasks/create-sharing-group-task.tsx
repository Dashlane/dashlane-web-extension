import React from 'react';
import { TaskCard } from '../task-card/task-card';
import TaskGraphicTwo from './images/task_graphic_2.png';
import { useHistory, useRouterGlobalSettingsContext } from 'libs/router';
import { GetStartedTaskProps } from './types';
import { logOpenGroupsClick } from '../logs';
const I18N_KEYS = {
    SHARING_DISABLED: 'team_get_started_sharing_turned_off',
    SHARING_GROUP_DISABLED_TOOLTIP: 'team_get_started_sharing_group_disabled_tooltip',
    SHARING_GROUP_TITLE: 'team_get_started_sharing_group_title',
    SHARING_GROUP_CONTENT: 'team_get_started_sharing_group_content',
    SHARING_GROUP_CTA: 'team_get_started_sharing_group_cta',
    SHARING_GROUP_INFOBOX: 'team_get_started_sharing_group_infobox',
};
const CREATE_SHARING_GROUP_HELP_LINK = '*****';
export const CreateSharingGroupTask = ({ isCompleted, isUpNext, isCtaDisabled, isDisabled, }: GetStartedTaskProps) => {
    const routeContext = useRouterGlobalSettingsContext();
    const history = useHistory();
    const handleOpenGroupsPageClick = () => {
        logOpenGroupsClick();
        history.push(routeContext.routes.teamGroupsRoutePath);
    };
    return (<TaskCard isUpNext={isUpNext} upNextImage={<img alt="" src={TaskGraphicTwo}/>} isDisabled={isDisabled} disabledText={I18N_KEYS.SHARING_DISABLED} isCtaDisabled={isCtaDisabled} disabledCtaTooltipText={I18N_KEYS.SHARING_GROUP_DISABLED_TOOLTIP} isCompleted={isCompleted} title={I18N_KEYS.SHARING_GROUP_TITLE} content={I18N_KEYS.SHARING_GROUP_CONTENT} helpDocLink={CREATE_SHARING_GROUP_HELP_LINK} ctaOnClick={handleOpenGroupsPageClick} ctaText={I18N_KEYS.SHARING_GROUP_CTA} infoBoxText={I18N_KEYS.SHARING_GROUP_INFOBOX}/>);
};
