import { Secret } from "@dashlane/vault-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { ItemNotFound, ShareInviteItem } from "../item";
import { InfiniteScrollList } from "../../pagination/infinite-scroll-list";
import {
  useMultiselectContext,
  useMultiselectHandler,
} from "../../list-view/multi-select/multi-select-context";
const I18N_KEYS = {
  NO_SECRETS: "webapp_sharing_invite_no_secrets_found",
  NO_SELECTED: "webapp_sharing_invite_no_selected_secrets_found",
};
export interface Props {
  freeLimitReached: boolean;
  elementsOnlyShowSelected: boolean;
  secrets: Secret[];
  secretsMatchCount: number;
  setPageNumber: (pageNumber: number) => void;
}
export const SecretsList = ({
  freeLimitReached,
  elementsOnlyShowSelected,
  secrets,
  secretsMatchCount,
  setPageNumber,
}: Props) => {
  const { translate } = useTranslate();
  const { isSelected } = useMultiselectContext();
  const onSelectItem = useMultiselectHandler(secrets);
  if (!secrets?.length) {
    const copy = elementsOnlyShowSelected
      ? translate(I18N_KEYS.NO_SELECTED)
      : translate(I18N_KEYS.NO_SECRETS);
    return <ItemNotFound text={copy} />;
  }
  const hasMore = secrets.length < secretsMatchCount;
  return (
    <InfiniteScrollList onNextPage={setPageNumber} hasMore={hasMore}>
      {secrets.map((secret: Secret) => {
        const checked = isSelected(secret.id, "secrets");
        if (!secret || (elementsOnlyShowSelected && !checked)) {
          return null;
        }
        return (
          <ShareInviteItem
            key={secret.id}
            id={secret.id}
            checked={checked}
            freeLimitReached={freeLimitReached}
            title={secret.title}
            hasAttachments={secret.attachments && secret.attachments.length > 0}
            type={"secrets"}
            onSelectItem={onSelectItem}
          />
        );
      })}
    </InfiniteScrollList>
  );
};
