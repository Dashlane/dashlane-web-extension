import {
  ExpressiveIcon,
  Heading,
  IconName,
  Paragraph,
} from "@dashlane/design-system";
interface Props {
  iconName: IconName;
  title: string;
  description: string;
}
export const LOMoFeatureDescription = ({
  iconName,
  title,
  description,
}: Props) => {
  return (
    <div sx={{ display: "flex", flexDirection: "row", gap: "16px" }}>
      <ExpressiveIcon name={iconName} mood="brand" />
      <div
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <Heading
          as="h3"
          textStyle="ds.title.block.small"
          color="ds.text.neutral.standard"
        >
          {title}
        </Heading>
        <Paragraph
          textStyle="ds.body.reduced.regular"
          color="ds.text.neutral.quiet"
        >
          {description}
        </Paragraph>
      </div>
    </div>
  );
};
