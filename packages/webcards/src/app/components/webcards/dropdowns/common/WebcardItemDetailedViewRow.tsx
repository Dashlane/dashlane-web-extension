import {
  jsx,
  ListItem,
  mergeSx,
  Paragraph,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  CONTAINER: {
    width: "100%",
    flexDirection: "column",
    gap: "16px",
    padding: "9px 16px",
  },
  DISABLED_CONTAINER: {
    "&:hover": {
      cursor: "not-allowed",
    },
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
    <ListItem
      onClick={disabled ? undefined : onClick}
      sx={
        disabled
          ? mergeSx([SX_STYLES.CONTAINER, SX_STYLES.DISABLED_CONTAINER])
          : SX_STYLES.CONTAINER
      }
      aria-label={`${label}: ${value}`}
    >
      <div data-keyboard-accessible data-testid={`row-item-${label}`}>
        <Paragraph
          color={
            disabled ? "ds.text.oddity.disabled" : "ds.text.neutral.catchy"
          }
        >
          {label}
        </Paragraph>
        <Paragraph
          color={disabled ? "ds.text.oddity.disabled" : "ds.text.neutral.quiet"}
        >
          {value}
        </Paragraph>
      </div>
    </ListItem>
  );
};
