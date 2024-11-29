import * as React from "react";
import {
  Button,
  colors,
  CrossCircleIcon,
  GridContainer,
  Paragraph,
  TextInput,
} from "@dashlane/ui-components";
import { Domain } from "@dashlane/communication";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { DomainSteps } from "../domain-container";
const I18N_KEYS = {
  BUTTON_TEXT: "team_settings_domain_button_verify",
  DOMAIN_NOT_VERIFIED: "team_settings_domain_not_verified",
  DOMAIN_VERIFY_FAILED: "team_settings_domain_verify_failed",
};
const { orange00, dashGreen02 } = colors;
interface VerifyDomainProps {
  verifyDomain: () => void;
  domain: Domain;
  domainStep: DomainSteps;
}
export const VerifyDomain = ({
  verifyDomain,
  domain,
  domainStep,
}: VerifyDomainProps) => {
  const { translate } = useTranslate();
  return (
    <GridContainer gap="10px" gridTemplateColumns="1fr auto">
      <TextInput
        value={domain ? domain.name : ""}
        fullWidth
        readOnly
        endAdornment={
          <GridContainer gridTemplateColumns="auto auto" gap="5px">
            <Paragraph
              size="small"
              color={
                domainStep === DomainSteps.VerifyFailed ? orange00 : dashGreen02
              }
            >
              {domainStep === DomainSteps.VerifyFailed
                ? translate(I18N_KEYS.DOMAIN_VERIFY_FAILED)
                : translate(I18N_KEYS.DOMAIN_NOT_VERIFIED)}
            </Paragraph>
            <CrossCircleIcon
              color={
                domainStep === DomainSteps.VerifyFailed ? orange00 : dashGreen02
              }
            />
          </GridContainer>
        }
        feedbackType={
          domainStep === DomainSteps.VerifyFailed ? "warning" : undefined
        }
      />
      <Button nature="secondary" onClick={verifyDomain} type="button">
        {translate(I18N_KEYS.BUTTON_TEXT)}
      </Button>
    </GridContainer>
  );
};
