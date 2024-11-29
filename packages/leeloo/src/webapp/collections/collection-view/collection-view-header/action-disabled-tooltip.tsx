import { SharingDisabledReason } from "@dashlane/sharing-contracts";
interface SharingDisabledTooltipProps {
  tooltipTitle: string;
  tooltipDescription: string;
}
const I18N_KEYS = {
  SHARING_DISABLED: "team_sharing_disabled",
  SHARING_DISABLED_DESCRIPTION: "team_sharing_disabled_description",
  SHARING_DISABLED_EDITOR: "webapp_collection_sharing_disabled_editor_title",
  SHARING_DISABLED_EDITOR_DESCRIPTION:
    "webapp_collection_sharing_disabled_editor_description",
  SHARING_DISABLED_LIMITED: "webapp_collection_sharing_disabled_limited_title",
  SHARING_DISABLED_LIMITED_DESCRIPTION:
    "webapp_collection_sharing_disabled_limited_description",
};
export const sharingDisabledTooltipTitleAndDescription = (
  reason?: SharingDisabledReason
) => {
  switch (reason) {
    case SharingDisabledReason.DisabledInTAC:
      return {
        title: I18N_KEYS.SHARING_DISABLED,
        description: I18N_KEYS.SHARING_DISABLED_DESCRIPTION,
      };
    case SharingDisabledReason.EditorRole:
      return {
        title: I18N_KEYS.SHARING_DISABLED_EDITOR,
        description: I18N_KEYS.SHARING_DISABLED_EDITOR_DESCRIPTION,
      };
    case SharingDisabledReason.LimitedRightItems:
      return {
        title: I18N_KEYS.SHARING_DISABLED_LIMITED,
        description: I18N_KEYS.SHARING_DISABLED_LIMITED_DESCRIPTION,
      };
    default:
      return undefined;
  }
};
export const CollectionActionDisabledTooltip = ({
  tooltipTitle,
  tooltipDescription,
}: SharingDisabledTooltipProps) => {
  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "16px",
        borderRadius: "8px",
        textAlign: "left",
      }}
    >
      <div sx={{ paddingBottom: "8px", fontWeight: "600", fontSize: "18px" }}>
        {tooltipTitle}
      </div>
      <div>{tooltipDescription}</div>
    </div>
  );
};
