import { ShareItemFailureReason } from "@dashlane/communication";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import {
  Credential,
  SecureNote,
  vaultItemsCrudApi,
  VaultItemType,
} from "@dashlane/vault-contracts";
import { TranslateFunction } from "../../../libs/i18n/types";
import useTranslate from "../../../libs/i18n/useTranslate";
import { DetailedItem } from "../../../libs/dashlane-style/detailed-item";
import { getCredentialLogo, itemSx } from "../item";
import { DetailedError } from "../types";
import { NoteIcon } from "../../note-icon";
function getSharingFailureMessage(
  translate: TranslateFunction,
  reason?: ShareItemFailureReason
): string {
  const { ITEM_DOESNT_EXIST, LIMIT_EXCEEDED } = ShareItemFailureReason;
  switch (reason) {
    case ITEM_DOESNT_EXIST:
      return translate("webapp_sharing_invite_item_not_found");
    case LIMIT_EXCEEDED:
      return translate("webapp_sharing_invite_limit_exceeded");
    default:
      return translate("webapp_sharing_invite_server_error");
  }
}
function renderCredentialErrorItem(
  credential: Credential,
  message: string
): JSX.Element {
  const logo = getCredentialLogo(credential.itemName, credential.URL);
  const { itemName, email, username } = credential;
  const text = email || username;
  const detailedItemParams = {
    title: itemName,
    text,
    logo,
    infoAction: message,
  };
  return <DetailedItem {...detailedItemParams} />;
}
function renderNoteErrorItem(note: SecureNote, message: string): JSX.Element {
  const logo = <NoteIcon noteType={note.color} />;
  const { title } = note;
  const detailedItemParams = { title, text: "", logo, infoAction: message };
  return <DetailedItem {...detailedItemParams} />;
}
interface CredentialProps {
  credentialId: string;
  detailedError: DetailedError;
}
export interface NoteProps {
  translate: TranslateFunction;
  detailedError: DetailedError;
  itemId: string;
}
export const CredentialError = (props: CredentialProps) => {
  const { credentialId, detailedError } = props;
  const { translate } = useTranslate();
  const { data, status } = useModuleQuery(vaultItemsCrudApi, "query", {
    vaultItemTypes: [VaultItemType.Credential],
    ids: [credentialId],
  });
  if (status !== DataStatus.Success) {
    return null;
  }
  const item = data?.credentialsResult.items[0];
  if (!item) {
    return (
      <li sx={itemSx}>{translate("webapp_sharing_invite_item_removed")}</li>
    );
  }
  const {
    itemId,
    result: { reason },
  } = detailedError;
  const message = getSharingFailureMessage(translate, reason);
  return (
    <li key={itemId} sx={itemSx}>
      {renderCredentialErrorItem(item, message)}
    </li>
  );
};
export const NoteError = (props: NoteProps) => {
  const { detailedError, translate, itemId } = props;
  const { data: secureNoteData, status } = useModuleQuery(
    vaultItemsCrudApi,
    "query",
    {
      vaultItemTypes: [VaultItemType.SecureNote],
      ids: [itemId],
    }
  );
  if (status !== DataStatus.Success) {
    return null;
  }
  const secureNotes = secureNoteData.secureNotesResult?.items;
  if (!secureNotes?.length) {
    return (
      <li sx={itemSx}>{translate("webapp_sharing_invite_item_removed")}</li>
    );
  }
  const {
    result: { reason },
  } = detailedError;
  const message = getSharingFailureMessage(translate, reason);
  return (
    <li key={secureNotes[0].id} sx={itemSx}>
      {renderNoteErrorItem(secureNotes[0], message)}
    </li>
  );
};
