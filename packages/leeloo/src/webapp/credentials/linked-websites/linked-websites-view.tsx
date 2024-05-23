import * as React from 'react';
import { Button, Icon, jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { LinkedWebsitesList } from './linked-websites-list';
import { ContentCard } from 'webapp/panel/standard/content-card';
import { Credential } from '@dashlane/vault-contracts';
const I18N_KEYS = {
    HEADER: 'webapp_credential_linked_websites_title',
    MAIN_WEBSITE: 'webapp_credential_linked_websites_section_primary',
    MAIN_WEBSITE_DESCRIPTION: 'webapp_credential_linked_websites_section_primary_description',
    USER_ADDED_LINKED_WEBSITES: 'webapp_credential_linked_websites_section_added_by_user',
    DASHLANE_ADDED_LINKED_WEBSITES: 'webapp_credential_linked_websites_section_added_by_dashlane',
    DASHLANE_ADDED_DESCRIPTION: 'webapp_credential_linked_websites_section_added_by_dashlane_description',
};
export interface LinkedWebsitesViewProps {
    credential: Credential;
    onClose: (event?: React.MouseEvent<HTMLElement>) => void;
    openWithNewUrlField: boolean;
    onUpdateLinkedWebsitesAddedByUser: (newList: string[]) => void;
    hasLimitedRights: boolean;
    dashlaneDefinedLinkedWebsites?: string[];
}
const LinkedWebsitesViewComponent = ({ credential, onClose, openWithNewUrlField, onUpdateLinkedWebsitesAddedByUser, hasLimitedRights, dashlaneDefinedLinkedWebsites, }: LinkedWebsitesViewProps) => {
    const { translate } = useTranslate();
    const [linkedWebsitesAddedByUser, setLinkedWebsitesAddedByUser] = React.useState(credential.linkedURLs);
    const [isEditing, setIsEditing] = React.useState(openWithNewUrlField);
    React.useEffect(() => {
        const savedLinkedWebsitesAddedByUser: string[] = credential.linkedURLs;
        const currentlyEditing = !(savedLinkedWebsitesAddedByUser.length ===
            linkedWebsitesAddedByUser.length &&
            savedLinkedWebsitesAddedByUser.every((website, index) => linkedWebsitesAddedByUser[index] === website));
        setIsEditing(currentlyEditing);
        onUpdateLinkedWebsitesAddedByUser(linkedWebsitesAddedByUser);
    }, [linkedWebsitesAddedByUser]);
    return (<div data-testid="linked-websites-tab">
      <Button data-testid="back-button" layout="iconLeading" mood="neutral" intensity="supershy" onClick={onClose} icon={<Icon name="ArrowLeftOutlined"/>}>
        {translate(I18N_KEYS.HEADER)}
      </Button>

      <ContentCard title={translate(I18N_KEYS.MAIN_WEBSITE)} description={translate(I18N_KEYS.MAIN_WEBSITE_DESCRIPTION)} additionalSx={{ marginTop: '24px' }}>
        <LinkedWebsitesList linkedWebsitesList={[credential.URL]} areItemsLocked={hasLimitedRights} credentialId={credential.id} isEditing={false}/>
      </ContentCard>

      <ContentCard title={translate(I18N_KEYS.USER_ADDED_LINKED_WEBSITES)} additionalSx={{ marginTop: '16px' }}>
        <LinkedWebsitesList linkedWebsitesList={linkedWebsitesAddedByUser} areItemsLocked={hasLimitedRights} credentialId={credential.id} isListEditable={!hasLimitedRights} isEditing={isEditing} showUrlProtocol={true} updateLinkedWebsitesList={setLinkedWebsitesAddedByUser}/>
      </ContentCard>

      {dashlaneDefinedLinkedWebsites &&
            dashlaneDefinedLinkedWebsites.length > 1 ? (<ContentCard title={translate(I18N_KEYS.DASHLANE_ADDED_LINKED_WEBSITES)} description={translate(I18N_KEYS.DASHLANE_ADDED_DESCRIPTION)} additionalSx={{ marginTop: '16px' }}>
          <LinkedWebsitesList linkedWebsitesList={dashlaneDefinedLinkedWebsites} areItemsLocked={true} credentialId={credential.id} isEditing={false}/>
        </ContentCard>) : null}
    </div>);
};
export const LinkedWebsitesView = React.memo(LinkedWebsitesViewComponent);
