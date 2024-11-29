import { Paragraph } from "@dashlane/design-system";
import { SettingsSection } from "../settings-section/settings-section";
interface SectionNotAvailableProps {
  title: string;
  message: string;
}
export const WebAuthnSettingsNotAvailableSection = ({
  title,
  message,
}: SectionNotAvailableProps) => {
  return (
    <SettingsSection sectionTitle={title}>
      <Paragraph
        color="ds.text.neutral.standard"
        textStyle="ds.body.standard.regular"
      >
        {message}
      </Paragraph>
    </SettingsSection>
  );
};
