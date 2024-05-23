import { Lee } from 'lee';
export type DialogCallBack = (isShown: boolean) => void;
export interface IdDocumentProps {
    listRoute: string;
    id?: string;
    setDialogActive: DialogCallBack;
    lee: Lee;
    hasUnsavedData: boolean;
    setHasUnsavedData: (hasUnsavedData: boolean) => void;
}
