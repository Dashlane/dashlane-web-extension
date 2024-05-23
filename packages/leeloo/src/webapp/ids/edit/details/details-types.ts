import { Country } from '@dashlane/communication';
import { EditAndDeleteProps, FormProps, ItemProps, WithDeleteModalProps, } from '../edit-panel-types';
export type DetailTabPaneProps = ItemProps & WithDeleteModalProps & EditAndDeleteProps & FormProps & {
    setCurrentCountry: (country: Country) => void;
    hasTabs: boolean;
    focusAttachment: () => void;
    cleanActiveTab: () => void;
    showListView: () => void;
};
