import { memo } from "react";
import {
  Button,
  DisplayField,
  Icon,
  jsx,
  useToast,
} from "@dashlane/design-system";
import { Field } from "@dashlane/hermes";
import { Email, VaultItemType } from "@dashlane/vault-contracts";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { I18N_SHARED_KEY } from "../../../utils/shared-translation";
import SpaceName from "../../../../../components/inputs/common/space-name/space-name";
import { useCopyAction } from "../../credential-detail-view/useCopyAction";
import { FormContainer } from "../../common/form-container";
export const I18N_KEYS = {
  EMAIL_LABEL: "tab/all_items/personalinfo/email/view/label/email",
  NAME_LABEL: "tab/all_items/personalinfo/email/view/label/item_name",
  EMAIL_COPY: "tab/all_items/personalinfo/email/actions/copy_email",
  EMAIL_COPIED:
    "tab/all_items/personalinfo/email/actions/email_copied_to_clipboard",
};
interface EmailDetailFormProps {
  email: Email;
}
const EmailDetailFormComponent = ({ email }: EmailDetailFormProps) => {
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const { itemName, id, spaceId, emailAddress } = email;
  const emailCopyAction = useCopyAction({
    toastString: translate(I18N_KEYS.EMAIL_COPIED),
    showToast,
    itemType: VaultItemType.Email,
    field: Field.Email,
    itemId: id,
    isProtected: false,
    value: emailAddress,
  });
  return (
    <FormContainer>
      {emailAddress && (
        <DisplayField
          id="emailAddress"
          label={translate(I18N_KEYS.EMAIL_LABEL)}
          value={emailAddress}
          actions={[
            <Button
              key="copy"
              aria-label={translate(I18N_KEYS.EMAIL_COPY)}
              icon={<Icon name="ActionCopyOutlined" />}
              intensity="supershy"
              layout="iconOnly"
              onClick={() => {
                void emailCopyAction();
              }}
            />,
          ]}
        />
      )}
      {itemName && (
        <DisplayField
          id="emailName"
          label={translate(I18N_KEYS.NAME_LABEL)}
          value={itemName}
        />
      )}
      {spaceId && (
        <SpaceName
          id="emailIdSpace"
          label={translate(I18N_SHARED_KEY.SPACE)}
          spaceId={spaceId}
        />
      )}
    </FormContainer>
  );
};
export const EmailDetailForm = memo(EmailDetailFormComponent);
