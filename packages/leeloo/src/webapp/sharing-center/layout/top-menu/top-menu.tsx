import * as React from "react";
import { Origin } from "@dashlane/hermes";
import { Permission } from "@dashlane/sharing-contracts";
import { Connected as NotificationsDropdown } from "../../../bell-notifications/connected";
import { Header } from "../../../components/header/header";
import { HeaderAccountMenu } from "../../../components/header/header-account-menu";
import { SharingButton } from "../../../sharing-invite/sharing-button";
import { ItemsTabs, SharingInviteStep } from "../../../sharing-invite/types";
export const TopMenu = () => {
  return (
    <Header
      startWidgets={
        <SharingButton
          sharing={{
            permission: Permission.Limited,
            selectedCredentials: [],
            selectedGroups: [],
            selectedNotes: [],
            selectedUsers: [],
            selectedPrivateCollections: [],
            selectedSharedCollections: [],
            selectedSecrets: [],
            step: SharingInviteStep.Elements,
            tab: ItemsTabs.Passwords,
          }}
          origin={Origin.ItemListView}
        />
      }
      endWidget={
        <>
          <HeaderAccountMenu />
          <NotificationsDropdown />
        </>
      }
    />
  );
};
