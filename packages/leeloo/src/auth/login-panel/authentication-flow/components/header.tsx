import { Heading } from "@dashlane/design-system";
interface Props {
  text: string;
}
export const Header = ({ text }: Props) => {
  return (
    <Heading as="h1" textStyle="ds.title.section.large">
      {text}
    </Heading>
  );
};
