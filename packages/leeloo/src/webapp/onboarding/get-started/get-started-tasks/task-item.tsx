import { jsx } from '@dashlane/design-system';
import { TaskStatus } from '../types';
import { TaskItemIcon } from './task-item-icon';
import { TaskItemMessage } from './task-item-message';
import { TaskItemAction } from './task-item-action';
import { TaskItemProps } from './types';
export const TaskItem = ({ title, icon, isLastItem, status, action, }: TaskItemProps) => {
    return (<div>
      <div sx={{
            display: 'grid',
            gridTemplateColumns: '40px 1fr auto',
            gap: '16px',
            alignItems: 'center',
        }}>
        <TaskItemIcon icon={icon} status={status}/>
        <TaskItemMessage status={status} title={title}/>
        {status !== TaskStatus.COMPLETED ? (<TaskItemAction status={status} action={action}/>) : null}
      </div>
      {!isLastItem ? (<div sx={{
                borderBottom: '1px solid ds.border.neutral.quiet.idle',
                marginBottom: '16px',
                paddingTop: '16px',
            }}/>) : null}
    </div>);
};
