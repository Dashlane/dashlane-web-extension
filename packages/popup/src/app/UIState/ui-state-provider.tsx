import React, { ReactNode } from "react";
import { UIStateStorageRepositoryProvider } from "./ui-state-storage-repository-context";
import { ActiveSectionTabProvider } from "../tabs/active-section-tab-context";
import { ActiveVaultTypeTabProvider } from "../vault/tabs-bar/active-vault-type-tab-context";
interface Provider {
  children: ReactNode;
}
const UIStateProvider = ({ children }: Provider) => (
  <UIStateStorageRepositoryProvider>
    <ActiveSectionTabProvider>
      <ActiveVaultTypeTabProvider>{children}</ActiveVaultTypeTabProvider>
    </ActiveSectionTabProvider>
  </UIStateStorageRepositoryProvider>
);
export default UIStateProvider;
