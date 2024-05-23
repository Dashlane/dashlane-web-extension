import { jsx, Tooltip } from '@dashlane/ui-components';
import { PropsWithChildren } from 'react';
import { PendingNotification } from './pending-notification/PendingNotification';
export interface NewPendingEmailTooltipProps {
    email: string;
    handleOnClosePendingNotification: () => void;
}
export const NewPendingEmailTooltip = ({ children, email, handleOnClosePendingNotification, }: PropsWithChildren<NewPendingEmailTooltipProps>) => {
    return (<Tooltip data-testid="Pending notification tooltip" placement="bottom-start" trigger="persist" content={<PendingNotification email={email} handleOnDismiss={handleOnClosePendingNotification}/>} sx={{
            minWidth: '376px',
            bg: 'white',
            '> div': {
                borderColor: 'white',
            },
        }}>
      <div sx={{ width: 'min-content' }}>{children}</div>
    </Tooltip>);
};
