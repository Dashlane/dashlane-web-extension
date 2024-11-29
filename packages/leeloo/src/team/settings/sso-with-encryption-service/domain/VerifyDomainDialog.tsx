import { useCallback, useRef, useState } from "react";
import { DomainStatus } from "@dashlane/communication";
import { carbonConnector } from "../../../../libs/carbon/connector";
import {
  VerifyConfirmDialog,
  VerifyFailedDialog,
} from "../../sso/domain/steps";
interface VerifyDomainDialogsProps {
  description?: string | React.ReactNode;
  isDarkWebInsights?: boolean;
  secondaryDescription?: string;
  domainName: string;
  linkLabel?: string;
  href?: string;
  onClick?: () => void;
  onDismiss: () => void;
  onError?: () => void;
  onSuccess: () => void;
}
export const VerifyDomainDialog = ({
  description,
  isDarkWebInsights,
  secondaryDescription,
  domainName,
  linkLabel,
  href,
  onClick,
  onDismiss,
  onError,
  onSuccess,
}: VerifyDomainDialogsProps) => {
  const [verifyFailed, setVerifyFailed] = useState(false);
  const unmounted = useRef(false);
  const verifyDomain = useCallback(async () => {
    const verification = await carbonConnector.completeTeamDomainRegistration();
    if (unmounted.current) {
      return;
    }
    if (verification.success) {
      const thisDomain = verification.domains.find(
        (domainResp) => domainResp.name === domainName
      );
      if (thisDomain?.status === DomainStatus.valid) {
        onSuccess();
      } else if (onError) {
        onError();
      }
    } else {
      setVerifyFailed(true);
    }
    return () => {
      unmounted.current = true;
    };
  }, [domainName, onSuccess, onError]);
  if (verifyFailed) {
    return <VerifyFailedDialog onDismiss={onDismiss} domainName={domainName} />;
  }
  return (
    <VerifyConfirmDialog
      description={description}
      isDarkWebInsights={isDarkWebInsights}
      secondaryDescription={secondaryDescription}
      linkLabel={linkLabel}
      domainName={domainName}
      href={href}
      onConfirm={verifyDomain}
      onDismiss={onDismiss}
      onClick={onClick}
    />
  );
};
