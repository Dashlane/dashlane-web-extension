import React from "react";
import { useToast, VaultItemThumbnail } from "@dashlane/design-system";
import { Field, ItemType } from "@dashlane/hermes";
import { DriversLicense, VaultItemType } from "@dashlane/vault-contracts";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
import { logSelectVaultItem } from "../../../../../../libs/logs/events/vault/select-item";
import { useVaultItemDetailView } from "../../../../detail-views";
import { CopyIconButton } from "../../../../detail-views/credential-detail-view/form-fields/copy-icon-button";
import { useCopyAction } from "../../../../detail-views/credential-detail-view/useCopyAction";
import SearchEventLogger from "../../../../search-event-logger";
import { useSearchContext } from "../../../../search-field/search-context";
import { SectionRow } from "../../common";
export interface Props {
  item: DriversLicense;
}
export const I18N_ACTION_KEYS = {
  NUMBER_COPY:
    "tab/all_items/ids/driver_license/detail_view/actions/copy_number",
  NUMBER_COPIED:
    "tab/all_items/ids/driver_license/detail_view/actions/number_copied_to_clipboard",
};
const DriverLicenseComponent = ({ item }: Props) => {
  const { openDetailView } = useVaultItemDetailView();
  const { searchValue } = useSearchContext();
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const { id, idName, spaceId, idNumber } = item;
  const driverLicenseNumberCopyAction = useCopyAction({
    showToast,
    itemType: VaultItemType.DriversLicense,
    itemId: id,
    isProtected: false,
    toastString: translate(I18N_ACTION_KEYS.NUMBER_COPIED),
    field: Field.Number,
    value: idNumber,
  });
  const openDriverLicenseDetailView = () => {
    logSelectVaultItem(id, ItemType.DriverLicence);
    if (searchValue !== "") {
      SearchEventLogger.logSearchEvent();
    }
    openDetailView(VaultItemType.DriversLicense, id);
  };
  return (
    <SectionRow
      key={id}
      thumbnail={<VaultItemThumbnail type="drivers-license" />}
      itemSpaceId={spaceId}
      title={idName}
      subtitle={idNumber}
      onClick={openDriverLicenseDetailView}
      actions={
        <CopyIconButton
          text={translate(I18N_ACTION_KEYS.NUMBER_COPY)}
          copyAction={() => {
            void driverLicenseNumberCopyAction();
          }}
        />
      }
    />
  );
};
export const DriverLicenseListItem = React.memo(DriverLicenseComponent);
