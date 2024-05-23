import { Heading, jsx } from '@dashlane/design-system';
interface Props {
    text: string;
}
export const Header = ({ text }: Props) => {
    return (<header>
      <Heading as={'h2'} textStyle="ds.title.section.large">
        {text}
      </Heading>
    </header>);
};
