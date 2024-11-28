import React from "react";
import { useToast, VaultItemThumbnail } from "@dashlane/design-system";
import { Field, ItemType } from "@dashlane/hermes";
import { IdCard, VaultItemType } from "@dashlane/vault-contracts";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
import { logSelectVaultItem } from "../../../../../../libs/logs/events/vault/select-item";
import { useVaultItemDetailView } from "../../../../detail-views";
import { CopyIconButton } from "../../../../detail-views/credential-detail-view/form-fields/copy-icon-button";
import { useCopyAction } from "../../../../detail-views/credential-detail-view/useCopyAction";
import SearchEventLogger from "../../../../search-event-logger";
import { useSearchContext } from "../../../../search-field/search-context";
import { SectionRow } from "../../common";
export const I18N_KEYS = {
  ID_CARD_NUMBER_COPY:
    "tab/all_items/ids/id_card/detail_view/actions/copy_number",
  ID_CARD_NUMBER_COPIED:
    "tab/all_items/ids/id_card/detail_view/actions/number_copied_to_clipboard",
};
export interface Props {
  item: IdCard;
}
const IdCardComponent = ({ item }: Props) => {
  const { openDetailView } = useVaultItemDetailView();
  const { searchValue } = useSearchContext();
  const { id, idName, spaceId, idNumber } = item;
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const openIdCardDetailView = () => {
    logSelectVaultItem(id, ItemType.IdCard);
    if (searchValue !== "") {
      SearchEventLogger.logSearchEvent();
    }
    openDetailView(VaultItemType.IdCard, id);
  };
  const idCardNumberCopyAction = useCopyAction({
    toastString: translate(I18N_KEYS.ID_CARD_NUMBER_COPIED),
    showToast,
    itemType: VaultItemType.IdCard,
    field: Field.Number,
    itemId: id,
    isProtected: false,
    value: idNumber,
  });
  return (
    <SectionRow
      key={id}
      thumbnail={<VaultItemThumbnail type="id-card" />}
      itemSpaceId={spaceId}
      title={idName}
      subtitle={idNumber}
      onClick={openIdCardDetailView}
      actions={
        <CopyIconButton
          text={translate(I18N_KEYS.ID_CARD_NUMBER_COPY)}
          copyAction={() => {
            void idCardNumberCopyAction();
          }}
        />
      }
    />
  );
};
export const IdCardListItem = React.memo(IdCardComponent);
