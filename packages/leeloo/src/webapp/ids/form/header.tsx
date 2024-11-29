import React from "react";
import { colors } from "@dashlane/ui-components";
import { PanelHeader } from "../../panel";
import { IdVaultItemType, ThumbnailSize } from "../types";
import { IdThumbnail } from "../content/thumbnails/id-thumbnail";
import { TabProps } from "../../secure-notes/form/header/header";
interface Props {
  country: string;
  description?: string;
  title: string;
  type: IdVaultItemType;
  tabs?: TabProps[];
}
const RawHeader = ({ country, description, title, type, tabs }: Props) => {
  return (
    <PanelHeader
      icon={
        <IdThumbnail size={ThumbnailSize.Large} country={country} type={type} />
      }
      iconBackgroundColor={colors.dashGreen06}
      title={title}
      titleDescription={description?.toUpperCase()}
      tabs={tabs}
    />
  );
};
export const Header = React.memo(RawHeader);
