import { useState } from "react";
import { Heading, LinkButton } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { ContactSupportDialog } from "../../../../team/page/support/contact-support-dialog";
import {
  DASHLANE_ADMIN_HELP_CENTER,
  DASHLANE_ADMIN_HELP_CENTER_GET_STARTED,
  DASHLANE_HELP_CENTER,
  DASHLANE_HELP_CENTER_GET_STARTED,
  DASHLANE_RESOURCES_ADMIN,
  DASHLANE_RESOURCES_USER_EDUCATION,
} from "../../../urls";
import { logContactUs, logOpenHelpCenter, logOpenResourceCenter } from "./logs";
import { GuideUserType } from "../types/user.types";
const I18N_KEYS = {
  TITLE: "onb_vault_get_started_assistance_title",
  LINK_HC_GET_STARTED_AS_AN_ADMIN:
    "onb_vault_get_started_assistance_link_hc_get_started_as_an_admin",
  LINK_HC_GET_STARTED_AS_AN_B2C:
    "onb_vault_get_started_assistance_link_hc_get_started_as_b2c",
  LINK_HELP_CENTER: "onb_vault_get_started_assistance_link_help_center",
  LINK_RESOURCE_CENTER: "onb_vault_get_started_assistance_link_resource_center",
  LINK_CONTACT_US: "onb_vault_get_started_assistance_link_contact_us",
};
interface AssistanceProps {
  userType: GuideUserType;
}
export const Assistance = ({ userType }: AssistanceProps) => {
  const { translate } = useTranslate();
  const [supportDialogIsOpen, setSupportDialogIsOpen] = useState(false);
  const links: {
    text: string;
    href: string;
    tracking: () => void;
  }[] = [
    {
      text: translate(
        userType === GuideUserType.TEAM_CREATOR
          ? I18N_KEYS.LINK_HC_GET_STARTED_AS_AN_ADMIN
          : I18N_KEYS.LINK_HC_GET_STARTED_AS_AN_B2C
      ),
      href:
        userType === GuideUserType.TEAM_CREATOR
          ? DASHLANE_ADMIN_HELP_CENTER_GET_STARTED
          : DASHLANE_HELP_CENTER_GET_STARTED,
      tracking: () => {},
    },
    {
      text: translate(I18N_KEYS.LINK_HELP_CENTER),
      href:
        userType === GuideUserType.TEAM_CREATOR
          ? DASHLANE_ADMIN_HELP_CENTER
          : DASHLANE_HELP_CENTER,
      tracking: logOpenHelpCenter,
    },
    {
      text: translate(I18N_KEYS.LINK_RESOURCE_CENTER),
      href:
        userType === GuideUserType.TEAM_CREATOR
          ? DASHLANE_RESOURCES_ADMIN
          : DASHLANE_RESOURCES_USER_EDUCATION,
      tracking: logOpenResourceCenter,
    },
  ];
  const handleContactUsClick = () => {
    void logContactUs();
    setSupportDialogIsOpen(true);
  };
  return (
    <div
      sx={{
        padding: "24px",
        borderRadius: "8px",
        border: "1px solid ds.border.neutral.quiet.idle",
        backgroundColor: "ds.container.agnostic.neutral.supershy",
      }}
    >
      <Heading
        as="h2"
        textStyle="ds.title.supporting.small"
        color="ds.text.neutral.quiet"
      >
        {translate(I18N_KEYS.TITLE)}
      </Heading>

      <ul
        sx={{
          marginTop: "8px",
          display: "flex",
          gap: "8px",
          flexDirection: "column",
        }}
      >
        {links.map(({ text, href, tracking }) => (
          <li key={`link_${text.replaceAll(" ", "_").toLowerCase()}`}>
            <LinkButton
              isExternal
              href={href}
              onClick={tracking}
              color="ds.text.brand.standard"
              size="small"
            >
              {text}
            </LinkButton>
          </li>
        ))}
        {userType === GuideUserType.TEAM_CREATOR ? (
          <li>
            <LinkButton
              as="button"
              sx={{ cursor: "pointer" }}
              onClick={handleContactUsClick}
              size="small"
            >
              {translate(I18N_KEYS.LINK_CONTACT_US)}
            </LinkButton>
          </li>
        ) : null}
      </ul>

      {supportDialogIsOpen ? (
        <ContactSupportDialog onDismiss={() => setSupportDialogIsOpen(false)} />
      ) : null}
    </div>
  );
};
