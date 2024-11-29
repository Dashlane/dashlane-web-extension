import {
  Button,
  Flex,
  Heading,
  Icon,
  Paragraph,
} from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { BIG_CARD_CONTAINER, ICON_CONTAINER } from "./styles";
const friendsFamilyUrl = "__REDACTED__";
export const FriendsAndFamilyInfo = () => {
  const { translate } = useTranslate();
  return (
    <Flex flexWrap="nowrap" gap="16px" sx={BIG_CARD_CONTAINER}>
      <Flex sx={ICON_CONTAINER}>
        <Icon name="GroupOutlined" color="ds.text.neutral.standard" />
      </Flex>
      <Flex flexDirection="column" gap="16px" sx={{ flexGrow: "1" }}>
        <Flex flexDirection="column" gap="8px">
          <Heading as="h2" color="ds.text.neutral.catchy">
            {translate("team_account_addseats_success_friends_family_header")}
          </Heading>
          <Paragraph color="ds.text.neutral.quiet">
            {translate("team_account_addseats_success_friends_family_body")}
          </Paragraph>
        </Flex>

        <a href={friendsFamilyUrl} target="_blank" rel="noopener noreferrer">
          <Button mood="neutral" intensity="quiet">
            {translate(
              "team_account_addseats_success_friends_family_learn_more_cta"
            )}
          </Button>
        </a>
      </Flex>
    </Flex>
  );
};
