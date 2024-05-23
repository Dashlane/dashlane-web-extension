export enum ImportDataStep {
    IDLE = 'idle',
    PROCESSING = 'processing',
    ERROR_GENERIC = 'error',
    SUCCESS = 'success'
}
interface IdleState {
    status: ImportDataStep.IDLE;
}
interface ProcessingState {
    status: ImportDataStep.PROCESSING;
    name: string;
}
interface ErrorState {
    status: ImportDataStep.ERROR_GENERIC;
    name: string;
}
export interface SuccessState {
    status: ImportDataStep.SUCCESS;
    name: string;
    totalCredentials: number;
    duplicateCredentials: number;
    importedCredentials: number;
}
export type ImportDataState = IdleState | ProcessingState | ErrorState | SuccessState;
