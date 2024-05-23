import React from 'react';
import { TaskCard } from '../task-card/task-card';
import TaskGraphicOne from './images/task_graphic_1.png';
import { useRouterGlobalSettingsContext } from 'libs/router';
import { redirectToUrl } from 'libs/external-urls';
import { WEBAPP_BASE } from 'team/urls';
import { GetStartedTaskProps } from './types';
import { logOpenSharingCenterClick } from '../logs';
const I18N_KEYS = {
    SHARING_DISABLED: 'team_get_started_sharing_turned_off',
    SHARING_ITEMS_DISABLED_TOOLTIP: 'team_get_started_sharing_disabled_tooltip',
    SHARING_ITEMS_TITLE: 'team_get_started_sharing_items_title',
    SHARING_ITEMS_CONTENT: 'team_get_started_sharing_items_content',
    SHARING_ITEMS_CTA: 'team_get_started_sharing_items_cta',
    SHARING_ITEMS_INFOBOX: 'team_get_started_sharing_items_infobox',
};
const SHARE_ITEM_HELP_LINK = '*****';
export const ShareItemTask = ({ isCompleted, isUpNext, isCtaDisabled, isDisabled, }: GetStartedTaskProps) => {
    const routeContext = useRouterGlobalSettingsContext();
    const handleShareItemCtaClick = () => {
        logOpenSharingCenterClick();
        redirectToUrl(`${WEBAPP_BASE}#${routeContext.routes.userSharingCenter}`);
    };
    return (<TaskCard isUpNext={isUpNext} upNextImage={<img alt="" src={TaskGraphicOne}/>} isDisabled={isDisabled} disabledText={I18N_KEYS.SHARING_DISABLED} isCompleted={isCompleted} isCtaDisabled={isCtaDisabled} disabledCtaTooltipText={I18N_KEYS.SHARING_ITEMS_DISABLED_TOOLTIP} title={I18N_KEYS.SHARING_ITEMS_TITLE} content={I18N_KEYS.SHARING_ITEMS_CONTENT} helpDocLink={SHARE_ITEM_HELP_LINK} ctaOnClick={handleShareItemCtaClick} ctaText={I18N_KEYS.SHARING_ITEMS_CTA} infoBoxText={I18N_KEYS.SHARING_ITEMS_INFOBOX}/>);
};
