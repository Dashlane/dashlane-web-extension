import { PropsWithChildren, ReactNode } from "react";
import { DSStyleObject, Flex, Heading, mergeSx } from "@dashlane/design-system";
import { Aside } from "../aside/aside";
const GRID_GAP = "16px";
const VIEW_MAX_WIDTH = "1200px";
const SCROLLBAR_OFFSET = 17;
const LEFT_COLUMN_WIDTH = `${709 + SCROLLBAR_OFFSET}px`;
const RIGHT_COLUMN_WIDTH = "347px";
const SCROLL_CONTAINER_OFFSET = Object.values({
  header: 72,
  tabs: 36,
  tabGap: 32,
}).reduce((acc, val) => acc + val, 0);
const SX_STYLES: Record<string, Partial<DSStyleObject>> = {
  WITH_SCROLL: {
    height: `calc(100vh - ${SCROLL_CONTAINER_OFFSET}px)`,
    overflowY: "auto",
    paddingBottom: "81px",
  },
  WITH_RESPONSIVE_COLUMN: {
    [`@container (max-width:${VIEW_MAX_WIDTH})`]: {
      "&": {
        gridTemplateColumns: "1fr",
      },
    },
  },
};
interface TabProps {
  name?: string;
  aside?: ReactNode;
}
export const Tab = ({ name, aside, children }: PropsWithChildren<TabProps>) => {
  return (
    <>
      {name ? (
        <Heading
          as="h2"
          textStyle="ds.title.section.medium"
          color="ds.text.neutral.catchy"
          sx={{ marginBottom: "24px" }}
        >
          {name}
        </Heading>
      ) : null}

      <div
        sx={{
          containerType: "inline-size",
        }}
      >
        <div
          sx={mergeSx([
            {
              display: "grid",
              gap: GRID_GAP,
              maxWidth: VIEW_MAX_WIDTH,
              gridTemplateColumns: `minmax(0, ${LEFT_COLUMN_WIDTH}) 1fr`,
            },
            SX_STYLES.WITH_SCROLL,
            SX_STYLES.WITH_RESPONSIVE_COLUMN,
          ])}
        >
          <Flex
            flexDirection="row"
            flexWrap="wrap"
            alignContent="start"
            gap={GRID_GAP}
            sx={{
              width: "100%",
              maxWidth: LEFT_COLUMN_WIDTH,
            }}
          >
            {children}
          </Flex>
          <Flex
            as="aside"
            gap={GRID_GAP}
            flexWrap="wrap"
            flexDirection="column"
            alignContent="start"
            sx={{
              maxWidth: RIGHT_COLUMN_WIDTH,
              width: "100%",
            }}
          >
            <Aside>{aside}</Aside>
          </Flex>
        </div>
      </div>
    </>
  );
};
