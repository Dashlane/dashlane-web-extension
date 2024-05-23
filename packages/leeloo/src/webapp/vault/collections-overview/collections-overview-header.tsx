import React, { useState } from 'react';
import { VaultHeader } from 'webapp/components/header/vault-header';
import { CreateDialog } from '../collection-view/dialogs';
export const CollectionsOverviewHeader = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (<>
      <VaultHeader handleAddNew={() => setIsOpen(true)} shouldDisplayAddButton={true} shouldDisplayNewAccountImportButton={false}/>
      {isOpen && <CreateDialog onClose={() => setIsOpen(false)}/>}
    </>);
};
