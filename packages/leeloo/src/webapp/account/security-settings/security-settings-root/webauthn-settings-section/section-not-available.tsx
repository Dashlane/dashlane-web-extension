import { jsx, Paragraph } from '@dashlane/design-system';
import { SettingsSection } from 'webapp/account/security-settings/security-settings-root/settings-section/settings-section';
interface SectionNotAvailableProps {
    title: string;
    message: string;
}
export const WebAuthnSettingsNotAvailableSection = ({ title, message, }: SectionNotAvailableProps) => {
    return (<SettingsSection sectionTitle={title}>
      <Paragraph color="ds.text.neutral.standard" textStyle="ds.body.standard.regular">
        {message}
      </Paragraph>
    </SettingsSection>);
};
