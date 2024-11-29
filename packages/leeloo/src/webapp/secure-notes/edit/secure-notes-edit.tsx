import React from "react";
import { Redirect } from "react-router-dom";
import { GroupRecipient, UserRecipient } from "@dashlane/communication";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { vaultItemsCrudApi, VaultItemType } from "@dashlane/vault-contracts";
import { useRouterGlobalSettingsContext } from "../../../libs/router";
import { PreviousPage, previousRoute } from "../../routes";
import { SecureNotesEditGrapheneComponent } from "./secore-notes-edit-graphene-component";
interface State {
  previousPage?: PreviousPage;
  entity: UserRecipient | GroupRecipient;
}
interface Props {
  match: {
    params: {
      uuid: string;
    };
  };
  location?: {
    pathname: string;
    state: State;
  };
  onClose: () => void;
}
export const SecureNotesEdit = (props: Props) => {
  const secureNoteData = useModuleQuery(vaultItemsCrudApi, "query", {
    vaultItemTypes: [VaultItemType.SecureNote],
    ids: [`{${props.match.params.uuid}}`],
  });
  const { routes } = useRouterGlobalSettingsContext();
  if (secureNoteData.status === DataStatus.Loading) {
    return null;
  }
  if (!secureNoteData.data?.secureNotesResult.items.length) {
    if (!props.location?.state) {
      return <Redirect to={routes.userSecureNotes} />;
    }
    return <Redirect to={previousRoute(props.location?.state, routes)} />;
  }
  return (
    <SecureNotesEditGrapheneComponent
      {...props}
      note={secureNoteData.data.secureNotesResult.items[0]}
    />
  );
};
