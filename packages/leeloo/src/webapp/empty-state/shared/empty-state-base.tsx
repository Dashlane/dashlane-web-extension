import { PropsWithChildren } from "react";
import { Heading, Paragraph, useColorMode } from "@dashlane/design-system";
interface EmptyStateBaseProps {
  title: string;
  description: string;
  illustrationLightSrc: string;
  illustrationDarkSrc?: string;
}
export const EmptyStateBase = ({
  illustrationLightSrc,
  illustrationDarkSrc,
  title,
  description,
  children,
}: PropsWithChildren<EmptyStateBaseProps>) => {
  const [colorMode] = useColorMode();
  const illustrationSource =
    colorMode === "light"
      ? illustrationLightSrc
      : illustrationDarkSrc ?? illustrationLightSrc;
  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        maxWidth: "560px",
        margin: "0 auto",
        height: "100%",
      }}
    >
      <img
        sx={{
          maxWidth: "50%",
          aspectRatio: "3/2",
          alignSelf: "center",
        }}
        src={illustrationSource}
        aria-hidden={true}
        alt=""
      />
      <div sx={{ marginBottom: "16px", textAlign: "center" }}>
        <Heading
          as="h2"
          textStyle="ds.title.section.large"
          sx={{
            marginBottom: "8px",
          }}
        >
          {title}
        </Heading>
        <Paragraph textStyle="ds.body.standard.regular">
          {description}
        </Paragraph>
      </div>
      <div
        sx={{
          display: "flex",
          gap: "8px",
          flexWrap: "nowrap",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-around",
        }}
      >
        {children}
      </div>
    </div>
  );
};
