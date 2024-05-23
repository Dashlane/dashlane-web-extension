import { RequestStatus } from '@dashlane/communication';
interface AdminAssistedARUnset {
    processStatus: 'UNSET';
}
interface AdminAssistedARError {
    processStatus: 'ERROR';
}
interface AdminAssistedARPending {
    processStatus: 'PENDING';
    requestStatus: RequestStatus;
}
export type AdminAssistedARStatus = AdminAssistedARUnset | AdminAssistedARError | AdminAssistedARPending;
