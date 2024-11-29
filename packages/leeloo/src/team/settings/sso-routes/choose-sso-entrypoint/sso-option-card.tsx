import { MouseEventHandler, ReactNode } from "react";
import { Button, Icon } from "@dashlane/design-system";
import {
  ClockOutlinedIcon,
  GridContainer,
  Paragraph,
  ThemeUIStyleObject,
} from "@dashlane/ui-components";
import { MinimalCard } from "../../components/layout/minimal-card";
export enum InfoListItemType {
  Pro = "pro",
  Con = "con",
  Soon = "soon",
}
const getInfoListItemIcon = (listItemType: InfoListItemType) => {
  switch (listItemType) {
    case InfoListItemType.Pro:
      return (
        <Icon name="CheckmarkOutlined" color="ds.text.positive.standard" />
      );
    case InfoListItemType.Con:
      return (
        <Icon name="ActionCloseOutlined" color="ds.text.warning.standard" />
      );
    case InfoListItemType.Soon:
      return <ClockOutlinedIcon color="ds.text.warning.standard" />;
    default:
      throw new Error("Unexpected branch");
  }
};
export type InfoList = {
  text: string;
  subtext?: string;
  type: InfoListItemType;
  variation?: {
    subtext?: ThemeUIStyleObject;
  };
}[];
interface SSOOptionCardProps {
  title: string;
  badge?: ReactNode;
  infoList: InfoList;
  ctaText: string;
  ctaMuted?: boolean;
  ctaAction: MouseEventHandler;
  ctaDisabled?: boolean;
}
export const SSOOptionCard = ({
  title,
  badge,
  infoList,
  ctaText,
  ctaMuted,
  ctaAction,
  ctaDisabled,
}: SSOOptionCardProps) => {
  return (
    <GridContainer
      as={MinimalCard}
      backgroundColor="ds.background.default"
      paddingSize="tight"
      gridTemplateRows="auto 1fr auto"
    >
      <GridContainer
        gridTemplateColumns="1fr auto"
        alignItems="center"
        gap="8px"
        sx={{ mb: "8px" }}
      >
        <Paragraph bold size="medium">
          {title}
        </Paragraph>
        {badge}
      </GridContainer>
      <ul>
        {infoList.map((listItem, index) => {
          return (
            <GridContainer
              as="li"
              key={listItem.text ?? index}
              gridTemplateColumns="auto 1fr"
              gap="8px"
              sx={{ mb: "24px", "&:last-of-type": { mb: "38px" } }}
            >
              {getInfoListItemIcon(listItem.type)}
              <div>
                <Paragraph color="ds.text.neutral.standard" size="medium">
                  {listItem.text}
                </Paragraph>
                {listItem.subtext ? (
                  <Paragraph
                    color="ds.text.neutral.standard"
                    size="x-small"
                    sx={listItem.variation?.subtext ?? {}}
                  >
                    {listItem.subtext}
                  </Paragraph>
                ) : null}
              </div>
            </GridContainer>
          );
        })}
      </ul>
      <Button
        disabled={ctaDisabled}
        size="small"
        intensity={ctaMuted ? "quiet" : "catchy"}
        mood="brand"
        sx={{ justifySelf: "start" }}
        onClick={ctaAction}
      >
        {ctaText}
      </Button>
    </GridContainer>
  );
};
