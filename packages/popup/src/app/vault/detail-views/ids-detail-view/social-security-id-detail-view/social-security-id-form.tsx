import { memo } from "react";
import {
  Button,
  DisplayField,
  Icon,
  jsx,
  useToast,
} from "@dashlane/design-system";
import { Field } from "@dashlane/hermes";
import { SocialSecurityId, VaultItemType } from "@dashlane/vault-contracts";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import SpaceName from "../../../../../components/inputs/common/space-name/space-name";
import { FormContainer } from "../../common/form-container";
import { useCopyAction } from "../../credential-detail-view/useCopyAction";
const I18N_KEYS = {
  NAME_LABEL: "tab/all_items/ids/social_security/detail_view/label/name",
  NUMBER_LABEL: "tab/all_items/ids/social_security/detail_view/label/number",
  COUNTRY_LABEL: "tab/all_items/ids/social_security/detail_view/label/country",
  SPACE_LABEL: "tab/all_items/ids/social_security/detail_view/label/space",
};
const I18N_ACTION_KEYS = {
  NUMBER_COPY:
    "tab/all_items/ids/social_security/detail_view/actions/copy_number",
  NUMBER_COPIED:
    "tab/all_items/ids/social_security/detail_view/actions/number_copied_to_clipboard",
};
interface Props {
  socialSecurityId: SocialSecurityId;
}
const SocialSecurityIdFormComponent = ({ socialSecurityId }: Props) => {
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const { country, id, idNumber, idName, spaceId } = socialSecurityId;
  const socialSecurityNumberCopyAction = useCopyAction({
    toastString: translate(I18N_ACTION_KEYS.NUMBER_COPIED),
    showToast,
    itemType: VaultItemType.SocialSecurityId,
    field: Field.SocialSecurityNumber,
    itemId: id,
    isProtected: false,
    value: idNumber,
  });
  return (
    <FormContainer>
      {idName && (
        <DisplayField
          id="socialSecurityIdName"
          label={translate(I18N_KEYS.NAME_LABEL)}
          value={idName}
        />
      )}
      {idNumber && (
        <DisplayField
          id="socialSecurityIdNumber"
          label={translate(I18N_KEYS.NUMBER_LABEL)}
          value={idNumber}
          actions={[
            <Button
              key="copy"
              aria-label={translate(I18N_ACTION_KEYS.NUMBER_COPY)}
              icon={<Icon name="ActionCopyOutlined" />}
              intensity="supershy"
              layout="iconOnly"
              onClick={() => {
                void socialSecurityNumberCopyAction();
              }}
            />,
          ]}
        />
      )}
      {country && (
        <DisplayField
          id="socialSecurityIdCountry"
          label={translate(I18N_KEYS.COUNTRY_LABEL)}
          value={country}
        />
      )}
      {spaceId && (
        <SpaceName
          id="socialSecurityIdSpace"
          label={translate(I18N_KEYS.SPACE_LABEL)}
          spaceId={spaceId}
        />
      )}
    </FormContainer>
  );
};
export const SocialSecurityIdDetailForm = memo(SocialSecurityIdFormComponent);
