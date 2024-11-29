import { useCallback, useMemo } from "react";
import { Credential } from "@dashlane/vault-contracts";
import { ParsedURL } from "@dashlane/url-parser";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { CredentialItem } from "./credential-item";
import { CollectionDialogList, Permissions } from "./collection-dialog-list";
import { useMultiselectHandler } from "../../../../list-view/multi-select/multi-select-context";
interface Props {
  credentials: Credential[];
  matchCount: number;
  setPageNumber: (pageNumber: number) => void;
  isSharedCollection: boolean;
}
export const CredentialsCollectionDialogList = (props: Props) => {
  const { credentials, matchCount, setPageNumber, isSharedCollection } = props;
  const onCheckCredential = useMultiselectHandler(credentials);
  const { translate } = useTranslate();
  const credentialDomains = useMemo(() => {
    return credentials.map((credential) =>
      new ParsedURL(credential.URL).getRootDomain()
    );
  }, [credentials]);
  const handleRenderItem = useCallback(
    (
      credential: Credential,
      index: number,
      { isShared, isLimitedRight }: Permissions
    ) => (
      <CredentialItem
        key={credential.id}
        credential={credential}
        domain={credentialDomains[index]}
        isShared={isShared}
        isLimitedRight={isLimitedRight}
        isSharedCollection={isSharedCollection}
        onCheckCredential={onCheckCredential}
      />
    ),
    [credentialDomains, isSharedCollection, onCheckCredential]
  );
  return (
    <CollectionDialogList
      items={credentials}
      matchCount={matchCount}
      notFoundText={translate("webapp_sharing_invite_no_credentials_found")}
      setPageNumber={setPageNumber}
      renderItem={handleRenderItem}
    />
  );
};
