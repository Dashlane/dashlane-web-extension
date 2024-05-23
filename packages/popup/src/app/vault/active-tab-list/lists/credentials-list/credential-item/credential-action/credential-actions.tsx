import React from 'react';
import { jsx } from '@dashlane/design-system';
import { Credential } from '@dashlane/vault-contracts';
import { CopyDropdownAction } from './copy-dropdown-action/copy-dropdown-action';
import { GoToWebsiteAction } from './go-to-website-action/go-to-website-action';
interface Props {
    credential: Credential;
    isDropdownOpen: boolean;
    setIsDropdownOpen: (value: boolean) => void;
}
const CredentialActionsComponent = ({ credential, isDropdownOpen, setIsDropdownOpen, }: Props) => {
    return (<div sx={{ display: 'flex', gap: '2px' }}>
      <CopyDropdownAction key="actions/copy_password" credential={credential} isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen}/>

      <GoToWebsiteAction id={credential.id} URL={credential.URL}/>
    </div>);
};
export const CredentialActions = React.memo(CredentialActionsComponent);
