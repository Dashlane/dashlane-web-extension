import React from 'react';
import { TaskCard } from '../task-card/task-card';
import TaskGraphicOne from './images/task_graphic_1.png';
import { GetStartedTaskProps } from './types';
const I18N_KEYS = {
    CREATE_ACCOUNT_TITLE: 'team_get_started_create_account_title',
    CREATE_ACCOUNT_CONTENT: 'team_get_started_create_account_content',
    CREATE_ACCOUNT_CTA: 'team_get_started_visit_vault_cta',
};
export const CreateAccountTask = ({ isUpNext }: GetStartedTaskProps) => {
    return (<TaskCard isUpNext={isUpNext} upNextImage={<img alt="" src={TaskGraphicOne}/>} isCompleted={true} title={I18N_KEYS.CREATE_ACCOUNT_TITLE} content={I18N_KEYS.CREATE_ACCOUNT_CONTENT} helpDocLink={''} ctaOnClick={() => { }} ctaText={I18N_KEYS.CREATE_ACCOUNT_CTA}/>);
};
