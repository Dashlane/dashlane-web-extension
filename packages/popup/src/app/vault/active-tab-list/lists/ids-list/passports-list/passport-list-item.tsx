import React from "react";
import { useToast, VaultItemThumbnail } from "@dashlane/design-system";
import { Field, ItemType } from "@dashlane/hermes";
import { Passport, VaultItemType } from "@dashlane/vault-contracts";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
import { logSelectVaultItem } from "../../../../../../libs/logs/events/vault/select-item";
import { useVaultItemDetailView } from "../../../../detail-views";
import { CopyIconButton } from "../../../../detail-views/credential-detail-view/form-fields/copy-icon-button";
import { useCopyAction } from "../../../../detail-views/credential-detail-view/useCopyAction";
import SearchEventLogger from "../../../../search-event-logger";
import { useSearchContext } from "../../../../search-field/search-context";
import { SectionRow } from "../../common";
export const I18N_KEYS = {
  PASSPORT_NUMBER_COPY:
    "tab/all_items/ids/passport/detail_view/actions/copy_number",
  PASSPORT_NUMBER_COPIED:
    "tab/all_items/ids/passport/detail_view/actions/number_copied_to_clipboard",
};
export interface Props {
  item: Passport;
}
const PassportComponent = ({ item }: Props) => {
  const { openDetailView } = useVaultItemDetailView();
  const { searchValue } = useSearchContext();
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const { id, idName, spaceId, idNumber } = item;
  const openPassportDetailView = () => {
    logSelectVaultItem(id, ItemType.Passport);
    if (searchValue !== "") {
      SearchEventLogger.logSearchEvent();
    }
    openDetailView(VaultItemType.Passport, id);
  };
  const passportNumberCopyAction = useCopyAction({
    toastString: translate(I18N_KEYS.PASSPORT_NUMBER_COPIED),
    showToast,
    itemType: VaultItemType.Passport,
    field: Field.Password,
    itemId: id,
    isProtected: false,
    value: idNumber,
  });
  return (
    <SectionRow
      key={id}
      thumbnail={<VaultItemThumbnail type="passport" />}
      itemSpaceId={spaceId}
      title={idName}
      subtitle={idNumber}
      onClick={openPassportDetailView}
      actions={
        <CopyIconButton
          text={translate(I18N_KEYS.PASSPORT_NUMBER_COPY)}
          copyAction={() => {
            void passportNumberCopyAction();
          }}
        />
      }
    />
  );
};
export const PassportListItem = React.memo(PassportComponent);
