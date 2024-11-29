import { useState } from "react";
import { Button, Flex } from "@dashlane/design-system";
import { AddSecureFileResult, DataModelType } from "@dashlane/communication";
import { Action, UserUpdateVaultItemAttachmentEvent } from "@dashlane/hermes";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useSecureFileUpload } from "../hooks/use-secure-file-upload";
import { validateSecureFile } from "../services/validate-secure-file";
import {
  useIsSecureFileAttachmentUploadAvailable,
  useSecureFileAllowedExtensions,
  useSecureFileUploadAlerts,
} from "../hooks";
import { logEvent } from "../../../libs/logs/logEvent";
import { dataModelTypeToItemType } from "@dashlane/carbon/dist/src/DataManagement/PersonalData/logsHelpers";
interface SecureAttachmentUploadButtonProps {
  onFileUploadStarted: () => void;
  onFileUploadDone: (result: AddSecureFileResult) => void;
  isQuotaReached: boolean;
  isShared: boolean;
  itemId?: string;
  dataType: DataModelType;
  disabled?: boolean;
}
function throwExpression(message: string): never {
  throw new Error(message);
}
export const SecureAttachmentUploadButton = ({
  onFileUploadStarted,
  onFileUploadDone,
  isQuotaReached,
  isShared,
  itemId,
  dataType,
  disabled = false,
}: SecureAttachmentUploadButtonProps) => {
  const isSecureFileUploadAvailable =
    useIsSecureFileAttachmentUploadAvailable(dataType === "KWIDCard") &&
    !isShared;
  const itemType =
    dataModelTypeToItemType[dataType] ??
    throwExpression(`Unsupported Type ${dataType}`);
  const { translate } = useTranslate();
  const { upload, isUploading } = useSecureFileUpload(itemType);
  const [fileName, setFileName] = useState<string>("");
  const { showErrorAlert } = useSecureFileUploadAlerts(fileName);
  const allowedExtensions = useSecureFileAllowedExtensions();
  const handleSelectFile = (event: React.MouseEvent) => {
    if (itemId) {
      logEvent(
        new UserUpdateVaultItemAttachmentEvent({
          attachmentAction: Action.Add,
          itemId: itemId,
          itemType: itemType,
        })
      );
    }
    document.getElementById("secureFileInput")?.click();
    event.preventDefault();
  };
  const fileUploadCallback = (result: AddSecureFileResult) => {
    onFileUploadDone?.(result);
    if (!result.success) {
      showErrorAlert(result.error?.code);
    }
  };
  const onFileUpload = async (file: File) => {
    const validationResult = await validateSecureFile(file);
    if (validationResult.success) {
      onFileUploadStarted();
      setFileName(file.name);
      upload(file, fileUploadCallback);
    } else {
      showErrorAlert(validationResult?.error?.code);
    }
  };
  return isSecureFileUploadAvailable ? (
    <Flex>
      <input
        type="file"
        id="secureFileInput"
        sx={{
          display: "none",
        }}
        onChange={(event) => {
          if (event?.target?.files?.length) {
            onFileUpload(event.target.files[0]);
          }
          event.target.value = "";
        }}
        accept={allowedExtensions?.join(",")}
      />
      <Button
        key="attach"
        mood="neutral"
        intensity="quiet"
        icon="AttachmentOutlined"
        layout="iconLeading"
        onClick={handleSelectFile}
        disabled={isQuotaReached || isUploading || disabled}
      >
        {translate("webapp_secure_notes_add_attachment_action_name")}
      </Button>
    </Flex>
  ) : null;
};
