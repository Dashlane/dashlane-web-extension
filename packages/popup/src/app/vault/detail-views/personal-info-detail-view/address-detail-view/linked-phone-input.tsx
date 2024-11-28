import React from "react";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { DisplayField } from "@dashlane/design-system";
import { vaultItemsCrudApi, VaultItemType } from "@dashlane/vault-contracts";
import useTranslate from "../../../../../libs/i18n/useTranslate";
interface Props {
  linkedPhoneId: string;
}
export const LinkedPhoneInput = ({ linkedPhoneId }: Props) => {
  const { translate } = useTranslate();
  const { status, data } = useModuleQuery(vaultItemsCrudApi, "query", {
    vaultItemTypes: [VaultItemType.Phone],
    ids: [linkedPhoneId],
  });
  if (status !== DataStatus.Success || !data.phonesResult.items.length) {
    return null;
  }
  return (
    <DisplayField
      id="addressLinkedPhone"
      label={translate(
        "tab/all_items/personal_info/address/detail_view/label/address_linked_phone"
      )}
      value={data.phonesResult.items[0].phoneNumber}
    />
  );
};
