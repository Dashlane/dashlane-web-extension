import { PropsWithChildren, ReactNode } from "react";
import {
  DSStyleObject,
  Heading,
  mergeSx,
  Paragraph,
} from "@dashlane/design-system";
const SX_STYLES: Record<string, Partial<DSStyleObject>> = {
  CENTER_LABEL: { marginTop: "12px" },
};
interface RowProps {
  label: string;
  labelHelper?: string | JSX.Element | ReactNode;
  centerLabel?: boolean;
}
const Row = ({
  label,
  labelHelper,
  centerLabel,
  children,
}: PropsWithChildren<RowProps>) => {
  return (
    <div
      sx={{
        display: "flex",
        flexWrap: "nowrap",
        alignItems: "flex-start",
      }}
    >
      <div
        sx={{
          flexGrow: "1",
          maxWidth: "50%",
          paddingRight: "40px",
        }}
      >
        <Heading
          as="h3"
          textStyle="ds.title.block.medium"
          color="ds.text.neutral.catchy"
          sx={mergeSx([
            { marginBottom: "4px" },
            centerLabel ? SX_STYLES.CENTER_LABEL : {},
          ])}
        >
          {label}
        </Heading>
        {labelHelper ? (
          <Paragraph
            textStyle="ds.body.standard.regular"
            color="ds.text.neutral.quiet"
          >
            {labelHelper}
          </Paragraph>
        ) : null}
      </div>
      <div
        sx={{
          flexGrow: "1",
          maxWidth: "50%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {children}
      </div>
    </div>
  );
};
export default Row;
