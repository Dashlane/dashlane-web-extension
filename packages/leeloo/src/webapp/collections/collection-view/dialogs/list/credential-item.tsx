import { Credential } from "@dashlane/vault-contracts";
import { ConnectedDomainThumbnail } from "@dashlane/framework-react";
import { MouseEvent, useCallback, useMemo } from "react";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { SelectableCollectionListItem } from "./collection-list-item";
import { SelectableItemType } from "../../../../list-view/multi-select/multi-select-context";
export interface CredentialItemProps {
  credential: Credential;
  domain: string;
  isShared: boolean;
  isLimitedRight: boolean;
  isSharedCollection: boolean;
  onCheckCredential: (
    credentialId: string,
    type: SelectableItemType,
    event: MouseEvent
  ) => void;
}
export const CredentialItem = ({
  credential,
  domain,
  isShared,
  isLimitedRight,
  isSharedCollection,
  onCheckCredential,
}: CredentialItemProps) => {
  const { translate } = useTranslate();
  const { id, itemName, email, username } = credential;
  const text = email || username;
  const isDisabled = isSharedCollection && isLimitedRight;
  const toggleCredential = useCallback(
    (event: MouseEvent) =>
      onCheckCredential(credential.id, "credentials", event),
    [credential, onCheckCredential]
  );
  const thumbnail = useMemo(
    () => <ConnectedDomainThumbnail domainURL={domain} />,
    [domain]
  );
  return (
    <SelectableCollectionListItem
      type="credentials"
      id={id}
      title={itemName}
      description={text}
      isShared={isShared}
      isDisabled={isDisabled}
      isLimitedRight={isLimitedRight}
      onToggle={toggleCredential}
      tooltip={
        isSharedCollection &&
        isLimitedRight &&
        translate("webapp_collection_bulk_disabled_tooltip_limited_right")
      }
      thumbnail={thumbnail}
    />
  );
};
