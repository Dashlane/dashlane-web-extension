import React from 'react';
import { TaskCard } from '../task-card/task-card';
import TaskGraphicTwo from './images/task_graphic_2.png';
import { useHistory, useRouterGlobalSettingsContext } from 'libs/router';
import { GetStartedTaskProps } from './types';
import { logOpenUsersClick } from '../logs';
const I18N_KEYS = {
    INVITE_TITLE: 'team_get_started_invite_title',
    INVITE_CONTENT: 'team_get_started_invite_content',
    INVITE_CTA: 'team_get_started_invite_cta',
    INVITE_ONE_MEMBER_INFOBOX: 'team_get_started_invite_member_infobox',
};
const INVITE_MEMBERS_HELP_LINK = '*****';
export const InviteMembersTask = ({ isCompleted, isUpNext, }: GetStartedTaskProps) => {
    const routeContext = useRouterGlobalSettingsContext();
    const history = useHistory();
    const handleInviteMembersCtaClick = () => {
        logOpenUsersClick();
        history.push({
            pathname: routeContext.routes.teamMembersRoutePath,
            state: {
                openSendInvitesDialog: true,
            },
        });
    };
    return (<TaskCard isUpNext={isUpNext} upNextImage={<img alt="" src={TaskGraphicTwo}/>} isCompleted={isCompleted} title={I18N_KEYS.INVITE_TITLE} content={I18N_KEYS.INVITE_CONTENT} helpDocLink={INVITE_MEMBERS_HELP_LINK} ctaOnClick={handleInviteMembersCtaClick} ctaText={I18N_KEYS.INVITE_CTA} infoBoxText={I18N_KEYS.INVITE_ONE_MEMBER_INFOBOX}/>);
};
