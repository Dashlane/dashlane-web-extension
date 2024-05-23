import { Heading, jsx } from '@dashlane/design-system';
import { SettingHeader } from 'team/settings/policies/types';
interface Props {
    header: SettingHeader;
}
export const SettingsGroupHeading = ({ header }: Props) => {
    return (<Heading as="h2" key={header.label} textStyle="ds.title.supporting.small" color="ds.text.neutral.quiet">
      {header.label}
    </Heading>);
};
