import * as React from 'react';
import { ProtectedItemsUnlockerContext } from 'src/app/protected-items-unlocker/protected-items-unlocker-context';
const useProtectedItemsUnlocker = () => {
    return React.useContext(ProtectedItemsUnlockerContext);
};
export default useProtectedItemsUnlocker;
