import React from 'react';
import { Credential, VaultItemType } from '@dashlane/vault-contracts';
import { ActionsDropdown } from '../../../../common';
import { LoginAndEmailDropdownElement, OTPDropdownElement, PasswordDropdownElement, SecondaryLoginDropdownElement, } from './dropdown-elements';
export interface CopyDropdownActionProps {
    credential: Credential;
    isDropdownOpen: boolean;
    setIsDropdownOpen: (value: boolean) => void;
}
export const CopyDropdownAction = ({ credential, isDropdownOpen, setIsDropdownOpen, }: CopyDropdownActionProps) => {
    const isDisabled = !credential.password && !credential.email && !credential.username;
    return (<ActionsDropdown isDisabled={isDisabled} isOpen={isDropdownOpen} setIsOpen={setIsDropdownOpen} itemType={VaultItemType.Credential}>
      <>
        <PasswordDropdownElement key="pw" credential={credential}/>
        <LoginAndEmailDropdownElement key="login-email" credential={credential}/>
        <SecondaryLoginDropdownElement key="secondary-login" credentialId={credential.id}/>
        <OTPDropdownElement key="otp" credentialId={credential.id}/>
      </>
    </ActionsDropdown>);
};
