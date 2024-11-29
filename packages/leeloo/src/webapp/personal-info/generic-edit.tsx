import React, { Ref, useEffect, useRef, useState } from "react";
import { PageView } from "@dashlane/hermes";
import {
  Address,
  Company,
  Email,
  Identity,
  Phone,
  UpdateVaultItemCommandParam,
  vaultItemsCrudApi,
  VaultItemType,
  Website,
} from "@dashlane/vault-contracts";
import { useModuleCommands } from "@dashlane/framework-react";
import { AlertSeverity } from "@dashlane/ui-components";
import { Lee } from "../../lee";
import { EditPanel, PanelHeader } from "../panel";
import PersonalInfoIcon, { IconSize, IconType } from "../personal-info-icon";
import { PersonalInfoForm, PersonalInfoItemType } from "./types";
import { ConfirmDeleteVaultItemDialog } from "../personal-data/edit/confirm-delete-vault-item-dialog";
import { DeleteTranslations } from "../personal-data/edit/types";
import { redirect, useRouterGlobalSettingsContext } from "../../libs/router";
import { TranslateFunction } from "../../libs/i18n/types";
import { useAlert } from "../../libs/alert-notifications/use-alert";
import useTranslate from "../../libs/i18n/useTranslate";
import { logPageView } from "../../libs/logs/logEvent";
import colorsVar from "../../libs/dashlane-style/globals/color-variables.css";
export interface Props<T> {
  lee: Lee;
  match: {
    params: {
      uuid: string;
    };
  };
  item: T | undefined;
}
type RenderEditForm<T, F> = (
  lee: Lee,
  item: T,
  ref: Ref<F>,
  signalEditedValues: () => void
) => JSX.Element;
interface GenericEditParams<T, F> {
  getDeleteTitle: (translateFn: TranslateFunction) => string;
  getItemTypeDescription: (translateFn: TranslateFunction) => string;
  getTitle: (item: T, translateFn: TranslateFunction) => string;
  iconType: IconType;
  vaultItemType: PersonalInfoItemType;
  renderForm: RenderEditForm<T, F>;
}
const I18N_KEYS = {
  DELETE_CONFIRM: "webapp_personal_info_edition_delete_confirm",
  DELETE_DISMISS: "webapp_personal_info_edition_delete_dismiss",
  DELETE_SUBTITLE: "webapp_personal_info_edition_delete_subtitle",
};
export function getPersonalInfoEditPanel<
  T extends Address | Company | Email | Identity | Phone | Website,
  F extends PersonalInfoForm
>(params: GenericEditParams<T, F>) {
  const {
    getItemTypeDescription,
    getDeleteTitle,
    getTitle,
    iconType,
    vaultItemType,
    renderForm,
  } = params;
  const PersonalInfoEditPanel = ({ lee, item, match }: Props<T>) => {
    const formRef = useRef<F>(null);
    const alertContext = useAlert();
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const { updateVaultItem } = useModuleCommands(vaultItemsCrudApi);
    const isFormValid = () => Boolean(formRef.current?.isFormValid());
    const getFormValues = () => formRef.current?.getValues();
    const [hasDataBeenModified, setHasDataBeenModified] = useState(false);
    const [displayConfirmDeleteDialog, setDisplayConfirmDeleteDialog] =
      useState(false);
    useEffect(() => {
      const vaultItemTypeToPageView = {
        [VaultItemType.Address]: PageView.ItemAddressDetails,
        [VaultItemType.Company]: PageView.ItemCompanyDetails,
        [VaultItemType.Email]: PageView.ItemEmailDetails,
        [VaultItemType.Identity]: PageView.ItemIdentityDetails,
        [VaultItemType.Phone]: PageView.ItemPhoneDetails,
        [VaultItemType.Website]: PageView.ItemWebsiteDetails,
      };
      logPageView(vaultItemTypeToPageView[vaultItemType]);
    }, []);
    if (!item) {
      return null;
    }
    const showListView = () => {
      logPageView(PageView.ItemPersonalInfoList);
      redirect(routes.userPersonalInfo);
    };
    const handleEditedForm = () => setHasDataBeenModified(true);
    const handleClickDelete = () => setDisplayConfirmDeleteDialog(true);
    const closeConfirmDeleteDialog = () => setDisplayConfirmDeleteDialog(false);
    const updatePersonalInfo = async () => {
      const content = getFormValues();
      if (!content) {
        return;
      }
      const updateResult = await updateVaultItem({
        vaultItemType: vaultItemType,
        content: content,
        id: item.id,
      } as UpdateVaultItemCommandParam);
      if (updateResult.tag !== "success") {
        alertContext.showAlert(
          translate("_common_generic_error"),
          AlertSeverity.ERROR
        );
      }
    };
    const handleSubmit = async () => {
      if (!item.id || !isFormValid()) {
        return;
      }
      await updatePersonalInfo();
      showListView();
    };
    const itemTitle = item ? getTitle(item, translate) : "";
    const deleteTranslations: DeleteTranslations = {
      confirmDeleteConfirm: translate(I18N_KEYS.DELETE_CONFIRM),
      confirmDeleteDismiss: translate(I18N_KEYS.DELETE_DISMISS),
      confirmDeleteSubtitle: translate(I18N_KEYS.DELETE_SUBTITLE),
      confirmDeleteTitle: getDeleteTitle(translate),
    };
    return (
      <EditPanel
        isUsingNewDesign
        isViewingExistingItem={Boolean(match.params?.uuid)}
        itemHasBeenEdited={hasDataBeenModified}
        onNavigateOut={showListView}
        onSubmit={handleSubmit}
        onClickDelete={handleClickDelete}
        ignoreCloseOnEscape={displayConfirmDeleteDialog}
        formId="edit_personalinfo_panel"
        header={
          <PanelHeader
            icon={
              <PersonalInfoIcon
                iconSize={IconSize.headerEditPanelIcon}
                iconType={iconType}
              />
            }
            iconBackgroundColor={colorsVar["--dash-green-00"]}
            title={itemTitle}
            titleDescription={getItemTypeDescription(translate)}
          />
        }
      >
        {renderForm(lee, item, formRef, handleEditedForm)}

        <ConfirmDeleteVaultItemDialog
          isVisible={displayConfirmDeleteDialog}
          itemId={item.id}
          closeConfirmDeleteDialog={closeConfirmDeleteDialog}
          onDeletionSuccess={showListView}
          translations={deleteTranslations}
          vaultItemType={vaultItemType}
        />
      </EditPanel>
    );
  };
  return PersonalInfoEditPanel;
}
