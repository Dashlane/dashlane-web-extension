import { memo } from "react";
import {
  Button,
  DisplayField,
  Icon,
  jsx,
  useToast,
} from "@dashlane/design-system";
import { Field } from "@dashlane/hermes";
import { IdCard, VaultItemType } from "@dashlane/vault-contracts";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import SpaceName from "../../../../../components/inputs/common/space-name/space-name";
import { useCopyAction } from "../../credential-detail-view/useCopyAction";
import { FormContainer } from "../../common/form-container";
import { dateFormatter } from "../../helpers";
export const I18N_KEYS = {
  NAME_LABEL: "tab/all_items/ids/id_card/detail_view/label/name",
  NUMBER_LABEL: "tab/all_items/ids/id_card/detail_view/label/number",
  ISSUE_DATE_LABEL: "tab/all_items/ids/id_card/detail_view/label/issue_date",
  EXPIRATION_DATE_LABEL:
    "tab/all_items/ids/id_card/detail_view/label/expiration_date",
  COUNTRY_LABEL: "tab/all_items/ids/id_card/detail_view/label/country",
  SPACE_LABEL: "tab/all_items/ids/id_card/detail_view/label/space",
};
export const I18N_ACTION_KEYS = {
  NUMBER_COPY: "tab/all_items/ids/id_card/detail_view/actions/copy_number",
  NUMBER_COPIED:
    "tab/all_items/ids/id_card/detail_view/actions/number_copied_to_clipboard",
};
interface Props {
  idCard: IdCard;
}
const IdCardFormComponent = ({ idCard }: Props) => {
  const { issueDate, idName, spaceId, country, expirationDate, id, idNumber } =
    idCard;
  const { getLocaleMeta, translate } = useTranslate();
  const { showToast } = useToast();
  const idCardNumberCopyAction = useCopyAction({
    toastString: translate(I18N_ACTION_KEYS.NUMBER_COPIED),
    showToast,
    itemType: VaultItemType.IdCard,
    field: Field.Number,
    itemId: id,
    isProtected: false,
    value: idNumber,
  });
  return (
    <FormContainer>
      {idName ? (
        <DisplayField
          id="idCardName"
          label={translate(I18N_KEYS.NAME_LABEL)}
          value={idName}
        />
      ) : null}
      {idNumber ? (
        <DisplayField
          id="idCardNumber"
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
                void idCardNumberCopyAction();
              }}
            />,
          ]}
        />
      ) : null}
      {issueDate ? (
        <DisplayField
          id="idCardIssueDate"
          label={translate(I18N_KEYS.ISSUE_DATE_LABEL)}
          value={dateFormatter(issueDate, getLocaleMeta()?.code)}
        />
      ) : null}
      {expirationDate ? (
        <DisplayField
          id="idCardExpirationDate"
          label={translate(I18N_KEYS.EXPIRATION_DATE_LABEL)}
          value={dateFormatter(expirationDate, getLocaleMeta()?.code)}
        />
      ) : null}
      {country ? (
        <DisplayField
          id="idCardCountry"
          label={translate(I18N_KEYS.COUNTRY_LABEL)}
          value={country}
        />
      ) : null}
      {spaceId ? (
        <SpaceName
          id="idCardSpace"
          label={translate(I18N_KEYS.SPACE_LABEL)}
          spaceId={spaceId}
        />
      ) : null}
    </FormContainer>
  );
};
export const IdCardDetailForm = memo(IdCardFormComponent);
