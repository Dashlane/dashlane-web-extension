import { memo } from "react";
import {
  Button,
  DisplayField,
  Icon,
  jsx,
  useToast,
} from "@dashlane/design-system";
import { Field } from "@dashlane/hermes";
import { Phone, PhoneType, VaultItemType } from "@dashlane/vault-contracts";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import SpaceName from "../../../../../components/inputs/common/space-name/space-name";
import { useCopyAction } from "../../credential-detail-view/useCopyAction";
import { FormContainer } from "../../common/form-container";
export const I18N_KEYS = {
  PHONE_NUMBER_LABEL:
    "tab/all_items/personal_info/phone/detail_view/label/phone_number",
  NAME_LABEL: "tab/all_items/personal_info/phone/detail_view/label/name",
  TYPE_LABEL: "tab/all_items/personal_info/phone/detail_view/label/type",
  SPACE_LABEL: "tab/all_items/personal_info/phone/detail_view/label/space",
};
export const I18N_ACTION_KEYS = {
  NUMBER_COPY:
    "tab/all_items/personal_info/phone/detail_view/actions/copy_number",
  NUMBER_COPIED:
    "tab/all_items/personal_info/phone/detail_view/actions/number_copied_to_clipboard",
};
export const I18N_PHONE_TYPES = {
  MOBILE: "tab/all_items/personal_info/phone/detail_view/types/mobile",
  LANDLINE: "tab/all_items/personal_info/phone/detail_view/types/landline",
  WORK_MOBILE:
    "tab/all_items/personal_info/phone/detail_view/types/work_mobile",
  WORK_LANDLINE:
    "tab/all_items/personal_info/phone/detail_view/types/work_landline",
  FAX: "tab/all_items/personal_info/phone/detail_view/types/fax",
  WORK_FAX: "tab/all_items/personal_info/phone/detail_view/types/work_fax",
  ANY: "tab/all_items/personal_info/phone/detail_view/types/any",
};
interface Props {
  phone: Phone;
}
const PhoneFormComponent = ({ phone }: Props) => {
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const { id, itemName, phoneNumber, spaceId, type } = phone;
  const numberCopyAction = useCopyAction({
    showToast,
    itemType: VaultItemType.Phone,
    itemId: id,
    isProtected: false,
    toastString: translate(I18N_ACTION_KEYS.NUMBER_COPIED),
    field: Field.Number,
    value: phoneNumber,
  });
  const getPhoneTypeOptions = (phoneType: PhoneType): string => {
    switch (phoneType) {
      case PhoneType.Any:
        return translate(I18N_PHONE_TYPES.ANY);
      case PhoneType.Fax:
        return translate(I18N_PHONE_TYPES.FAX);
      case PhoneType.Mobile:
        return translate(I18N_PHONE_TYPES.MOBILE);
      case PhoneType.Landline:
        return translate(I18N_PHONE_TYPES.LANDLINE);
      case PhoneType.WorkMobile:
        return translate(I18N_PHONE_TYPES.WORK_MOBILE);
      case PhoneType.WorkLandline:
        return translate(I18N_PHONE_TYPES.WORK_LANDLINE);
      case PhoneType.WorkFax:
        return translate(I18N_PHONE_TYPES.WORK_FAX);
    }
  };
  return (
    <FormContainer>
      {phoneNumber && (
        <DisplayField
          id="phoneNumber"
          label={translate(I18N_KEYS.PHONE_NUMBER_LABEL)}
          value={phoneNumber}
          actions={[
            <Button
              key="copy"
              aria-label={translate(I18N_ACTION_KEYS.NUMBER_COPY)}
              icon={<Icon name="ActionCopyOutlined" />}
              intensity="supershy"
              layout="iconOnly"
              onClick={() => {
                void numberCopyAction();
              }}
            />,
          ]}
        />
      )}
      {itemName && (
        <DisplayField
          id="phoneName"
          label={translate(I18N_KEYS.NAME_LABEL)}
          value={itemName}
        />
      )}
      {type && (
        <DisplayField
          id="phoneType"
          label={translate(I18N_KEYS.TYPE_LABEL)}
          value={getPhoneTypeOptions(type)}
        />
      )}
      {spaceId && (
        <SpaceName
          id="phoneSpace"
          label={translate(I18N_KEYS.SPACE_LABEL)}
          spaceId={spaceId}
        />
      )}
    </FormContainer>
  );
};
export const PhoneDetailForm = memo(PhoneFormComponent);
