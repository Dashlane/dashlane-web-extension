import { Icon, Paragraph } from "@dashlane/design-system";
import { useModuleQuery } from "@dashlane/framework-react";
import { sharingItemsApi } from "@dashlane/sharing-contracts";
import { NoteColors, SecureNote } from "@dashlane/vault-contracts";
import IntelligentTooltipOnOverflow from "../../../libs/dashlane-style/intelligent-tooltip-on-overflow";
import { NoteIcon } from "../../note-icon";
import { SX_STYLES } from "../styles";
export const getNoteIcon = (noteColor: NoteColors) => {
  return (
    <span
      sx={{
        marginRight: "15px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <NoteIcon noteType={noteColor} />
    </span>
  );
};
interface NoteTitleProps {
  note: SecureNote;
  showTitleIcons?: boolean;
  tag?: React.ReactNode;
}
export const NoteTitle = ({
  note,
  showTitleIcons = true,
  tag,
}: NoteTitleProps) => {
  const { data: sharingData } = useModuleQuery(
    sharingItemsApi,
    "getSharingStatusForItem",
    {
      itemId: note.id,
    }
  );
  return (
    <div
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {getNoteIcon(note.color)}
      <div
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          sx={{
            color: "red",
            alignItems: "center",
            display: "flex",
            width: "300px",
          }}
        >
          <IntelligentTooltipOnOverflow
            tooltipText={note.title}
            sx={{
              whiteSpace: "nowrap",
            }}
          >
            <Paragraph
              textStyle="ds.body.standard.regular"
              color="ds.text.neutral.catchy"
            >
              {note.title}
            </Paragraph>
          </IntelligentTooltipOnOverflow>

          {tag ? (
            <div
              sx={{
                marginLeft: "8px",
              }}
            >
              {tag}
            </div>
          ) : null}

          {sharingData?.isShared && showTitleIcons ? (
            <span role="img" aria-hidden sx={SX_STYLES.ICON}>
              <Icon
                name="SharedOutlined"
                size="xsmall"
                color="ds.text.neutral.quiet"
              />
            </span>
          ) : null}

          {!!note.attachments?.length && showTitleIcons ? (
            <span role="img" aria-hidden sx={SX_STYLES.ICON}>
              <Icon
                name="AttachmentOutlined"
                size="xsmall"
                color="ds.text.neutral.quiet"
              />
            </span>
          ) : null}

          {note.isSecured && showTitleIcons ? (
            <span role="img" aria-hidden sx={SX_STYLES.ICON}>
              <Icon
                name="LockOutlined"
                size="xsmall"
                color="ds.text.neutral.quiet"
              />
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};
