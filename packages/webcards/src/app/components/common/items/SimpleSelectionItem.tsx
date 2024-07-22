import * as React from "react";
import {
  AutofillCredentialRisk,
  SimpleWebcardItem,
} from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import {
  Badge,
  BadgeProps,
  Button,
  Icon,
  jsx,
  mergeSx,
  Tooltip,
} from "@dashlane/design-system";
import { KEYBOARD_EVENTS } from "../../../constants";
import { I18nContext } from "../../../context/i18n";
import { useCommunication } from "../../../context/communication";
import { getItemSubtitle } from "../../../utils/formatter/simpleWebcardItemStrings";
import { Space, useSpaceInfosPatcher } from "../generic/Space";
import { getIconName } from "../icons/icons";
import { HighlightedSearchValue } from "./HighlightedSearchValue";
import { MORE_BUTTON_CLASS, SX_STYLES } from "./Items.styles";
interface Props {
  item: SimpleWebcardItem;
  itemIndex?: number;
  onClick: (item: SimpleWebcardItem) => void;
  onClickMoreButton?: (item: SimpleWebcardItem) => void;
  searchValue?: string;
  showIcon?: boolean;
  withLastUsedBadge?: boolean;
  risk?: AutofillCredentialRisk;
}
const riskBadgeOptions: Record<
  AutofillCredentialRisk,
  Pick<BadgeProps, "mood" | "intensity" | "label"> & {
    tooltipContent: string;
    route: string;
  }
> = {
  compromised: {
    mood: "danger",
    intensity: "quiet",
    label: "passwordHealthBadgeCompromisedTitle",
    tooltipContent: "passwordHealthBadgeCompromisedTooltip",
    route: "/password-health/compromised",
  },
  weak: {
    mood: "warning",
    intensity: "quiet",
    label: "passwordHealthBadgeWeakTitle",
    tooltipContent: "passwordHealthBadgeWeakTooltip",
    route: "/password-health/weak",
  },
  reused: {
    mood: "neutral",
    intensity: "quiet",
    label: "passwordHealthBadgeReusedTitle",
    tooltipContent: "passwordHealthBadgeReusedTooltip",
    route: "/password-health/reused",
  },
};
export const SimpleSelectionItem = ({
  withLastUsedBadge,
  item,
  onClick,
  onClickMoreButton,
  showIcon,
  itemIndex,
  searchValue,
  risk,
}: Props) => {
  const { translate } = React.useContext(I18nContext);
  const { autofillEngineCommands } = useCommunication();
  const { itemId, itemType } = item;
  const defaultEmptyTitle = "--";
  const {
    content,
    communicationType,
    isLinkedWebsite,
    isTitleFixedType,
    space,
    title,
  } = item;
  const getSpaceInfos = useSpaceInfosPatcher();
  const iconName = getIconName(itemType);
  const itemContent = getItemSubtitle(
    itemType,
    content,
    communicationType,
    title,
    translate
  );
  const itemTitle = isTitleFixedType ? translate(title) : title;
  const openPasswordHeathView = (
    event:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.KeyboardEvent<HTMLDivElement>,
    route: string
  ) => {
    event.stopPropagation();
    autofillEngineCommands?.openWebapp({ route });
  };
  const badge = (): JSX.Element | null => {
    if (risk) {
      const { label, intensity, mood, route, tooltipContent } =
        riskBadgeOptions[risk];
      return (
        <Tooltip content={translate(tooltipContent)}>
          <div
            role="button"
            tabIndex={0}
            onClick={(event) => openPasswordHeathView(event, route)}
            onKeyUp={(event) => {
              if (
                event.key !== KEYBOARD_EVENTS.ENTER &&
                event.key !== KEYBOARD_EVENTS.SPACE
              ) {
                return;
              }
              openPasswordHeathView(event, route);
            }}
            data-keyboard-accessible={translate(label)}
          >
            <Badge
              mood={mood}
              intensity={intensity}
              label={translate(label)}
              layout="iconLeading"
              iconName="FeedbackWarningOutlined"
              sx={{ marginLeft: "5px" }}
              data-testid={`ph-indicator-${itemId}`}
            />
          </div>
        </Tooltip>
      );
    } else if (withLastUsedBadge && itemIndex === 0) {
      return (
        <Badge
          mood="brand"
          intensity="quiet"
          label={translate("lastUsedItem")}
          sx={{ marginLeft: "5px" }}
        />
      );
    }
    return null;
  };
  return (
    <div
      key={itemId}
      sx={SX_STYLES.ITEM}
      onClick={() => onClick(item)}
      onKeyUp={(e) => {
        if (
          e.key !== KEYBOARD_EVENTS.ENTER &&
          e.key !== KEYBOARD_EVENTS.SPACE
        ) {
          return;
        }
        onClick(item);
      }}
      data-testid={itemId}
      role="button"
      tabIndex={0}
      data-keyboard-accessible={`${title}: ${content}`}
    >
      {showIcon && iconName ? (
        <div
          sx={mergeSx([
            SX_STYLES.ICON_CONTAINER,
            SX_STYLES.SIMPLE_ICON_BACKGROUND,
          ])}
        >
          <Icon name={iconName} size="large" />
        </div>
      ) : null}
      <div sx={SX_STYLES.CONTENT}>
        <div data-testid="item-title" sx={SX_STYLES.TITLE}>
          <div sx={SX_STYLES.TITLE_BADGE_CONTAINER} data-testid="title-badge">
            <div sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              <HighlightedSearchValue
                text={itemTitle || defaultEmptyTitle}
                search={searchValue}
              />
            </div>
            {badge()}
            {space ? (
              <div
                sx={SX_STYLES.SPACE}
                data-testid={`SpaceBadge-${itemIndex?.toString()}`}
              >
                <Space {...getSpaceInfos(space)} name={space.displayName} />
              </div>
            ) : null}
          </div>
        </div>
        {itemContent ? (
          <div sx={SX_STYLES.SUBTITLE}>
            <HighlightedSearchValue text={itemContent} search={searchValue} />
            {isLinkedWebsite ? (
              <div sx={SX_STYLES.ICON} data-testid="LinkIcon">
                <Icon name="LinkOutlined" size="xsmall" />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      {onClickMoreButton ? (
        <Button
          type="button"
          mood="neutral"
          intensity="supershy"
          size="small"
          layout="iconOnly"
          className={MORE_BUTTON_CLASS}
          onClick={(e) => {
            e.stopPropagation();
            onClickMoreButton(item);
          }}
          icon={<Icon name="CaretRightOutlined" aria-hidden />}
          data-keyboard-accessible
        />
      ) : null}
    </div>
  );
};
