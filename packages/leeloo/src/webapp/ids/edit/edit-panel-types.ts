import { Country } from '@dashlane/vault-contracts';
import { IdItem, IdVaultItemType } from '../types';
interface EditChildProps {
    handleCopy: (success: boolean, error: Error | undefined) => void;
    values: IdItem;
}
export type EditPanelChildren = ({ handleCopy, values, }: EditChildProps) => JSX.Element;
export interface ItemProps {
    itemId: string;
    type: IdVaultItemType;
    item: IdItem;
}
export interface EditAndDeleteProps {
    editAlertTranslation: string;
    deleteAlertTranslation: string;
    deleteDialogTitle: string;
    reportError: (error: Error, message: string) => void;
}
export interface FormProps {
    initialValues: IdItem;
    hasUnsavedData: boolean;
    setHasUnsavedData: (has: boolean) => void;
    children: EditPanelChildren;
    listRoute: string;
    copySuccessKey: string;
}
export interface WithDeleteModalProps {
    showConfirmDelete: boolean;
    openConfirmDeleteDialog: () => void;
    closeConfirmDeleteDialog: () => void;
}
export type EditPanelProps = ItemProps & WithDeleteModalProps & EditAndDeleteProps & FormProps & {
    getDescription: (country: Country) => string;
    title: string;
};
