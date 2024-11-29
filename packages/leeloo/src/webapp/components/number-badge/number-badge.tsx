import { Flex, Paragraph } from "@dashlane/design-system";
export const NumberBadge = ({ rank }: { rank: number }) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      sx={{
        width: "32px",
        height: "32px",
        borderRadius: "10.67px",
        padding: "6px",
        backgroundColor: "ds.container.expressive.brand.quiet.disabled",
      }}
    >
      <Paragraph
        textStyle="ds.body.standard.strong"
        color="ds.text.brand.quiet"
      >
        {rank}
      </Paragraph>
    </Flex>
  );
};
