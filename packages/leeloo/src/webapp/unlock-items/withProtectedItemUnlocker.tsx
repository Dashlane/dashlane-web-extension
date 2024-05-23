import * as React from 'react';
import { ProtectedItemsUnlockerProps } from 'webapp/unlock-items/types';
import { useProtectedItemsUnlocker } from 'webapp/unlock-items/useProtectedItemsUnlocker';
export function withProtectedItemsUnlocker<Props>(Component: React.ComponentType<Props & ProtectedItemsUnlockerProps>): React.ComponentType<Props> {
    return (props) => {
        const unlockerProps = useProtectedItemsUnlocker();
        return <Component {...props} {...unlockerProps}/>;
    };
}
