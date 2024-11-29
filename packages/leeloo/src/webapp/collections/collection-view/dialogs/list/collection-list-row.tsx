import { ChangeEvent, memo, MouseEvent, ReactNode } from "react";
import {
  Checkbox,
  ItemHeader,
  ListItem,
  Tooltip,
} from "@dashlane/design-system";
import useTranslate from "../../../../../libs/i18n/useTranslate";
interface CollectionListItemProps {
  title: string;
  description?: string;
  isShared: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  isLimitedRight: boolean;
  thumbnail: ReactNode;
  tooltip: ReactNode;
  onToggle: (event: MouseEvent | ChangeEvent) => void;
}
export const CollectionListItem = memo(function CollectionListItem({
  title,
  description,
  isShared,
  isDisabled,
  isSelected,
  isLimitedRight,
  onToggle,
  thumbnail,
  tooltip,
}: CollectionListItemProps) {
  const { translate } = useTranslate();
  const handleToggle = !isDisabled ? onToggle : undefined;
  return (
    <Tooltip content={tooltip} wrapTrigger>
      <ListItem
        sx={{
          cursor: isDisabled ? "not-allowed" : "pointer",
        }}
        aria-label={title}
        onClick={handleToggle}
        checkboxSlot={
          <Checkbox
            aria-label={translate(
              "webapp_collection_bulk_add_collection_checkbox_aria_label",
              {
                itemName: title,
              }
            )}
            checked={isSelected}
            readOnly={isDisabled}
            tooltip={tooltip}
            onChange={handleToggle}
          />
        }
      >
        <ItemHeader
          sx={{
            cursor: isDisabled ? "not-allowed" : "pointer",
          }}
          title={title}
          description={description}
          icons={isShared ? ["SharedOutlined"] : undefined}
          badge={
            isLimitedRight
              ? {
                  label: translate(
                    "webapp_collection_sharing_disabled_limited_title"
                  ),
                  mood: "neutral",
                  intensity: "supershy",
                }
              : undefined
          }
          thumbnail={thumbnail}
        />
      </ListItem>
    </Tooltip>
  );
});
