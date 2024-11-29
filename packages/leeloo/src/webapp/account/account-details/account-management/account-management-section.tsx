import { PropsWithChildren } from "react";
import { GridContainer } from "@dashlane/ui-components";
import { Heading } from "@dashlane/design-system";
interface Props {
  sectionTitle?: React.ReactNode;
  showBorder: boolean;
}
export const AccountManagementSection = ({
  sectionTitle,
  children,
  showBorder = false,
}: PropsWithChildren<Props>) => {
  return (
    <>
      {showBorder ? (
        <hr
          sx={{
            border: "none",
            borderTop: "1px solid transparent",
            margin: 0,
            width: "100%",
            borderColor: "ds.border.neutral.quiet.idle",
          }}
        />
      ) : null}

      <GridContainer
        gap="8px"
        sx={{ padding: "16px" }}
        gridTemplateColumns="auto"
      >
        {sectionTitle ? (
          <Heading
            as="h2"
            textStyle="ds.title.block.medium"
            color="ds.text.neutral.catchy"
          >
            {sectionTitle}
          </Heading>
        ) : null}

        {children}
      </GridContainer>
    </>
  );
};
