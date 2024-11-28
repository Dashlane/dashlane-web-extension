import React from "react";
import { useToast, VaultItemThumbnail } from "@dashlane/design-system";
import { Field, ItemType } from "@dashlane/hermes";
import { FiscalId, VaultItemType } from "@dashlane/vault-contracts";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
import { logSelectVaultItem } from "../../../../../../libs/logs/events/vault/select-item";
import { useVaultItemDetailView } from "../../../../detail-views";
import { CopyIconButton } from "../../../../detail-views/credential-detail-view/form-fields/copy-icon-button";
import { useCopyAction } from "../../../../detail-views/credential-detail-view/useCopyAction";
import SearchEventLogger from "../../../../search-event-logger";
import { useSearchContext } from "../../../../search-field/search-context";
import { SectionRow } from "../../common";
export const I18N_KEYS = {
  FISCAL_ID_NUMBER_COPY:
    "tab/all_items/ids/fiscal_id/detail_view/actions/copy_number",
  FISCAL_ID_NUMBER_COPIED:
    "tab/all_items/ids/fiscal_id/detail_view/actions/copied_clipboard",
};
export interface Props {
  item: FiscalId;
}
const FiscalIdComponent = ({ item }: Props) => {
  const { openDetailView } = useVaultItemDetailView();
  const { searchValue } = useSearchContext();
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const { id, spaceId, fiscalNumber } = item;
  const openFiscalIdDetailView = () => {
    logSelectVaultItem(id, ItemType.FiscalStatement);
    if (searchValue !== "") {
      SearchEventLogger.logSearchEvent();
    }
    openDetailView(VaultItemType.FiscalId, id);
  };
  const fiscalIdNumberCopyAction = useCopyAction({
    toastString: translate(I18N_KEYS.FISCAL_ID_NUMBER_COPIED),
    showToast,
    itemType: VaultItemType.FiscalId,
    field: Field.FiscalNumber,
    itemId: id,
    isProtected: false,
    value: fiscalNumber,
  });
  return (
    <SectionRow
      key={id}
      thumbnail={<VaultItemThumbnail type="tax-number" />}
      itemSpaceId={spaceId}
      title={fiscalNumber}
      onClick={openFiscalIdDetailView}
      actions={
        <CopyIconButton
          text={translate(I18N_KEYS.FISCAL_ID_NUMBER_COPY)}
          copyAction={() => {
            void fiscalIdNumberCopyAction();
          }}
        />
      }
    />
  );
};
export const FiscalIdListItem = React.memo(FiscalIdComponent);
