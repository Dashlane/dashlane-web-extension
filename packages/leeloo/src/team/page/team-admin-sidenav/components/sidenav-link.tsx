import { ReactNode } from "react";
import { mergeSx, ThemeUIStyleObject } from "@dashlane/design-system";
export interface SidenavLinkProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  selected?: boolean;
  collapsed?: boolean;
  hasNotification?: boolean;
  icon: ReactNode;
  label: string;
  endAdornment?: ReactNode;
  inAccordion?: boolean;
}
export const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  CONTAINER: {
    alignItems: "center",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    padding: "4px 12px",
    minHeight: "40px",
  },
  CONTAINER_ON_HOVER: {
    "&:hover": {
      backgroundColor: "ds.container.expressive.neutral.supershy.hover",
    },
  },
  CONTAINER_COLLAPSED: {
    textStyle: "ds.title.block.small",
    alignItems: "center",
    flexDirection: "column",
    padding: "6px",
  },
  CONTAINER_SELECTED: {
    backgroundColor: "ds.container.expressive.neutral.supershy.active",
  },
  END_ADORNMENT: {
    flex: "1 1 auto",
  },
  END_ADORNMENT_COLLAPSED: {
    display: "none",
  },
  ICON: {
    marginBottom: "0",
    marginRight: "16px",
    minWidth: "20px",
    svg: {
      fill: "ds.text.inverse.catchy",
    },
    "&:hover": {
      svg: {
        fill: "ds.text.inverse.catchy",
      },
    },
  },
  ICON_COLLAPSED: {
    marginBottom: "4px",
    marginRight: "0",
  },
  LABEL: {
    color: "ds.text.inverse.catchy",
    hyphens: "auto",
    minWidth: "0",
    wordWrap: "break-word",
    flex: "1 1 auto",
  },
  LABEL_COLLAPSED: {
    textStyle: "ds.title.block.small",
    textAlign: "center",
    width: "100%",
  },
  LABEL_CONTAINER: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: "2px 12px",
    width: "100%",
    flexWrap: "wrap",
  },
  NOTIFICATION: {
    alignSelf: "flex-start",
    backgroundColor: "ds.container.expressive.warning.catchy.idle",
    borderRadius: "50%",
    flexShrink: "0",
    height: "8px",
    marginLeft: "4px",
    width: "8px",
  },
  NOTIFICATION_COLLAPSED: {
    position: "absolute",
    right: "18px",
  },
  TEXT_MEDIUM: {
    textStyle: "ds.title.block.medium",
  },
};
export const SidenavLink = ({
  collapsed,
  hasNotification,
  icon,
  label,
  endAdornment,
  selected,
  inAccordion = false,
  ...rest
}: SidenavLinkProps) => {
  const containerSx = mergeSx([
    SX_STYLES.CONTAINER,
    collapsed ? SX_STYLES.CONTAINER_COLLAPSED : SX_STYLES.TEXT_MEDIUM,
    selected && !inAccordion ? SX_STYLES.CONTAINER_SELECTED : {},
    !inAccordion
      ? SX_STYLES.CONTAINER_ON_HOVER
      : { padding: 0, minHeight: "none" },
  ]);
  const iconSx = mergeSx([
    SX_STYLES.ICON,
    collapsed ? SX_STYLES.ICON_COLLAPSED : {},
  ]);
  const labelSx = mergeSx([
    SX_STYLES.LABEL,
    collapsed ? SX_STYLES.LABEL_COLLAPSED : SX_STYLES.TEXT_MEDIUM,
  ]);
  const notificationSx = mergeSx([
    SX_STYLES.NOTIFICATION,
    collapsed ? SX_STYLES.NOTIFICATION_COLLAPSED : {},
  ]);
  return (
    <span sx={containerSx} {...rest}>
      <span sx={iconSx}> {icon} </span>
      {endAdornment ? (
        <div sx={SX_STYLES.LABEL_CONTAINER}>
          <span sx={labelSx}>{label}</span>
          <div sx={collapsed ? SX_STYLES.END_ADORNMENT_COLLAPSED : {}}>
            {endAdornment}
          </div>
        </div>
      ) : (
        <span sx={labelSx}>{label}</span>
      )}
      {hasNotification ? <span sx={notificationSx} /> : null}
    </span>
  );
};
