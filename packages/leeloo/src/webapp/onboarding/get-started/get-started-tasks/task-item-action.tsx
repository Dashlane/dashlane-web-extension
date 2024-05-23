import { Button, jsx, Paragraph } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { TaskAction, TaskStatus } from '../types';
const I18N_KEYS = { INSTALL_EXTENSION: 'onb_vault_get_started_task_disabled' };
export const TaskItemAction = ({ status, action, }: {
    status: TaskStatus;
    action: TaskAction;
}) => {
    const { translate } = useTranslate();
    return status === TaskStatus.IDLE ? (<Button mood="neutral" intensity="quiet" icon={action.icon} layout={action.layout} onClick={action.handler}>
      {translate(action.label)}
    </Button>) : (<Paragraph textStyle="ds.body.reduced.regular" color="ds.text.neutral.quiet">
      {translate(I18N_KEYS.INSTALL_EXTENSION)}
    </Paragraph>);
};
