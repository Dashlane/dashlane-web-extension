import { ReactNode } from "react";
import {
  Card,
  DSStyleObject,
  Flex,
  Heading,
  LinkButton,
} from "@dashlane/design-system";
import {
  HelpCenterArticleCta,
  UserOpenHelpCenterEvent,
} from "@dashlane/hermes";
import { logEvent } from "../../../libs/logs/logEvent";
import useTranslate from "../../../libs/i18n/useTranslate";
import { onLinkClickOpenDashlaneUrl } from "../../../libs/external-urls";
import { Socials } from "../../account/root-panel/socials/socials";
const I18N_KEYS = {
  TITLE_SOCIALS: "webapp_settings_find_us_social_media",
  TITLE_QUICK_ACCESS: "webapp_settings_quick_access",
  HELP_CENTER: "webapp_account_root_item_help_center",
  TERMS: "webapp_account_root_item_terms",
  PRIVACY_POLICY: "webapp_account_root_item_privacy_policy",
};
const SX_STYLES: DSStyleObject = {
  width: "100%",
};
interface AsideProps {
  children?: ReactNode;
}
export const Aside = ({ children }: AsideProps) => {
  const { translate } = useTranslate();
  const getDashlaneUrlHandler =
    (params: { type: string; action: string }) =>
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      onLinkClickOpenDashlaneUrl(params)(e);
    };
  const handleClickOnHelpCenter =
    (params: { type: string; action: string }) =>
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      logEvent(
        new UserOpenHelpCenterEvent({
          helpCenterArticleCta: HelpCenterArticleCta.HelpCenter,
        })
      );
      logEvent(new UserOpenHelpCenterEvent({}));
      onLinkClickOpenDashlaneUrl(params)(e);
    };
  const quickAccessLinks = [
    {
      label: translate(I18N_KEYS.HELP_CENTER),
      href: "__REDACTED__",
      onClick: handleClickOnHelpCenter({
        type: "account",
        action: "helpCenter",
      }),
    },
    {
      label: translate(I18N_KEYS.TERMS),
      href: "__REDACTED__",
      onClick: getDashlaneUrlHandler({
        type: "account",
        action: "termsOfService",
      }),
    },
    {
      label: translate(I18N_KEYS.PRIVACY_POLICY),
      href: "__REDACTED__",
      onClick: getDashlaneUrlHandler({
        type: "account",
        action: "privacyPolicy",
      }),
    },
  ];
  return (
    <>
      {children}
      <Card sx={SX_STYLES}>
        <Heading
          as="h3"
          color="ds.text.neutral.catchy"
          textStyle="ds.title.block.medium"
        >
          {translate(I18N_KEYS.TITLE_QUICK_ACCESS)}
        </Heading>
        <Flex as="ul" flexDirection="column" gap="8px">
          {quickAccessLinks.map(({ label, href, onClick }) => (
            <li key={label}>
              <LinkButton
                isExternal={true}
                href={href}
                target="_blank"
                rel="noreferrer"
                onClick={onClick}
              >
                {label}
              </LinkButton>
            </li>
          ))}
        </Flex>
      </Card>
      <Card sx={SX_STYLES}>
        <Heading
          as="h3"
          color="ds.text.neutral.catchy"
          textStyle="ds.title.block.medium"
        >
          {translate(I18N_KEYS.TITLE_SOCIALS)}
        </Heading>
        <Socials legacy={false} />
      </Card>
    </>
  );
};
