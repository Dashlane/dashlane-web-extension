import { Fragment } from 'react';
import { Heading, jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { TaskListItem } from '../hooks/use-task-list';
import { renderGetStartedTask } from '../helpers/render-get-started-task';
const I18N_KEYS = {
    TODO_TITLE: 'team_get_started_tasks_title',
    COMPLETED_TITLE: 'team_get_started_completed_tasks_title',
};
interface TaskListProps {
    isUpNext: boolean;
    tasks: TaskListItem[];
    completed: boolean;
}
export const TasksList = ({ tasks, completed, isUpNext }: TaskListProps) => {
    const { translate } = useTranslate();
    if (!tasks.length) {
        return null;
    }
    const heading = isUpNext ? null : (<Heading as="h2" textStyle="ds.title.section.medium" sx={{ marginTop: '16px', marginBottom: '8px' }}>
      {translate(completed ? I18N_KEYS.COMPLETED_TITLE : I18N_KEYS.TODO_TITLE)}
    </Heading>);
    return (<>
      {heading}
      {tasks.map((task) => completed === task.isCompleted
            ? renderGetStartedTask({ isUpNext, ...task })
            : null)}
    </>);
};
