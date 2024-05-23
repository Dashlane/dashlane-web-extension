import { ProtectedItemsUnlockRequest } from '../types';
export const useProtectedItemsUnlockDismiss = ({ unlockRequest, setUnlockRequest, }: ProtectedItemsUnlockRequest) => {
    const { cancelCallback } = unlockRequest;
    const handleDismiss = () => {
        cancelCallback?.();
        setUnlockRequest?.(null);
    };
    return {
        handleDismiss,
    };
};
