import * as React from 'react';
import { ProtectedItemsUnlockerContext } from 'webapp/unlock-items/protected-items-unlocker-provider';
export function useProtectedItemsUnlocker() {
    return React.useContext(ProtectedItemsUnlockerContext);
}
