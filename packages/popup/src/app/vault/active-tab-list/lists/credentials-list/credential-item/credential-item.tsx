import { memo, useMemo, useState } from "react";
import { jsx } from "@dashlane/design-system";
import { ConnectedDomainThumbnail } from "@dashlane/framework-react";
import { ParsedURL } from "@dashlane/url-parser";
import { Credential } from "@dashlane/vault-contracts";
import { useAreRichIconsEnabled } from "../../../../../../libs/hooks/use-are-rich-icons-enabled";
import { useIsUserFrozen } from "../../../../../../libs/hooks/use-is-user-frozen";
import { SectionRow } from "../../common";
import { CredentialActions } from "./credential-action/credential-actions";
export type CredentialItemOrigin = "list" | "search" | "suggested";
export interface CredentialItemComponentProps {
  credential: Credential;
  onOpenDetailsView: (id: string, origin: CredentialItemOrigin) => void;
  origin: CredentialItemOrigin;
}
const CredentialItemComponent = ({
  credential,
  onOpenDetailsView,
  origin,
}: CredentialItemComponentProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isUserFrozen } = useIsUserFrozen();
  const areRichIconsEnabled = useAreRichIconsEnabled();
  const closeDropdown = () => setIsDropdownOpen(false);
  const thumbnail = useMemo(
    () => (
      <ConnectedDomainThumbnail
        domainURL={new ParsedURL(credential.URL).getRootDomain()}
        forceFallback={!areRichIconsEnabled}
      />
    ),
    [areRichIconsEnabled, credential.URL]
  );
  return (
    <SectionRow
      thumbnail={thumbnail}
      itemSpaceId={credential.spaceId}
      title={credential.itemName}
      subtitle={credential.username || credential.email}
      onClick={() => onOpenDetailsView(credential.id, origin)}
      onRowLeave={closeDropdown}
      actions={
        !isUserFrozen ? (
          <CredentialActions
            credential={credential}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
          />
        ) : undefined
      }
    />
  );
};
export const CredentialItem = memo(CredentialItemComponent);
