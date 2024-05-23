import React, { ReactNode } from 'react';
import { UIStateStorageRepositoryProvider } from './ui-state-storage-repository-context';
import { ActiveTabProvider } from '../tabs/ActiveTabContext';
import { ActiveTabInfoProvider as VaultActiveTabInfoProvider } from '../vault/tabs-bar/active-tab-info-context';
interface Provider {
    children: ReactNode;
}
const UIStateProvider = ({ children }: Provider) => (<UIStateStorageRepositoryProvider>
    <ActiveTabProvider>
      <VaultActiveTabInfoProvider>{children}</VaultActiveTabInfoProvider>
    </ActiveTabProvider>
  </UIStateStorageRepositoryProvider>);
export default UIStateProvider;
