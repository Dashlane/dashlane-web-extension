import {
  Card,
  DSStyleObject,
  Heading,
  Paragraph,
} from "@dashlane/design-system";
import { DataStatus } from "@dashlane/framework-react";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useTeamId } from "../../hooks/use-team-id";
import { CompanyName } from "./company-name/company-name";
import { usePermissions } from "../../helpers/use-permissions";
import { VATNumber } from "./vat";
import { BillingContact } from "./billing-contact";
export const I18N_KEYS = {
  BILLING_CONTACT_INFO: "account_summary_company_details_billing_contact_info",
  EMPTY_FIELD_PLACEHOLDER:
    "account_summary_company_details_empty_field_placeholder",
  HEADER: "account_summary_company_details_header",
};
export type StyleProps = "LINK_BUTTON" | "DISPLAY_GROUP" | "CONTAINER";
const SX_STYLES: Record<string, DSStyleObject> = {
  CONTAINER: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "16px",
  },
  DISPLAY_GROUP: {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 224px",
  },
  LINK_BUTTON: {
    "> button": {
      cursor: "pointer",
    },
  },
};
export const CompanyInformation = () => {
  const { translate } = useTranslate();
  const teamId = useTeamId();
  const permissions = usePermissions();
  const { hasPermission } = permissions;
  if (teamId.status !== DataStatus.Success || teamId.teamId === null) {
    return null;
  }
  return (
    <Card>
      <Heading
        as="h2"
        textStyle="ds.title.section.medium"
        color="ds.text.neutral.catchy"
      >
        {translate(I18N_KEYS.HEADER)}
      </Heading>
      <div sx={SX_STYLES.CONTAINER}>
        <CompanyName
          style={SX_STYLES}
          teamId={teamId.teamId}
          hasPermission={hasPermission}
        />
        <VATNumber style={SX_STYLES} />
        <BillingContact
          style={SX_STYLES}
          teamId={teamId.teamId}
          hasPermission={hasPermission}
        />
      </div>
      <Paragraph
        textStyle="ds.body.reduced.regular"
        color="ds.text.neutral.quiet"
      >
        {translate(I18N_KEYS.BILLING_CONTACT_INFO)}
      </Paragraph>
    </Card>
  );
};
