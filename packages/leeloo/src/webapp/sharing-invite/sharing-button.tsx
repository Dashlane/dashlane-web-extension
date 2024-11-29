import { ButtonProps, Flex, Icon } from "@dashlane/design-system";
import { Placement } from "@dashlane/ui-components";
import { Origin } from "@dashlane/hermes";
import { DisabledButtonWithTooltip } from "../../libs/dashlane-style/buttons/DisabledButtonWithTooltip";
import { useIsAllowedToShare } from "../../libs/hooks/use-is-allowed-to-share";
import { useIsSharingEnabledData } from "../../libs/carbon/hooks/useIsSharingEnabled";
import { useFrozenState } from "../../libs/frozen-state/frozen-state-dialog-context";
import useTranslate from "../../libs/i18n/useTranslate";
import { HEADER_BREAKPOINT_SIZE } from "../components/header/constants";
import { useDialog } from "../dialog";
import { Sharing } from "./types";
import { SharingInviteDialog } from "./sharing-invite-dialog";
import { SharingLimitReachedDialog } from "./limit-reached";
import { useIsHeaderWidthAboveSize } from "../components/header/useIsHeaderWidthAboveSize";
const I18N_KEYS = {
  SHARE_ITEM: "webapp_sharing_center_share_item",
  SHARING_DISABLED: "team_sharing_disabled",
  SHARING_DISABLED_DESCRIPTION: "team_sharing_disabled_description",
};
interface SharingButtonProps {
  hideIcon?: boolean;
  sharing: Sharing;
  text?: string;
  tooltipPlacement?: Placement;
  origin: Origin;
  intensity?: ButtonProps["intensity"];
  mood?: ButtonProps["mood"];
  icon?: ButtonProps["icon"];
  layout?: ButtonProps["layout"];
  buttonClick?: () => void;
}
export const SharingButton = ({
  hideIcon = false,
  sharing,
  text,
  origin,
  tooltipPlacement = "bottom-start",
  intensity,
  mood,
  icon,
  layout,
  buttonClick,
}: SharingButtonProps) => {
  const { openDialog, closeDialog } = useDialog();
  const isSharingEnabled = useIsSharingEnabledData();
  const isAllowedToShare = useIsAllowedToShare();
  const { translate } = useTranslate();
  const isHeaderWidthAboveSize = useIsHeaderWidthAboveSize(
    HEADER_BREAKPOINT_SIZE
  );
  const {
    openDialog: openTrialDiscontinuedDialog,
    shouldShowFrozenStateDialog,
  } = useFrozenState();
  if (shouldShowFrozenStateDialog === null) {
    return null;
  }
  const handleClick = () => {
    buttonClick?.();
    if (shouldShowFrozenStateDialog) {
      openTrialDiscontinuedDialog();
    } else if (isAllowedToShare && sharing) {
      openDialog(
        <SharingInviteDialog
          sharing={sharing}
          onDismiss={closeDialog}
          origin={origin}
        />
      );
    } else {
      openDialog(<SharingLimitReachedDialog closeDialog={closeDialog} />);
    }
  };
  return (
    <DisabledButtonWithTooltip
      onClick={handleClick}
      mood={mood ? mood : "neutral"}
      intensity={intensity ? intensity : "supershy"}
      layout={
        layout ? layout : isHeaderWidthAboveSize ? "iconLeading" : "iconOnly"
      }
      size="medium"
      icon={
        !hideIcon ? (
          icon ? (
            icon
          ) : (
            <Icon name="ActionShareOutlined" color="ds.text.neutral.standard" />
          )
        ) : null
      }
      disabled={!isSharingEnabled}
      placement={tooltipPlacement}
      content={
        <Flex
          flexDirection="column"
          alignItems="flex-start"
          sx={{ padding: "16px", borderRadius: "8px", textAlign: "left" }}
        >
          <div
            sx={{ paddingBottom: "8px", fontWeight: "600", fontSize: "18px" }}
          >
            {translate(I18N_KEYS.SHARING_DISABLED)}
          </div>
          <div>{translate(I18N_KEYS.SHARING_DISABLED_DESCRIPTION)}</div>
        </Flex>
      }
    >
      {text ?? translate(I18N_KEYS.SHARE_ITEM)}
    </DisabledButtonWithTooltip>
  );
};
