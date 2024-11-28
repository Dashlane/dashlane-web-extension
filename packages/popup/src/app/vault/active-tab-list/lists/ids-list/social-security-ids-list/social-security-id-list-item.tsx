import React from "react";
import { useToast, VaultItemThumbnail } from "@dashlane/design-system";
import { Field, ItemType } from "@dashlane/hermes";
import { SocialSecurityId, VaultItemType } from "@dashlane/vault-contracts";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
import { logSelectVaultItem } from "../../../../../../libs/logs/events/vault/select-item";
import { useVaultItemDetailView } from "../../../../detail-views";
import { CopyIconButton } from "../../../../detail-views/credential-detail-view/form-fields/copy-icon-button";
import { useCopyAction } from "../../../../detail-views/credential-detail-view/useCopyAction";
import SearchEventLogger from "../../../../search-event-logger";
import { useSearchContext } from "../../../../search-field/search-context";
import { SectionRow } from "../../common";
export const I18N_KEYS = {
  SOCIAL_SECURITY_NUMBER_COPY:
    "tab/all_items/ids/social_security/detail_view/actions/copy_number",
  SOCIAL_SECURITY_NUMBER_COPIED:
    "tab/all_items/ids/social_security/detail_view/actions/number_copied_to_clipboard",
};
export interface Props {
  item: SocialSecurityId;
}
const SocialSecurityIdComponent = ({ item }: Props) => {
  const { openDetailView } = useVaultItemDetailView();
  const { searchValue } = useSearchContext();
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const { id, idName, spaceId, idNumber } = item;
  const openSocialSecurityIdDetailView = () => {
    logSelectVaultItem(id, ItemType.SocialSecurity);
    if (searchValue !== "") {
      SearchEventLogger.logSearchEvent();
    }
    openDetailView(VaultItemType.SocialSecurityId, id);
  };
  const socialSecurityNumberCopyAction = useCopyAction({
    toastString: translate(I18N_KEYS.SOCIAL_SECURITY_NUMBER_COPIED),
    showToast,
    itemType: VaultItemType.SocialSecurityId,
    field: Field.SocialSecurityNumber,
    itemId: id,
    isProtected: false,
    value: idNumber,
  });
  return (
    <SectionRow
      key={id}
      thumbnail={<VaultItemThumbnail type="social-security-number" />}
      itemSpaceId={spaceId}
      title={idName}
      subtitle={idNumber}
      onClick={openSocialSecurityIdDetailView}
      actions={
        <CopyIconButton
          text={translate(I18N_KEYS.SOCIAL_SECURITY_NUMBER_COPY)}
          copyAction={() => {
            void socialSecurityNumberCopyAction();
          }}
        />
      }
    />
  );
};
export const SocialSecurityIdListItem = React.memo(SocialSecurityIdComponent);
