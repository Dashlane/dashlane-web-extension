import { Flex, Heading, Paragraph } from "@dashlane/design-system";
export type TipProps = {
  title: string;
  message: string;
  action?: JSX.Element;
};
export const Tip = ({ title, message, action }: TipProps) => {
  return (
    <>
      <Heading
        as="h5"
        color="ds.text.neutral.catchy"
        textStyle="ds.title.block.medium"
      >
        {title}
      </Heading>
      <Paragraph
        color="ds.text.neutral.standard"
        textStyle="ds.body.standard.regular"
      >
        {message}
      </Paragraph>
      {action ? (
        <Flex justifyContent="flex-start" sx={{ marginTop: "28px" }}>
          {action}
        </Flex>
      ) : null}
    </>
  );
};
