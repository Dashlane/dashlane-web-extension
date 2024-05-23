import { jsx } from '@dashlane/design-system';
import { VaultHeader } from 'webapp/components/header/vault-header';
export const PasskeysHeader = () => {
    return (<VaultHeader tooltipPassThrough={false} tooltipContent={''} handleAddNew={(e) => {
            return;
        }} addNewDisabled={true} shareButtonElement={null} shouldDisplayNewAccountImportButton={false} shouldDisplayAddButton={false}/>);
};
