import { Flex, Heading, Paragraph } from "@dashlane/design-system";
export interface Props {
  content: string;
  header: string;
  index: number;
}
export const Step = ({ content, header, index }: Props) => {
  return (
    <Flex gap="8px" sx={{ flexFlow: "row", flexBasis: "25%" }}>
      <Flex
        justifyContent="center"
        alignItems="center"
        sx={{
          width: 36,
          height: 36,
          borderRadius: 36,
          flexShrink: 0,
          backgroundColor: "ds.container.expressive.brand.quiet.idle",
          color: "ds.text.brand.standard",
        }}
      >
        {index}
      </Flex>
      <section>
        <Heading
          as="h4"
          textStyle="ds.title.block.medium"
          sx={{ marginBottom: "8px" }}
        >
          {header}
        </Heading>
        <Paragraph
          textStyle="ds.body.reduced.regular"
          color="ds.text.neutral.quiet"
        >
          {content}
        </Paragraph>
      </section>
    </Flex>
  );
};
