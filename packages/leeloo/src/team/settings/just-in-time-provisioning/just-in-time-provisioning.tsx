import { useEffect, useState } from "react";
import {
  Heading,
  IndeterminateLoader,
  Paragraph,
  Toggle,
} from "@dashlane/design-system";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import useTranslate from "../../../libs/i18n/useTranslate";
import {
  confidentialSSOApi,
  DomainVerificationStatus,
  SsoSolution,
} from "@dashlane/sso-scim-contracts";
import { useTeamAdmin } from "../hooks/use-team-admin";
import { carbonConnector } from "../../../libs/carbon/connector";
const I18N_KEY = {
  JIT_PROVISIONING_CAT_TITLE: "jit_provisioning_cat_title",
  JIT_PROVISIONING_TITLE: "jit_provisioning_title",
  JIT_PROVISIONING_DESCRIPTION: "jit_provisioning_description",
};
export const JustInTimeProvisioning = () => {
  const { translate } = useTranslate();
  const [hasValidDomain, setHasValidDomain] = useState<boolean>(false);
  const { data, editTeamPolicies, status } = useTeamAdmin();
  const ssoProvisioningState = useModuleQuery(
    confidentialSSOApi,
    "ssoProvisioning"
  );
  useEffect(() => {
    if (ssoProvisioningState.status === DataStatus.Success) {
      const ssoSolution = ssoProvisioningState.data?.ssoSolution;
      const isSelfHosted = ssoSolution === SsoSolution.enum.selfHostedSaml;
      if (isSelfHosted) {
        carbonConnector.getTeamDomains().then((result) => {
          if (result.success) {
            setHasValidDomain(
              result.domains.some((domain) => domain.status === "valid")
            );
          }
        });
      } else {
        setHasValidDomain(
          (ssoProvisioningState.data?.domainSetup ?? []).some(
            (setup) =>
              setup.verificationStatus === DomainVerificationStatus.enum.valid
          )
        );
      }
    }
  }, [ssoProvisioningState]);
  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (status !== DataStatus.Success) {
      return;
    }
    editTeamPolicies?.({
      ssoProvisioning: e.target.checked,
    });
  };
  return (
    <div
      sx={{
        backgroundColor: "ds.container.agnostic.neutral.quiet",
        borderRadius: "8px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Heading
        as="h3"
        textStyle="ds.title.supporting.small"
        color="ds.text.neutral.quiet"
      >
        {translate(I18N_KEY.JIT_PROVISIONING_CAT_TITLE)}{" "}
      </Heading>{" "}
      <div sx={{ display: "flex", flexDirection: "row", gap: "16px" }}>
        <div
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "8px",
          }}
        >
          <Heading
            as="h2"
            textStyle="ds.title.block.medium"
            color="ds.text.neutral.catchy"
          >
            {translate(I18N_KEY.JIT_PROVISIONING_TITLE)}
          </Heading>
          <Paragraph
            textStyle="ds.body.standard.regular"
            color="ds.text.neutral.standard"
          >
            {translate(I18N_KEY.JIT_PROVISIONING_DESCRIPTION)}
          </Paragraph>
        </div>
        <div>
          {status === DataStatus.Loading ? (
            <IndeterminateLoader mood="brand" />
          ) : (
            <Toggle
              disabled={!hasValidDomain}
              onChange={handleToggleChange}
              defaultChecked={!!data?.teamPolicies.ssoProvisioning}
            />
          )}
        </div>
      </div>
    </div>
  );
};
