import {
  Flex,
  Heading,
  Icon,
  LinkButton,
  Paragraph,
} from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { DASHLANE_CONFIDENTIAL_SSO_SCIM_IDP_INTEGRATION } from "../../../urls";
import { BIG_CARD_CONTAINER, ICON_CONTAINER } from "./styles";
const I18N_KEYS = {
  TITLE: "team_account_addseats_success_idp_nextstep_title",
  SUBTITLE: "team_account_addseats_success_idp_nextstep_subtitle",
  DESCRIPTION: "team_account_addseats_success_idp_nextstep_description",
  SEE_SETUP_GUIDE:
    "team_account_addseats_success_idp_nextstep_see_setup_guide_link",
};
export const IdPNextStepInfo = () => {
  const { translate } = useTranslate();
  return (
    <Flex flexWrap="nowrap" gap="16px" sx={BIG_CARD_CONTAINER}>
      <Flex sx={ICON_CONTAINER}>
        <Icon name="GroupOutlined" color="ds.text.neutral.standard" />
      </Flex>
      <Flex flexDirection="column" gap="8px" sx={{ flexGrow: "1" }}>
        <Heading as="h2" color="ds.text.neutral.catchy">
          {translate(I18N_KEYS.TITLE)}
        </Heading>
        <Heading
          as="h3"
          textStyle="ds.title.block.medium"
          color="ds.text.neutral.catchy"
        >
          {translate(I18N_KEYS.SUBTITLE)}
        </Heading>
        <Paragraph color="ds.text.neutral.quiet">
          {translate(I18N_KEYS.DESCRIPTION)}
        </Paragraph>
        <LinkButton
          isExternal
          href={DASHLANE_CONFIDENTIAL_SSO_SCIM_IDP_INTEGRATION}
        >
          {translate(I18N_KEYS.SEE_SETUP_GUIDE)}
        </LinkButton>
      </Flex>
    </Flex>
  );
};
