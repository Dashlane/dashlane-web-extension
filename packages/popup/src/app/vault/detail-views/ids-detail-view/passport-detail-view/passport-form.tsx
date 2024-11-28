import { memo } from "react";
import {
  Button,
  DisplayField,
  Icon,
  jsx,
  useToast,
} from "@dashlane/design-system";
import { Field } from "@dashlane/hermes";
import { Passport, VaultItemType } from "@dashlane/vault-contracts";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import SpaceName from "../../../../../components/inputs/common/space-name/space-name";
import { FormContainer } from "../../common/form-container";
import { useCopyAction } from "../../credential-detail-view/useCopyAction";
import { dateFormatter } from "../../helpers";
export const I18N_KEYS = {
  NAME_LABEL: "tab/all_items/ids/passport/detail_view/label/name",
  NUMBER_LABEL: "tab/all_items/ids/passport/detail_view/label/number",
  ISSUE_DATE_LABEL: "tab/all_items/ids/passport/detail_view/label/issue_date",
  EXPIRATION_DATE_LABEL:
    "tab/all_items/ids/passport/detail_view/label/expiration_date",
  COUNTRY_LABEL: "tab/all_items/ids/passport/detail_view/label/country",
  PLACE_ISSUE_LABEL: "tab/all_items/ids/passport/detail_view/label/place_issue",
  SPACE_LABEL: "tab/all_items/ids/passport/detail_view/label/space",
};
export const I18N_ACTION_KEYS = {
  NUMBER_COPY: "tab/all_items/ids/passport/detail_view/actions/copy_number",
  NUMBER_COPIED:
    "tab/all_items/ids/passport/detail_view/actions/number_copied_to_clipboard",
};
interface Props {
  passport: Passport;
}
const PassportFormComponent = ({ passport }: Props) => {
  const { getLocaleMeta, translate } = useTranslate();
  const { showToast } = useToast();
  const {
    country,
    expirationDate,
    id,
    idName,
    idNumber,
    issueDate,
    issuePlace,
    spaceId,
  } = passport;
  const passportNumberCopyAction = useCopyAction({
    toastString: translate(I18N_ACTION_KEYS.NUMBER_COPIED),
    showToast,
    itemType: VaultItemType.Passport,
    field: Field.Password,
    itemId: id,
    isProtected: false,
    value: idNumber,
  });
  return (
    <FormContainer>
      {idName ? (
        <DisplayField
          id="passportName"
          label={translate(I18N_KEYS.NAME_LABEL)}
          value={idName}
        />
      ) : null}
      {idNumber ? (
        <DisplayField
          id="passportNumber"
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
                void passportNumberCopyAction();
              }}
            />,
          ]}
        />
      ) : null}
      {issueDate ? (
        <DisplayField
          id="passportIssueDate"
          label={translate(I18N_KEYS.ISSUE_DATE_LABEL)}
          value={dateFormatter(issueDate, getLocaleMeta()?.code)}
        />
      ) : null}
      {expirationDate ? (
        <DisplayField
          id="passportExpirationDate"
          label={translate(I18N_KEYS.EXPIRATION_DATE_LABEL)}
          value={dateFormatter(expirationDate, getLocaleMeta()?.code)}
        />
      ) : null}
      {country ? (
        <DisplayField
          id="passportCountry"
          label={translate(I18N_KEYS.COUNTRY_LABEL)}
          value={country}
        />
      ) : null}
      {issuePlace ? (
        <DisplayField
          id="passporIssuePlace"
          label={translate(I18N_KEYS.PLACE_ISSUE_LABEL)}
          value={issuePlace}
        />
      ) : null}
      {spaceId ? (
        <SpaceName
          id="passportIdSpace"
          label={translate(I18N_KEYS.SPACE_LABEL)}
          spaceId={spaceId}
        />
      ) : null}
    </FormContainer>
  );
};
export const PassportDetailForm = memo(PassportFormComponent);
