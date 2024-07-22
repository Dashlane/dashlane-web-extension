import * as React from "react";
import { jsx, mergeSx, ThemeUIStyleObject } from "@dashlane/design-system";
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  CONTAINER: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    padding: "9px 16px",
    alignItems: "center",
    cursor: "pointer",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "ds.container.agnostic.neutral.quiet",
    },
  },
  DISABLED_CONTAINER: {
    backgroundColor: "ds.container.expressive.neutral.catchy.disabled",
    "&:hover": {
      cursor: "not-allowed",
      backgroundColor: "ds.container.expressive.neutral.catchy.disabled",
    },
    ">span": { color: "ds.text.oddity.disabled" },
  },
  PROPERTY_LABEL: {
    fontWeight: "400",
    fontSize: "12px",
    lineHeight: "12px",
    color: "ds.text.neutral.quiet",
    overflowX: "unset",
    whiteSpace: "nowrap",
  },
  PROPERTY_VALUE: {
    fontWeight: "400",
    fontSize: "16px",
    lineHeight: "20px",
    color: "ds.text.neutral.standard",
    overflowX: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  DIVIDER: {
    border: "none",
    borderTop: "1px solid",
    borderTopColor: "ds.border.neutral.quiet.idle",
    padding: "0",
    margin: "0",
  },
};
interface Props {
  label: string;
  value?: string;
  disabled?: boolean;
  onClick: () => void;
}
export const WebcardItemDetailedViewRow = ({
  onClick,
  label,
  value,
  disabled,
}: Props) => {
  return (
    <React.Fragment>
      <div
        sx={
          disabled
            ? mergeSx([SX_STYLES.CONTAINER, SX_STYLES.DISABLED_CONTAINER])
            : SX_STYLES.CONTAINER
        }
        onClick={disabled ? undefined : onClick}
        role="button"
        tabIndex={0}
        data-keyboard-accessible
      >
        <span sx={SX_STYLES.PROPERTY_LABEL}>{label}</span>
        <span sx={SX_STYLES.PROPERTY_VALUE}>{value}</span>
      </div>
      <hr sx={SX_STYLES.DIVIDER} />
    </React.Fragment>
  );
};
