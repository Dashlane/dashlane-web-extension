import { IconProps } from '@dashlane/design-system';
import { TaskAction, TaskStatus } from '../types';
export interface TaskItemProps {
    title: string;
    icon: IconProps['name'];
    isLastItem: boolean;
    status: TaskStatus;
    action: TaskAction;
}
