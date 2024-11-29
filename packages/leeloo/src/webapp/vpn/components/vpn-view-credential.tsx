import useTranslate from "../../../libs/i18n/useTranslate";
import { TutorialStep, TutorialStepStatus } from "./tutorial/tutorial-step";
import { VpnCredential } from "./credential/vpn-credential";
const I18N_KEYS = {
  HEADING: "webapp_vpn_page_credential_active_heading",
};
interface VpnViewCredentialsProps {
  email: string;
  password: string;
  credentialId: string;
}
export const VpnViewCredentials = ({
  email,
  password,
  credentialId,
}: VpnViewCredentialsProps) => {
  const { translate } = useTranslate();
  return (
    <TutorialStep
      options={{ easeIn: true, easeOut: false }}
      status={TutorialStepStatus.COMPLETED}
      title={translate(I18N_KEYS.HEADING)}
    >
      <VpnCredential
        email={email}
        password={password}
        credentialId={credentialId}
      />
    </TutorialStep>
  );
};
