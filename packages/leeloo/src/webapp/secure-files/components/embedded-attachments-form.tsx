import { useEffect, useState } from "react";
import { EmbeddedAttachment } from "@dashlane/communication";
import { ItemType } from "@dashlane/hermes";
import {
  AttachmentIcon,
  colors,
  ThemeUIStyleObject,
} from "@dashlane/ui-components";
import { Flex, Infobox, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useSecureFilesQuota } from "../../secure-files/hooks/use-secure-files-quota";
import {
  DISPLAY_SECURE_FILES_QUOTA_WARNING_THRESHOLD,
  formatQuota,
} from "../../secure-files/helpers/quota";
import { ContentCard } from "../../panel/standard/content-card";
import { SecureAttachment } from "./secure-attachment";
const I18N_KEYS = {
  MAX_CONTENT_LENGTH_EXCEEDED:
    "webapp_secure_file_error_upload_max_length_excedeed",
  QUOTA_EXCEDEED: "webapp_secure_file_error_upload_quota_excedeed",
  INVALID_FILE_TYPE: "webapp_secure_file_error_file_type_not_allowed",
  UNKNOWN_ERROR: "webapp_secure_file_error_unknown",
  UPLOAD_SUCCESS: "webapp_secure_file_upload_success",
  ATTACHMENT_NAME:
    "webapp_secure_notes_addition_field_tab_attachments_table_title_name",
  ATTACHMENT_CREATION_DATE:
    "webapp_secure_notes_addition_field_tab_attachments_table_title_creation_date",
  ATTACHMENT_FILE_SIZE:
    "webapp_secure_notes_addition_field_tab_attachments_table_title_file_size",
  STORAGE_QUOTA_INFO: "webapp_secure_file_storage_quota_info",
  EMPTY_ATTACHMENTS: "webapp_secure_file_empty_attachments_markup",
  REMAINING_QUOTA: "webapp_secure_file_storage_quota_info",
  ATTACHMENT_TITLE: "webapp_secure_file_attachment_title",
};
interface AdditionalProps {
  itemId: string;
  itemType: ItemType;
  handleFileInfoDetached: (secureFileInfoId: string) => void;
  onModalDisplayStateChange?: (isModalOpen: boolean) => void;
  isUploading: boolean;
}
type Props = {
  attachments: EmbeddedAttachment[];
  additionalProps: AdditionalProps;
};
const ContentCardWrapper: React.FC<{
  children: JSX.Element;
}> = ({ children }) => {
  const { translate } = useTranslate();
  return (
    <ContentCard title={translate(I18N_KEYS.ATTACHMENT_TITLE)}>
      {children}
    </ContentCard>
  );
};
export const EmbeddedAttachmentsForm = ({
  attachments,
  additionalProps,
}: Props) => {
  const { translate } = useTranslate();
  const [disableActions, setDisableActions] = useState(false);
  const secureFilesQuota = useSecureFilesQuota();
  const shouldDisplaySecureFilesQuotaWarning =
    secureFilesQuota.max > 0 &&
    secureFilesQuota.remaining < DISPLAY_SECURE_FILES_QUOTA_WARNING_THRESHOLD;
  const headerSx: ThemeUIStyleObject = {
    borderBottom: `1px solid ${colors.grey06}`,
    color: "ds.text.neutral.quiet",
    alignSelf: "center",
    fontSize: "12px",
    textTransform: "uppercase",
  };
  useEffect(() => {
    setDisableActions(additionalProps.isUploading);
  }, [additionalProps.isUploading]);
  return (
    <ContentCardWrapper>
      <Flex
        flexDirection="column"
        sx={{ padding: "12px 0px", flex: 1, overflow: "hidden" }}
      >
        <Flex
          flexDirection="column"
          alignItems="center"
          fullWidth={true}
          sx={{ flex: 1, overflowY: "auto", flexWrap: "nowrap" }}
        >
          {attachments?.length > 0 ? (
            <Flex
              fullWidth={true}
              alignItems="center"
              sx={{
                backgroundColor: "ds.container.agnostic.neutral.quiet",
                borderRadius: "4px",
                padding: "0px 4px",
                height: "28px",
              }}
            >
              <Paragraph
                sx={{
                  ...headerSx,
                  width: "60%",
                }}
              >
                {translate(I18N_KEYS.ATTACHMENT_NAME)}
              </Paragraph>
              <Paragraph
                sx={{
                  ...headerSx,
                  width: "40%",
                }}
              >
                {translate(I18N_KEYS.ATTACHMENT_CREATION_DATE)}
              </Paragraph>
            </Flex>
          ) : (
            <Flex
              justifyContent="center"
              flexDirection="column"
              alignItems="center"
              sx={{ flex: 1 }}
            >
              <AttachmentIcon
                size={70}
                color={colors.dashGreen04}
                sx={{ marginBottom: "24px" }}
              />
              <Paragraph
                sx={{ textAlign: "center", color: "ds.text.neutral.catchy" }}
              >
                {translate.markup(I18N_KEYS.EMPTY_ATTACHMENTS)}
              </Paragraph>
            </Flex>
          )}
          {attachments
            ? attachments.map((attachment: EmbeddedAttachment) => {
                return (
                  <SecureAttachment
                    key={attachment.id}
                    attachment={attachment}
                    handleFileInfoDetached={
                      additionalProps?.handleFileInfoDetached
                    }
                    disableActions={disableActions}
                    setDisableActions={setDisableActions}
                    onModalDisplayStateChange={
                      additionalProps.onModalDisplayStateChange
                    }
                    itemId={additionalProps.itemId}
                    itemType={additionalProps.itemType}
                  />
                );
              })
            : null}
        </Flex>
        {shouldDisplaySecureFilesQuotaWarning ? (
          <Infobox
            mood="danger"
            title={translate(
              I18N_KEYS.REMAINING_QUOTA,
              formatQuota(secureFilesQuota.remaining, secureFilesQuota.max)
            )}
            sx={{ flex: 0, marginTop: "16px" }}
          />
        ) : null}
      </Flex>
    </ContentCardWrapper>
  );
};
