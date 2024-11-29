import { useState } from "react";
import {
  useHistory,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
import Animation from "../../../../libs/dashlane-style/animation";
import { useIsCredentialExcluded } from "../../../password-health/hooks/use-is-credential-excluded";
import { useCredentialHealthData } from "../../../password-health/hooks/use-credentials-health-data";
import { PasswordChangeDialog } from "../../../password-change-dialog/components/dialogs/password-change-dialog";
import { ExcludedHealthBox } from "./excluded-health-box/excluded-health-box";
import { IncludedHealthBox } from "./included-health-box/included-health-box";
import spinnerAnimation from "./spinner.json";
interface CredentialHealthBoxProps {
  credentialId: string;
  isShared: boolean;
  hasLimitedPermission: boolean;
}
const ANIMATION_SIZE = 24;
export const CredentialHealthBox = ({
  credentialId,
  isShared,
  hasLimitedPermission,
}: CredentialHealthBoxProps) => {
  const history = useHistory();
  const { routes } = useRouterGlobalSettingsContext();
  const { updateIsCredentialExcluded } = useIsCredentialExcluded();
  const { healthData } = useCredentialHealthData(credentialId);
  const [passwordChangeCredentialId, setPasswordChangeCredentialId] = useState<
    null | string
  >(null);
  const closePasswordChange = () => setPasswordChangeCredentialId(null);
  const onChangePasswordClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setPasswordChangeCredentialId(credentialId);
  };
  const onViewPasswordHealthClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    history.push(routes.userPasswordHealth);
  };
  const onIncludePassword = () => {
    updateIsCredentialExcluded(credentialId, false);
  };
  if (healthData === null) {
    return null;
  }
  if (!healthData) {
    return (
      <div sx={{ marginBottom: "24px" }}>
        <div sx={{ display: "flex", justifyContent: "center" }}>
          <Animation
            height={ANIMATION_SIZE}
            width={ANIMATION_SIZE}
            animationParams={{
              renderer: "svg",
              loop: true,
              autoplay: true,
              animationData: spinnerAnimation,
            }}
          />
        </div>
      </div>
    );
  }
  return (
    <div sx={{ position: "relative" }}>
      {passwordChangeCredentialId ? (
        <PasswordChangeDialog
          credentialId={passwordChangeCredentialId}
          dismissCallback={closePasswordChange}
        />
      ) : null}
      {healthData.excluded ? (
        <ExcludedHealthBox onPrimaryClick={onIncludePassword} />
      ) : (
        <IncludedHealthBox
          onPrimaryClick={onChangePasswordClick}
          onSecondaryClick={onViewPasswordHealthClick}
          isLimitedSharingPassword={isShared && hasLimitedPermission}
          corruptionData={healthData.corruptionData}
        />
      )}
    </div>
  );
};
