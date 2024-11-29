import { ReactNode } from "react";
import { GridChild, GridContainer, PropsOf } from "@dashlane/ui-components";
interface ResponsiveGridWithSideCardProps
  extends PropsOf<typeof GridContainer> {
  mainContent: ReactNode;
  secondaryContent: ReactNode;
  secondaryContentWrapDirection?: "top" | "bottom";
  fullWidth?: boolean;
  reducedVerticalPadding?: boolean;
  secondaryContentWidth?: string;
}
const mainContentSizeHandler = (fullWidth: boolean) =>
  !fullWidth ? "800px" : "auto";
export const ResponsiveMainSecondaryLayout = ({
  mainContent,
  secondaryContent,
  secondaryContentWrapDirection = "top",
  fullWidth,
  reducedVerticalPadding,
  secondaryContentWidth,
  ...rest
}: ResponsiveGridWithSideCardProps) => (
  <GridContainer
    gap="32px"
    gridTemplateAreas={["'top' 'bottom'", "'top' 'bottom'", "'left right'"]}
    gridTemplateColumns={[
      null,
      null,
      `minmax(auto, ${mainContentSizeHandler(fullWidth ?? false)}) ${
        secondaryContentWidth ?? "256px"
      }`,
    ]}
    gridTemplateRows={["auto auto", "auto auto", "auto"]}
    alignContent="flex-start"
    sx={{
      py: reducedVerticalPadding ? "16px" : "32px",
      px: "42px",
    }}
    {...rest}
  >
    <GridChild
      alignSelf="flex-start"
      gridArea={
        secondaryContentWrapDirection === "top"
          ? ["top", "top", "right"]
          : ["bottom", "bottom", "right"]
      }
    >
      {secondaryContent}
    </GridChild>
    <GridChild
      gridArea={
        secondaryContentWrapDirection === "top"
          ? ["bottom", "bottom", "left"]
          : ["top", "top", "left"]
      }
    >
      {mainContent}
    </GridChild>
  </GridContainer>
);
