import { memo } from "react";
import { jsx } from "@dashlane/design-system";
import { DataStatus } from "@dashlane/framework-react";
import { Credential } from "@dashlane/vault-contracts";
import { useCredentialsDataByDomain } from "../../../../../../libs/api";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
import { Website } from "../../../../../../store/types";
import { SectionCard } from "../../common/components/section-card";
import { AddPasswordItem } from "../add-password-item/add-password-item";
import {
  CredentialItem,
  CredentialItemOrigin,
} from "../credential-item/credential-item";
import { sortAndMapCredentialsByDomain } from "./sort-and-map-credentials-by-domain";
interface SuggestedItemsListProps {
  website: Website;
  openCredentialDetailView: (
    id: string,
    origin: CredentialItemOrigin,
    listIndex?: number,
    listLength?: number
  ) => void;
}
const I18N_KEYS = {
  TITLE: "tab/all_items/suggested_item_section/title",
};
export const SuggestedItemsListComponent = ({
  website,
  openCredentialDetailView,
}: SuggestedItemsListProps) => {
  const { translate } = useTranslate();
  const suggestedItemsData = useCredentialsDataByDomain(website.domain);
  if (suggestedItemsData.status !== DataStatus.Success) {
    return null;
  }
  const { items } = suggestedItemsData.data;
  if (items.length === 0) {
    return (
      <SectionCard header={translate(I18N_KEYS.TITLE)}>
        <AddPasswordItem origin="suggested" website={website.fullUrl} />
      </SectionCard>
    );
  }
  const sortedCredentials = sortAndMapCredentialsByDomain(website, items);
  return (
    <SectionCard header={translate(I18N_KEYS.TITLE)}>
      <div>
        {sortedCredentials.map((credential: Credential, index: number) => (
          <CredentialItem
            key={credential.id}
            credential={credential}
            onOpenDetailsView={(id: string, origin: CredentialItemOrigin) =>
              openCredentialDetailView(
                id,
                origin,
                index + 1,
                sortedCredentials.length
              )
            }
            origin="suggested"
          />
        ))}
      </div>
    </SectionCard>
  );
};
export const SuggestedItemsList = memo(SuggestedItemsListComponent);
