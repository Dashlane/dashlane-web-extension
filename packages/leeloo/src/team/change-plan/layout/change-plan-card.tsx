import * as React from "react";
import {
  Card,
  Flex,
  Heading,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import { HeadingLevel } from "../../types";
export const ChangePlanCard = ({
  title,
  children,
  headingLevel = "h2",
  sx,
}: {
  title?: string | React.ReactNode;
  children?: React.ReactNode;
  headingLevel?: HeadingLevel;
  sx?: ThemeUIStyleObject;
}) => {
  return (
    <Card sx={{ ...sx }}>
      <Flex flexDirection="column" flexWrap="nowrap" sx={{ height: "100%" }}>
        {title ? (
          typeof title === "string" ? (
            <Heading as={headingLevel} color="ds.text.neutral.standard">
              {title}
            </Heading>
          ) : (
            title
          )
        ) : null}
        <div sx={{ flex: 1 }}>{children}</div>
      </Flex>
    </Card>
  );
};
