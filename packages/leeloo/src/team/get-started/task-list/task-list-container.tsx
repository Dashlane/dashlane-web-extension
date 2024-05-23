import { jsx } from '@dashlane/design-system';
import { FlexContainer } from '@dashlane/ui-components';
import { TaskListItem } from '../hooks/use-task-list';
import { TasksList } from './task-list';
export interface TaskListContainerProps {
    upNextTask: TaskListItem | null;
    toDoTasks: TaskListItem[];
    completedTasks: TaskListItem[];
}
export const TaskListContainer = ({ upNextTask, toDoTasks, completedTasks, }: TaskListContainerProps) => {
    return (<FlexContainer flexDirection="column">
      <TasksList completed={false} tasks={upNextTask ? [upNextTask] : []} isUpNext={true}/>
      <TasksList completed={false} tasks={toDoTasks} isUpNext={false}/>
      <TasksList completed={true} tasks={completedTasks} isUpNext={false}/>
    </FlexContainer>);
};
