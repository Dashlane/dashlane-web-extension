import { Button, useToast } from "@dashlane/design-system";
import { UserCopyVaultItemFieldEvent } from "@dashlane/hermes";
import { VaultItemType } from "@dashlane/vault-contracts";
import { redirect } from "../../../libs/router";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useIsB2CUserFrozen } from "../../../libs/frozen-state/hooks/use-is-b2c-user-frozen";
import { logEvent } from "../../../libs/logs/logEvent";
import { idTypeToField, idTypeToItemType } from "../logs";
import { IdVaultItemType } from "../types";
const I18N_KEYS = {
  IDS_EDIT_DOCUMENT: "webapp_ids_edit_document",
  IDS_FAILED_COPY: "webapp_ids_failed_copy",
  IDS_ID_CARD_COPY: "webapp_ids_id_cards_id_card_copy",
  IDS_ID_CARD_COPY_SUCCESSFUL: "webapp_ids_id_cards_id_card_copy_successfull",
  IDS_SOCIAL_SECURITY_COPY:
    "webapp_ids_social_security_ids_social_security_id_copy",
  IDS_SOCIAL_SECURITY_COPY_SUCCESSFUL:
    "webapp_ids_social_security_ids_social_security_id_copy_successfull",
  IDS_DRIVER_LICENSE_COPY: "webapp_ids_driver_licences_driver_licence_copy",
  IDS_DRIVER_LICENSE_COPY_SUCCESSFUL:
    "webapp_ids_driver_licences_driver_licence_copy_successfull",
  IDS_PASSPORT_COPY: "webapp_ids_passports_passport_copy",
  IDS_PASSPORT_COPY_SUCCESSFUL:
    "webapp_ids_passports_passport_copy_successfull",
  IDS_FISCAL_ID_COPY: "webapp_ids_fiscal_ids_fiscal_id_copy",
  IDS_FISCAL_ID_COPY_SUCCESSFUL:
    "webapp_ids_fiscal_ids_fiscal_id_copy_successfull",
};
interface Props {
  itemId: string;
  copyValue: string;
  editRoute: string;
  variant: "list" | "search";
  reportError?: (error: Error, message: string) => void;
  type: IdVaultItemType;
}
type LabelsType = Record<IdVaultItemType, Record<"copy" | "success", string>>;
const labels: LabelsType = {
  [VaultItemType.DriversLicense]: {
    copy: I18N_KEYS.IDS_DRIVER_LICENSE_COPY,
    success: I18N_KEYS.IDS_DRIVER_LICENSE_COPY_SUCCESSFUL,
  },
  [VaultItemType.FiscalId]: {
    copy: I18N_KEYS.IDS_FISCAL_ID_COPY,
    success: I18N_KEYS.IDS_FISCAL_ID_COPY_SUCCESSFUL,
  },
  [VaultItemType.IdCard]: {
    copy: I18N_KEYS.IDS_ID_CARD_COPY,
    success: I18N_KEYS.IDS_ID_CARD_COPY_SUCCESSFUL,
  },
  [VaultItemType.Passport]: {
    copy: I18N_KEYS.IDS_PASSPORT_COPY,
    success: I18N_KEYS.IDS_PASSPORT_COPY_SUCCESSFUL,
  },
  [VaultItemType.SocialSecurityId]: {
    copy: I18N_KEYS.IDS_SOCIAL_SECURITY_COPY,
    success: I18N_KEYS.IDS_SOCIAL_SECURITY_COPY_SUCCESSFUL,
  },
};
export const QuickActions = ({
  itemId,
  copyValue,
  editRoute,
  reportError,
  variant,
  type,
}: Props) => {
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const isUserFrozen = useIsB2CUserFrozen();
  const handleCopyClick = async () => {
    logEvent(
      new UserCopyVaultItemFieldEvent({
        itemType: idTypeToItemType[type],
        field: idTypeToField[type],
        itemId,
        isProtected: false,
      })
    );
    try {
      await navigator.clipboard.writeText(copyValue);
      showToast({
        description: translate(labels[type].success),
      });
    } catch (err) {
      if (typeof reportError === "function") {
        reportError(err, "[ids][quick-actions] Unable to copy to clipboard");
      }
      showToast({
        description: translate(I18N_KEYS.IDS_FAILED_COPY),
        mood: "danger",
        isManualDismiss: true,
      });
    }
  };
  const handleEditClick = () => {
    redirect(editRoute);
  };
  const searchVariant = variant === "search";
  if (isUserFrozen === null) {
    return null;
  }
  return (
    <span
      onClick={(evt) => {
        evt.stopPropagation();
        evt.preventDefault();
      }}
      sx={{
        display: "flex",
        "& > *:not(:last-child)": {
          marginRight: "16px",
        },
      }}
    >
      {!isUserFrozen ? (
        <Button
          layout="iconOnly"
          aria-label={translate(labels[type].copy)}
          title={translate(labels[type].copy)}
          icon="ActionCopyOutlined"
          onClick={handleCopyClick}
          type="button"
          size="small"
          intensity="supershy"
        />
      ) : null}
      {!searchVariant ? (
        <Button
          layout="iconOnly"
          aria-label={translate(I18N_KEYS.IDS_EDIT_DOCUMENT)}
          title={translate(I18N_KEYS.IDS_EDIT_DOCUMENT)}
          icon="ActionEditOutlined"
          onClick={handleEditClick}
          type="button"
          size="small"
          intensity="supershy"
        />
      ) : null}
    </span>
  );
};
