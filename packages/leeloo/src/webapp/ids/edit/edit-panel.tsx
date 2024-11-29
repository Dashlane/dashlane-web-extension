import React from "react";
import { PageView } from "@dashlane/hermes";
import { VaultItemType } from "@dashlane/vault-contracts";
import { redirect } from "../../../libs/router";
import { logPageView } from "../../../libs/logs/logEvent";
import useTranslate from "../../../libs/i18n/useTranslate";
import { Header } from "../form/header";
import { IdVaultItemType } from "../types";
import { ConfirmDeleteVaultItemDialog } from "../../personal-data/edit/confirm-delete-vault-item-dialog";
import { DeleteTranslations } from "../../personal-data/edit/types";
import { IdGroupTab } from "./documents/id-card";
import { useTabs } from "./documents/use-tabs";
import { DetailTabPanel } from "./details/detail-tab-panel";
import { EditPanelProps } from "./edit-panel-types";
const I18N_KEYS = {
  DIALOG_DELETE_SUBTITLE: "webapp_id_edition_dialog_delete_subtitle",
  DIALOG_DELETE_DISMISS: "webapp_id_edition_dialog_delete_dismiss",
  DIALOG_DELETE_CONFIRM: "webapp_id_edition_dialog_delete_confirm",
  GENERIC_ERROR: "_common_generic_error",
};
export const EditPanel = ({
  getDescription,
  title,
  ...props
}: EditPanelProps) => {
  const { translate } = useTranslate();
  const {
    item,
    initialValues,
    type,
    children,
    showConfirmDelete,
    closeConfirmDeleteDialog,
    deleteDialogTitle,
    deleteAlertTranslation,
    listRoute,
  } = props;
  const { hasTabs, activeTab, tabs, focusAttachment, cleanActiveTab } = useTabs(
    item.id
  );
  const [currentCountry, setCurrentCountry] = React.useState(
    initialValues.country
  );
  React.useEffect(() => {
    const typeToPageView: Record<IdVaultItemType, PageView> = {
      [VaultItemType.DriversLicense]: PageView.ItemDriverLicenceDetails,
      [VaultItemType.FiscalId]: PageView.ItemFiscalStatementDetails,
      [VaultItemType.IdCard]: PageView.ItemIdCardDetails,
      [VaultItemType.Passport]: PageView.ItemPassportDetails,
      [VaultItemType.SocialSecurityId]:
        PageView.ItemSocialSecurityStatementDetails,
    };
    logPageView(typeToPageView[type]);
  }, [type]);
  const deleteTranslations: DeleteTranslations = React.useMemo(() => {
    return {
      confirmDeleteConfirm: translate(I18N_KEYS.DIALOG_DELETE_CONFIRM),
      confirmDeleteDismiss: translate(I18N_KEYS.DIALOG_DELETE_DISMISS),
      confirmDeleteSubtitle: translate(I18N_KEYS.DIALOG_DELETE_SUBTITLE),
      confirmDeleteTitle: translate(deleteDialogTitle),
      deleteSuccessToast: translate(deleteAlertTranslation),
    };
  }, [deleteDialogTitle, deleteAlertTranslation, translate]);
  const showListView = () => {
    cleanActiveTab();
    logPageView(PageView.ItemIdList);
    redirect(listRoute);
  };
  const displayDetails = !hasTabs || IdGroupTab.DETAILS === activeTab;
  return (
    <>
      <Header
        country={currentCountry}
        description={getDescription(currentCountry)}
        title={title}
        type={type}
        tabs={hasTabs ? tabs : undefined}
      />
      {displayDetails ? (
        <DetailTabPanel
          {...props}
          setCurrentCountry={setCurrentCountry}
          hasTabs={hasTabs}
          focusAttachment={focusAttachment}
          cleanActiveTab={cleanActiveTab}
          showListView={showListView}
        >
          {children}
        </DetailTabPanel>
      ) : null}
      <ConfirmDeleteVaultItemDialog
        isVisible={showConfirmDelete}
        itemId={item.id}
        closeConfirmDeleteDialog={closeConfirmDeleteDialog}
        onDeletionSuccess={showListView}
        translations={deleteTranslations}
        vaultItemType={VaultItemType.PaymentCard}
      />
    </>
  );
};
