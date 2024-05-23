import { jsx } from '@dashlane/ui-components';
import { Fragment, PropsWithChildren } from 'react';
import { NewPendingEmailTooltip, NewPendingEmailTooltipProps, } from './new-pending-email-tooltip';
import { PendingEmailTooltip } from './pending-email-tooltip';
export type PendingEmailStatusWithTooltipsProps = NewPendingEmailTooltipProps & {
    showPendingTooltip: boolean;
    showPendingNotification: boolean;
    canEmailBeRemoved: boolean;
};
export const PendingEmailStatusWithTooltips = (props: PropsWithChildren<PendingEmailStatusWithTooltipsProps>) => {
    const { children, showPendingNotification, showPendingTooltip } = props;
    if (showPendingTooltip) {
        return <PendingEmailTooltip {...props}>{children}</PendingEmailTooltip>;
    }
    else if (showPendingNotification) {
        return (<NewPendingEmailTooltip {...props}>{children}</NewPendingEmailTooltip>);
    }
    else {
        return <>{children}</>;
    }
};
