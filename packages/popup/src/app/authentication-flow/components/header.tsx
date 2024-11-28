import { Heading, jsx } from "@dashlane/design-system";
interface Props {
  text: string;
}
export const Header = ({ text }: Props) => {
  return (
    <Heading
      as="h1"
      color="ds.text.neutral.catchy"
      sx={{ marginTop: "8px", marginBottom: "16px", textTransform: "none" }}
    >
      {text}
    </Heading>
  );
};
