import { Credential } from "@dashlane/vault-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { ItemNotFound, ShareInviteItem } from "../item";
import { InfiniteScrollList } from "../../pagination/infinite-scroll-list";
import {
  useMultiselectContext,
  useMultiselectHandler,
} from "../../list-view/multi-select/multi-select-context";
const I18N_KEYS = {
  NO_CREDENTIALS: "webapp_sharing_invite_no_credentials_found",
  NO_SELECTED: "webapp_sharing_invite_no_selected_credentials_found",
};
export interface Props {
  elementsOnlyShowSelected: boolean;
  credentials: Credential[];
  credentialsMatchCount: number;
  setPageNumber: (pageNumber: number) => void;
}
export const ShareInviteCredentialsList = (props: Props) => {
  const {
    elementsOnlyShowSelected,
    credentials,
    credentialsMatchCount,
    setPageNumber,
  } = props;
  const { translate } = useTranslate();
  const { isSelected } = useMultiselectContext();
  const onSelectItem = useMultiselectHandler(credentials);
  const renderNoCredentialsFound = (): JSX.Element => {
    const copy = elementsOnlyShowSelected
      ? translate(I18N_KEYS.NO_SELECTED)
      : translate(I18N_KEYS.NO_CREDENTIALS);
    return <ItemNotFound text={copy} />;
  };
  if (!credentials.length) {
    return renderNoCredentialsFound();
  }
  const hasMore = credentials.length < credentialsMatchCount;
  return (
    <InfiniteScrollList onNextPage={setPageNumber} hasMore={hasMore}>
      {credentials?.map((credential: Credential) => {
        const checked = isSelected(credential.id, "credentials");
        if (!credential || (elementsOnlyShowSelected && !checked)) {
          return null;
        }
        const { id, itemName, email, username, URL } = credential;
        const text = email || username;
        return (
          <ShareInviteItem
            checked={checked}
            id={id}
            key={id}
            text={text}
            title={itemName}
            type={"credentials"}
            url={URL}
            onSelectItem={onSelectItem}
          />
        );
      })}
    </InfiniteScrollList>
  );
};
