import React from "react";
import { ItemHeader } from "@dashlane/design-system";
import { useSearchContext } from "../../../../search-field/search-context";
import { SpaceIndicator } from "../../../../../../components/space-indicator/space-indicator";
import styles from "./styles.css";
export interface ContentProps {
  subtitle: string;
  thumbnail: JSX.Element;
  title: string;
  itemSpaceId?: string;
}
export const Content = (props: ContentProps) => {
  const { searchValue } = useSearchContext();
  const { thumbnail, itemSpaceId, subtitle, title } = props;
  return (
    <ItemHeader
      data-testid="section-item-content"
      thumbnail={thumbnail}
      title={title}
      description={subtitle}
      highlightedText={searchValue}
      spaceIndicator={
        itemSpaceId && (
          <SpaceIndicator
            className={styles.spaceIndicator}
            spaceId={itemSpaceId}
          />
        )
      }
    />
  );
};
Content.displayName = "Content";
