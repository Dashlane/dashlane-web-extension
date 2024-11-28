import { memo } from "react";
import {
  Button,
  DisplayField,
  Icon,
  jsx,
  useToast,
} from "@dashlane/design-system";
import { Field } from "@dashlane/hermes";
import { FiscalId, VaultItemType } from "@dashlane/vault-contracts";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { I18N_SHARED_KEY } from "../../../utils/shared-translation";
import SpaceName from "../../../../../components/inputs/common/space-name/space-name";
import { useCopyAction } from "../../credential-detail-view/useCopyAction";
import { FormContainer } from "../../common/form-container";
export const I18N_KEYS = {
  FISCAL_ID_NUMBER_LABEL:
    "tab/all_items/ids/fiscal_id/detail_view/label/number",
  FISCAL_ID_COUNTRY_LABEL:
    "tab/all_items/ids/fiscal_id/detail_view/label/country",
  FISCAL_ID_SPACE_LABEL: "tab/all_items/ids/fiscal_id/detail_view/label/space",
  FISCAL_ID_NUMBER_COPY:
    "tab/all_items/ids/fiscal_id/detail_view/actions/copy_number",
  FISCAL_ID_NUMBER_COPIED:
    "tab/all_items/ids/fiscal_id/detail_view/actions/copied_clipboard",
};
interface Props {
  fiscalId: FiscalId;
}
const FiscalIdFormComponent = ({ fiscalId }: Props) => {
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const { id, country, spaceId, fiscalNumber } = fiscalId;
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
    <FormContainer>
      {fiscalNumber ? (
        <DisplayField
          id="fiscalIdNumber"
          label={translate(I18N_KEYS.FISCAL_ID_NUMBER_LABEL)}
          value={fiscalNumber}
          actions={[
            <Button
              key="copy"
              aria-label={translate(I18N_KEYS.FISCAL_ID_NUMBER_COPY)}
              icon={<Icon name="ActionCopyOutlined" />}
              intensity="supershy"
              layout="iconOnly"
              onClick={() => {
                void fiscalIdNumberCopyAction();
              }}
            />,
          ]}
        />
      ) : null}
      {country ? (
        <DisplayField
          id="fiscalIdCountry"
          label={translate(I18N_KEYS.FISCAL_ID_COUNTRY_LABEL)}
          value={country}
        />
      ) : null}
      {spaceId ? (
        <SpaceName
          id="fiscalIdSpace"
          label={translate(I18N_SHARED_KEY.SPACE)}
          spaceId={spaceId}
        />
      ) : null}
    </FormContainer>
  );
};
export const FiscalIdDetailForm = memo(FiscalIdFormComponent);
