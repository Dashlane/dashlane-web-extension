import React from "react";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { vaultItemsCrudApi, VaultItemType } from "@dashlane/vault-contracts";
import { SelectField, SelectOption } from "@dashlane/design-system";
import { Option } from "../../../libs/dashlane-style/select-field/detail";
import useTranslate from "../../../libs/i18n/useTranslate";
import styles from "./styles.css";
interface LinkedPhoneOption extends Option {
  value: string;
}
interface Props {
  handleChange: (eventOrValue: React.ChangeEvent<any> | any) => void;
  linkedPhoneId?: string;
  disabled?: boolean;
}
const OTHER_PHONE_OPTION = "other";
export const LinkedPhoneSelect = ({
  linkedPhoneId,
  handleChange,
  disabled = false,
}: Props) => {
  const { translate } = useTranslate();
  const phonesQueryResult = useModuleQuery(vaultItemsCrudApi, "query", {
    vaultItemTypes: [VaultItemType.Phone],
  });
  if (phonesQueryResult.status !== DataStatus.Success) {
    return null;
  }
  const phones = phonesQueryResult.data.phonesResult.items;
  const linkedPhoneOptions: LinkedPhoneOption[] = [
    {
      value: "",
      label: translate(
        "webapp_personal_info_edition_address_phone_number_other"
      ),
    },
    ...phones.map((phone) => ({
      value: phone.id,
      label: `${phone.itemName} ${phone.phoneNumber}`,
      selectedLabel: (
        <span>
          <span className={styles.phoneName}>{phone.itemName}</span>{" "}
          {phone.phoneNumber}
        </span>
      ),
    })),
  ];
  const currentLinkedPhoneOption =
    linkedPhoneOptions.find((item) => item.value === linkedPhoneId) ??
    linkedPhoneOptions[0];
  return (
    <SelectField
      label={translate(
        "webapp_personal_info_edition_address_phone_number_label"
      )}
      data-name="linkedPhoneId"
      onChange={(value: string) => {
        handleChange(value === OTHER_PHONE_OPTION ? "" : value);
      }}
      value={
        currentLinkedPhoneOption.value === ""
          ? OTHER_PHONE_OPTION
          : currentLinkedPhoneOption.value
      }
      readOnly={disabled}
    >
      {linkedPhoneOptions.map((linkedPhoneOption) => {
        return (
          <SelectOption
            key={linkedPhoneOption.value}
            displayValue={linkedPhoneOption.label}
            value={
              linkedPhoneOption.value === ""
                ? OTHER_PHONE_OPTION
                : linkedPhoneOption.value
            }
          >
            {linkedPhoneOption.label}
          </SelectOption>
        );
      })}
    </SelectField>
  );
};
