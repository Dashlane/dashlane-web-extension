import { Icon, jsx } from '@dashlane/design-system';
import { TaskItemProps } from './types';
import { TaskStatus } from '../types';
export const TaskItemIcon = ({ icon, status, }: {
    icon: TaskItemProps['icon'];
    status: TaskStatus;
}) => {
    return (<div sx={{
            borderRadius: '8px',
            backgroundColor: status === TaskStatus.IDLE
                ? 'ds.container.expressive.brand.quiet.disabled'
                : 'ds.container.expressive.neutral.catchy.disabled',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '40px',
            width: '40px',
        }}>
      <Icon size="medium" name={status === TaskStatus.COMPLETED ? 'CheckmarkOutlined' : icon} color={status === TaskStatus.IDLE
            ? 'ds.text.brand.standard'
            : 'ds.text.neutral.quiet'}/>
    </div>);
};
