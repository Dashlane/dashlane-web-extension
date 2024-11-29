import { Flex } from "@dashlane/design-system";
import { useModuleQuery } from "@dashlane/framework-react";
import { ProgressStatus, secureFilesApi } from "@dashlane/vault-contracts";
import { AttachmentDeleteIcon } from "./attachment-delete-icon";
import { SecureAttachmentProps } from "./types";
import { AttachmentDownloadIcon } from "./attachment-download-icon";
export const AttachmentActionsAndStatus = (props: SecureAttachmentProps) => {
  const { data } = useModuleQuery(secureFilesApi, "secureFileProgress", {
    secureFileKey: props.attachment.downloadKey,
  });
  const status = data ?? ProgressStatus.NotStarted;
  return (
    <Flex alignItems="center" justifyContent="flex-end">
      <AttachmentDownloadIcon status={status} {...props} />
      <AttachmentDeleteIcon {...props} />
    </Flex>
  );
};
