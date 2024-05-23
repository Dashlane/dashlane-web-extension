import React, { memo, useEffect, useState } from 'react';
import { FocusOn } from 'react-focus-on';
import { CSSTransition } from 'react-transition-group';
import { PageView } from '@dashlane/hermes';
import { jsx } from '@dashlane/ui-components';
import { useModuleQuery } from '@dashlane/framework-react';
import { Credential, vaultItemsCrudApi, VaultItemType, } from '@dashlane/vault-contracts';
import { linkedWebsitesApi } from '@dashlane/autofill-contracts';
import { logPageView } from 'src/libs/logs/logEvent';
import { DataStatus } from 'libs/api/types';
import Modal from 'src/components/modal';
import { CredentialDetailForm } from 'src/app/vault/detail-views/credential-detail-view/credential-detail-form';
import { CredentialDetailHeader } from 'src/app/vault/detail-views/credential-detail-view/credential-detail-header';
import { LinkedWebsitesHeader } from './linked-websites-detail-view/linked-websites-header';
import { LinkedWebsitesFormView } from './linked-websites-detail-view/linked-websites-view-form';
import linkedWebsitesTransition from './linked-websites-transition.css';
interface CredentialDetailViewProps {
    onClose: () => void;
    itemId: string;
}
interface ComponentProps {
    onClose: () => void;
    credential: Credential;
}
const CredentialDetailViewComponent = ({ onClose, credential, }: ComponentProps) => {
    const [showLinkedWebsites, setShowLinkedWebsites] = useState(false);
    const [isLinkedWebsitesModalVisible, setIsLinkedWebsitesModalVisible] = useState(false);
    useEffect(() => {
        logPageView(PageView.ItemCredentialDetails);
    }, []);
    useEffect(() => {
        if (showLinkedWebsites) {
            setIsLinkedWebsitesModalVisible(true);
        }
    }, [showLinkedWebsites]);
    const { status, data } = useModuleQuery(linkedWebsitesApi, 'getDashlaneDefinedLinkedWebsites', {
        url: credential.URL,
    });
    if (status !== DataStatus.Success) {
        return null;
    }
    const openLinkedWebsitesView = () => {
        setShowLinkedWebsites(true);
    };
    const removeLinkedWebsitesViewModal = () => {
        setIsLinkedWebsitesModalVisible(false);
    };
    return (<>
      <CredentialDetailHeader credential={credential} onClose={onClose}/>
      <CredentialDetailForm credential={credential} dashlaneDefinedLinkedWebsites={data} openLinkedWebsites={openLinkedWebsitesView}/>

      <Modal visible={isLinkedWebsitesModalVisible} onClose={removeLinkedWebsitesViewModal} className={linkedWebsitesTransition.linkedWebsites}>
        <FocusOn>
          <CSSTransition in={showLinkedWebsites} timeout={500} classNames={{ ...linkedWebsitesTransition }} onExited={removeLinkedWebsitesViewModal} appear>
            <LinkedWebsitesHeader credentialId={credential.id} onClose={() => setShowLinkedWebsites(false)}/>
          </CSSTransition>
          <CSSTransition in={showLinkedWebsites} timeout={500} classNames={{ ...linkedWebsitesTransition }} onExited={removeLinkedWebsitesViewModal} appear>
            <LinkedWebsitesFormView credential={credential} dashlaneDefinedLinkedWebsites={data}/>
          </CSSTransition>
        </FocusOn>
      </Modal>
    </>);
};
export const CredentialDetailView = memo((props: CredentialDetailViewProps) => {
    const { status, data } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.Credential],
        ids: [props.itemId],
    });
    if (status !== DataStatus.Success || !data.credentialsResult.items.length) {
        return null;
    }
    return (<CredentialDetailViewComponent credential={data.credentialsResult.items[0]} {...props}/>);
});
