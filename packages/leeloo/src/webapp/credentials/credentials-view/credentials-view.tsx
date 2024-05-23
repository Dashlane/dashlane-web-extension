import React from 'react';
import { Lee } from 'lee';
import { DialogContextProvider } from 'webapp/dialog';
import { PersonalDataSectionView } from 'webapp/personal-data-section-view/personal-data-section-view';
import { MultiselectProvider } from 'webapp/credentials/list/multi-select';
import { CredentialsListView } from '../list/credentials-list-view';
import { SavedCredentialNotification } from './saved-credential-notification';
import { CredentialsHeader } from './credentials-header';
import { CredentialsProvider } from './credentials-context';
import { HasCredentialsProvider } from './has-credentials-context';
interface Props {
    lee: Lee;
}
const DIALOG_ID = 'dashlane-credentials-dialog';
export const CredentialsView = ({ lee }: Props) => (<CredentialsProvider>
    <HasCredentialsProvider>
      
      <div id={DIALOG_ID}/>
      <DialogContextProvider dialogId={DIALOG_ID}>
        <MultiselectProvider>
          <PersonalDataSectionView>
            <CredentialsHeader />
            <SavedCredentialNotification lee={lee}/>
            <CredentialsListView />
          </PersonalDataSectionView>
        </MultiselectProvider>
      </DialogContextProvider>
    </HasCredentialsProvider>
  </CredentialsProvider>);
