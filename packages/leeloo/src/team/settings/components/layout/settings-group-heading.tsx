import { Heading } from "@dashlane/design-system";
import { SettingHeader } from "../../policies/types";
interface Props {
  header: SettingHeader;
}
export const SettingsGroupHeading = ({ header }: Props) => {
  return (
    <Heading
      as="h2"
      key={header.label}
      textStyle="ds.title.section.medium"
      color="ds.text.neutral.standard"
    >
      {header.label}
    </Heading>
  );
};
