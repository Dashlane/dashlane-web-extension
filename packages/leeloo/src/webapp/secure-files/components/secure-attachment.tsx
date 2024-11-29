import {
  AttachmentIcon,
  colors,
  ThemeUIStyleObject,
} from "@dashlane/ui-components";
import { Flex, Paragraph } from "@dashlane/design-system";
import { EmbeddedAttachment } from "@dashlane/communication";
import { fromUnixTime } from "date-fns";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useSecureFileDownloadAlerts } from "../hooks/use-secure-file-download-alerts";
import { AttachmentActionsAndStatus } from "../../attachments/attachment-action-and-status";
import { ItemType } from "@dashlane/hermes";
const bytes = require("bytes");
interface SecureAttachmentProps {
  itemType: ItemType;
  attachment: EmbeddedAttachment;
  disableActions: boolean;
  setDisableActions: (state: boolean) => void;
  handleFileInfoDetached?: (secureFileInfoId: string) => void;
  onModalDisplayStateChange?: (isModalOpen: boolean) => void;
  itemId: string;
}
const rowSx: ThemeUIStyleObject = {
  color: `${colors.grey00}`,
  minHeight: "60px",
  position: "relative",
  "&:hover": {
    "& > *:last-child": {
      opacity: 1,
    },
  },
};
const attachmentIconSx: ThemeUIStyleObject = {
  width: 36,
  minWidth: 36,
  height: 36,
  borderRadius: "50%",
  border: "1px solid rgba(0, 0, 0, 0.1)",
  background: colors.dashGreen06,
};
const attachmentNameSx: ThemeUIStyleObject = {
  padding: "0px 8px",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  fontWeight: "bold",
};
const toBytes = (size: number) =>
  bytes(size, {
    decimalPlaces: 0,
    unitSeparator: " ",
  });
const AttachmentFileName = ({
  filename,
  localSize,
}: {
  filename: string;
  localSize: number;
}) => {
  return (
    <Flex alignItems="center" flexWrap="nowrap">
      <Flex sx={attachmentIconSx} alignItems="center" justifyContent="center">
        <AttachmentIcon size={25} color={colors.midGreen00} />
      </Flex>
      <div
        sx={{ display: "flex", flexDirection: "column", overflow: "hidden" }}
      >
        <Paragraph sx={attachmentNameSx}>{filename}</Paragraph>
        <Paragraph
          color="ds.text.neutral.quiet"
          sx={{
            fontSize: "ds.body.helper.regular",
            padding: "0px 8px",
          }}
        >
          {toBytes(localSize)}
        </Paragraph>
      </div>
    </Flex>
  );
};
export const SecureAttachment = (props: SecureAttachmentProps) => {
  const { attachment, itemId, itemType } = props;
  const { translate } = useTranslate();
  useSecureFileDownloadAlerts(attachment);
  return (
    <Flex fullWidth={true} alignItems="center" sx={rowSx}>
      <div sx={{ width: "60%" }}>
        <AttachmentFileName
          filename={attachment.filename}
          localSize={attachment.localSize}
        />
      </div>
      <div sx={{ width: "20%" }}>
        {translate.shortDate(fromUnixTime(attachment.creationDatetime))}
      </div>
      <AttachmentActionsAndStatus
        parentType={itemType}
        parentId={itemId}
        attachment={props.attachment}
        disableActions={props.disableActions}
        setDisableActions={props.setDisableActions}
        handleFileInfoDetached={props.handleFileInfoDetached}
        onModalDisplayStateChange={props.onModalDisplayStateChange}
      />
    </Flex>
  );
};
