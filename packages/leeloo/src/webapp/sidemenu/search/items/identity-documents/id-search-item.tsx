import React from "react";
import { Link } from "../../../../../libs/router";
import { Flex } from "@dashlane/design-system";
import { GridContainer, Paragraph } from "@dashlane/ui-components";
import { IdThumbnail } from "../../../../ids/content/thumbnails/id-thumbnail";
import { QuickActions } from "../../../../ids/quick-actions/quick-actions";
import { IdVaultItemType, ThumbnailSize } from "../../../../ids/types";
import styles from "./id-search-item.css";
interface Props {
  itemId: string;
  type: IdVaultItemType;
  country: string;
  route: string;
  idNumber: string;
  primaryDisplayData: string;
  secondaryDisplayData: string;
  onSelectId: () => void;
}
const preventDragAndDrop = (e: React.DragEvent<HTMLElement>) =>
  e.preventDefault();
export const IdSearchItem = ({
  itemId,
  primaryDisplayData,
  secondaryDisplayData,
  idNumber,
  country,
  type,
  route,
  onSelectId,
}: Props) => {
  return (
    <Link
      className={styles.link}
      onClick={() => {
        onSelectId();
      }}
      to={route}
      onDragStart={preventDragAndDrop}
      onDrop={preventDragAndDrop}
    >
      <Flex
        justifyContent="space-between"
        fullWidth
        sx={{
          minWidth: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <GridContainer
          gap="16px"
          gridTemplateColumns="48px 1fr"
          alignItems="center"
          as="span"
        >
          <IdThumbnail
            size={ThumbnailSize.Small}
            country={country}
            type={type}
          />
          <Flex
            flexDirection="column"
            flexWrap="nowrap"
            sx={{
              minWidth: 0,
            }}
          >
            <Paragraph
              size="medium"
              bold
              as="strong"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {primaryDisplayData}
            </Paragraph>
            <Paragraph
              size="x-small"
              as="span"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {secondaryDisplayData}
            </Paragraph>
          </Flex>
        </GridContainer>
        <span className={styles.quickActions}>
          <QuickActions
            itemId={itemId}
            copyValue={idNumber}
            editRoute={route}
            variant="search"
            type={type}
          />
        </span>
      </Flex>
    </Link>
  );
};
