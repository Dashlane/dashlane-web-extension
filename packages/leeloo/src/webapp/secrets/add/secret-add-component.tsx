import { useEffect, useState } from "react";
import {
  DataStatus,
  useFeatureFlip,
  useModuleCommands,
} from "@dashlane/framework-react";
import { vaultItemsCrudApi, VaultItemType } from "@dashlane/vault-contracts";
import { AlertSeverity } from "@dashlane/ui-components";
import { useAlert } from "../../../libs/alert-notifications/use-alert";
import useTranslate from "../../../libs/i18n/useTranslate";
import { usePremiumStatus } from "../../../libs/carbon/hooks/usePremiumStatus";
import { EditPanel } from "../../panel";
import { SecretsTabs } from "../edit/types";
import { useTeamSpaceContext } from "../../../team/settings/components/TeamSpaceContext";
import { Header } from "../form/header/header";
import { SecretForm } from "../form/secret-form";
import { SaveSecretContentValues } from "../../personal-data/types";
import { redirect, useRouterGlobalSettingsContext } from "../../../libs/router";
import { logPageView } from "../../../libs/logs/logEvent";
import { PageView } from "@dashlane/hermes";
import { AddSecureFileResult } from "@dashlane/communication";
import { carbonConnector } from "../../../libs/carbon/connector";
import { createEmbeddedAttachmentFromSecureFile } from "../../secure-files/helpers/embedded-attachment";
import { SecureAttachmentUploadButton } from "../../secure-files/components/secure-attachment-upload-button";
import { useFrozenState } from "../../../libs/frozen-state/frozen-state-dialog-context";
const { CONTENT, DOCUMENT_STORAGE } = SecretsTabs;
const I18N_KEYS = {
  TITLE_FIELD: "webapp_secrets_title_field",
  TAB_TITLE_DETAILS_EDITION: "webapp_secrets_edition_field_tab_title_details",
  TAB_TITLE_ATTACHMENTS_EDITION:
    "webapp_secrets_edition_field_tab_title_attachments",
};
export const SecretAddPanelComponent = () => {
  const { routes } = useRouterGlobalSettingsContext();
  const premiumStatus = usePremiumStatus();
  const [activeTab, setActiveTab] = useState(CONTENT);
  const [hasDataBeenModified, setHasDataBeenModified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAttachmentUploading, setIsAttachmentUploading] = useState(false);
  const { currentSpaceId, teamId } = useTeamSpaceContext();
  const isAttachmentsEnabled = useFeatureFlip("ace_secrets_vault_attachment");
  const [newSecret, setNewSecret] = useState<SaveSecretContentValues>({
    id: "",
    limitedPermissions: false,
    title: "",
    content: "",
    spaceId: currentSpaceId ?? (teamId ? String(teamId) : ""),
    secured: false,
    attachments: [],
  });
  const { shouldShowFrozenStateDialog: isUserFrozen } = useFrozenState();
  const { createVaultItem } = useModuleCommands(vaultItemsCrudApi);
  const alertContext = useAlert();
  const { translate } = useTranslate();
  useEffect(() => {
    logPageView(PageView.ItemSecretCreate);
  }, []);
  if (premiumStatus.status !== DataStatus.Success || !premiumStatus?.data) {
    return null;
  }
  const showListView = () => redirect(routes.userSecrets);
  const closeAndShowListView = (): void => {
    showListView();
  };
  const saveSecret = async () => {
    try {
      await createVaultItem({
        vaultItemType: VaultItemType.Secret,
        content: {
          title: newSecret.title,
          content: newSecret.content,
          spaceId: newSecret.spaceId ?? "",
          isSecured: newSecret.secured,
          attachments: newSecret.attachments,
        },
      });
    } catch (error) {
      setIsSubmitting(false);
      alertContext.showAlert(
        translate("_common_generic_error"),
        AlertSeverity.ERROR
      );
    }
  };
  const handleChange = (
    key: keyof Omit<SaveSecretContentValues, "id" | "limitedPermissions">,
    value: string | boolean
  ) => {
    if (key === "spaceId" && value === newSecret.spaceId) {
      return;
    }
    const updatedValues = {
      ...newSecret,
      [key]: value,
    };
    const hasValues =
      !!updatedValues.title ||
      !!updatedValues.content ||
      !!updatedValues.spaceId ||
      !!updatedValues.secured;
    if (hasValues !== hasDataBeenModified) {
      setHasDataBeenModified(hasValues);
    }
    setNewSecret(updatedValues);
  };
  const submit = async (): Promise<void> => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    await saveSecret();
    showListView();
  };
  const handleFileInfoDetached = (secureFileInfoId: string) => {
    setNewSecret((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((a) => a.id !== secureFileInfoId),
    }));
  };
  const handleOnFileUploadStarted = () => {
    setIsAttachmentUploading(true);
  };
  const handleOnSecureFileUploadDone = async (result: AddSecureFileResult) => {
    setIsAttachmentUploading(false);
    if (result.success) {
      await carbonConnector.commitSecureFile({
        secureFileInfo: result.secureFileInfo,
      });
      setNewSecret((prev) => ({
        ...prev,
        attachments: [
          ...prev.attachments,
          createEmbeddedAttachmentFromSecureFile(result.secureFileInfo),
        ],
      }));
      setHasDataBeenModified(true);
    }
  };
  const getSecondaryActions = () => {
    return activeTab === DOCUMENT_STORAGE
      ? [
          <SecureAttachmentUploadButton
            isQuotaReached={false}
            onFileUploadStarted={handleOnFileUploadStarted}
            onFileUploadDone={handleOnSecureFileUploadDone}
            isShared={false}
            key="uploadAction"
            dataType="KWSecret"
            disabled={!!isUserFrozen}
          />,
        ]
      : [];
  };
  const tabs = isAttachmentsEnabled
    ? [
        {
          id: "tab-secret-detail",
          contentId: "content-secret-detail",
          title: translate(I18N_KEYS.TAB_TITLE_DETAILS_EDITION),
          onSelect: () => setActiveTab(CONTENT),
        },
        {
          id: "tab-secret-attachments",
          contentId: "content-secret-attachments",
          title: translate(I18N_KEYS.TAB_TITLE_ATTACHMENTS_EDITION),
          onSelect: () => setActiveTab(DOCUMENT_STORAGE),
        },
      ]
    : undefined;
  return (
    <EditPanel
      isUsingNewDesign
      isViewingExistingItem={false}
      itemHasBeenEdited={hasDataBeenModified}
      submitPending={isSubmitting}
      onSubmit={submit}
      onNavigateOut={closeAndShowListView}
      formId="add_secret_panel"
      header={
        <Header
          title={
            newSecret.title ? newSecret.title : translate(I18N_KEYS.TITLE_FIELD)
          }
          tabs={tabs}
        />
      }
      secondaryActions={getSecondaryActions()}
    >
      <SecretForm
        activeTab={activeTab}
        isAdmin={false}
        isSecured={newSecret.secured}
        secretValues={newSecret}
        handleChange={handleChange}
        handleFileInfoDetached={handleFileInfoDetached}
        isAttachmentUploading={isAttachmentUploading}
        isNewItem
      />
    </EditPanel>
  );
};
