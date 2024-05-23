import React from 'react';
import { ChangedValues } from 'webapp/personal-data/edit/form/common';
import { LinkedWebsitesList } from '../../linked-websites/linked-websites-list';
import { WebsitesComponent } from './websites-component';
interface Props {
    url: string;
    hasUrlError: boolean;
    handleMainWebsiteChange: (eventOrValue: React.ChangeEvent<any> | any, key?: string) => void;
    handleChanges: (changedValues: ChangedValues) => void;
    handleGoToWebsite: () => void;
}
export const CredentialCreationWebsitesComponent = ({ url, hasUrlError, handleMainWebsiteChange, handleChanges, handleGoToWebsite, }: Props) => {
    const [isEditingLinkedWebsites, setIsEditingLinkedwebsites] = React.useState(false);
    const [linkedWebsitesAddedByUser, setLinkedWebsitesAddedByUser] = React.useState<string[]>([]);
    React.useEffect(() => {
        if (linkedWebsitesAddedByUser.length) {
            setIsEditingLinkedwebsites(true);
        }
        handleChanges({
            linkedURLs: linkedWebsitesAddedByUser,
        });
    }, [linkedWebsitesAddedByUser]);
    return (<WebsitesComponent url={url} hasUrlError={hasUrlError} isWebsiteFieldReadonly={false} editViewButtonEnabled={false} handleMainWebsiteChange={handleMainWebsiteChange} handleGoToWebsite={handleGoToWebsite}>
      <LinkedWebsitesList linkedWebsitesList={linkedWebsitesAddedByUser} areItemsLocked={false} credentialId={''} isListEditable={true} isEditing={isEditingLinkedWebsites} showUrlProtocol={true} updateLinkedWebsitesList={setLinkedWebsitesAddedByUser}/>
    </WebsitesComponent>);
};
