import * as React from "react";
import {
  colors,
  GridChild,
  GridContainer,
  OpenWebsiteIcon,
  Paragraph,
} from "@dashlane/ui-components";
import { DisabledButtonWithTooltip } from "../../../../libs/dashlane-style/buttons/DisabledButtonWithTooltip";
import { openUrl } from "../../../../libs/external-urls";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { CopyButton } from "../../../../libs/dashlane-style/copy-button";
const { grey00 } = colors;
export type SsoTestProps = {
  actionsDisabled?: boolean;
  ssoServiceProviderUrl: string | null;
};
const I18N_KEYS = {
  TEST_TITLE: "team_settings_enable_sso_test_title",
  TEST_DESCRIPTION: "team_settings_enable_sso_test_description",
  TEST_BUTTON: "team_settings_enable_sso_test_button",
  SSO_COPY_URL_BUTTON: "team_settings_copy_sso_url_button",
  SSO_SETUP_INCOMPLETE: "team_settings_es_sso_setup_incomplete",
};
export const TestSso = ({
  actionsDisabled,
  ssoServiceProviderUrl,
}: SsoTestProps) => {
  const { translate } = useTranslate();
  const serviceProviderUrl = ssoServiceProviderUrl
    ? `${ssoServiceProviderUrl}/saml/login?redirect=test_idp`
    : "";
  const openServiceProviderUrl = (): void => {
    openUrl(serviceProviderUrl);
  };
  return (
    <GridContainer
      gap="8px"
      gridTemplateAreas="'header buttons' 'description buttons' "
      gridTemplateColumns="1fr auto"
    >
      <GridChild
        as={Paragraph}
        innerAs="h3"
        size="large"
        bold
        gridArea="header"
      >
        {translate(I18N_KEYS.TEST_TITLE)}
      </GridChild>
      <GridChild
        gridArea="description"
        as={Paragraph}
        size="small"
        color={grey00}
      >
        {translate(I18N_KEYS.TEST_DESCRIPTION)}
      </GridChild>
      <GridContainer
        gap="8px"
        gridTemplateAreas="'test copy'"
        as={GridChild}
        gridArea="buttons"
      >
        <GridChild gridArea="test">
          <DisabledButtonWithTooltip
            onClick={openServiceProviderUrl}
            size="medium"
            aria-label={translate(I18N_KEYS.TEST_BUTTON)}
            disabled={actionsDisabled ?? !serviceProviderUrl}
            content={translate(I18N_KEYS.SSO_SETUP_INCOMPLETE)}
          >
            {translate(I18N_KEYS.TEST_BUTTON)}
            <OpenWebsiteIcon sx={{ ml: "4px" }} color="white" />
          </DisabledButtonWithTooltip>
        </GridChild>
        <GridChild gridArea="copy">
          <CopyButton
            buttonText={translate(I18N_KEYS.SSO_COPY_URL_BUTTON)}
            disabled={actionsDisabled ?? !serviceProviderUrl}
            copyValue={serviceProviderUrl ?? ""}
          />
        </GridChild>
      </GridContainer>
    </GridContainer>
  );
};
