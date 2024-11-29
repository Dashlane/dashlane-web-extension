import {
  Flex,
  Heading,
  Icon,
  LinkButton,
  Paragraph,
} from "@dashlane/design-system";
import useTranslate from "../../libs/i18n/useTranslate";
import { DASHLANE_LEARN_HOW_WE_SECURE_YOUR_ACCOUNT } from "../../webapp/urls";
const I18N_KEYS = {
  CHOOSE_ACCOUNT_TYPE_HEADER:
    "webapp_auth_panel_account_creation_choose_account_type_header",
  CHOOSE_ACCOUNT_TYPE_HEADER_DESCRIPTION:
    "webapp_auth_panel_account_creation_choose_account_type_description",
  WITH_PASSWORD_HEADER:
    "webapp_auth_panel_account_creation_with_password_header",
  WITH_PASSWORD_DESCRIPTION:
    "webapp_auth_panel_account_creation_with_password_description",
  WITH_PIN_HEADER: "webapp_auth_panel_account_creation_with_pin_header",
  WITH_PIN_DESCRPTION:
    "webapp_auth_panel_account_creation_with_pin_description",
  LEARN_MORE_LINK:
    "webapp_auth_panel_account_creation_choose_account_type_learn_more_link",
};
const ACCOUNT_TYPE_BUTTON_SX = {
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px",
  borderWidth: "1px",
  borderRadius: "8px",
  borderColor: "ds.border.neutral.quiet.idle",
  borderStyle: "solid",
  backgroundColor: "ds.background.default",
  transition: "background-color 0.5s ease",
  ":hover": {
    backgroundColor: "ds.container.expressive.neutral.supershy.hover",
  },
};
interface ChooseAccountTypeScreenProps {
  onChooseMpBasedAccount: () => void;
  onChoosePasswordlessAccount: () => void;
}
const AccountTypeButton = ({
  header,
  description,
  onClick,
  dataTestId,
}: {
  header: string;
  description: string;
  onClick: () => void;
  dataTestId: string;
}) => (
  <Flex
    sx={ACCOUNT_TYPE_BUTTON_SX}
    flexWrap="nowrap"
    gap={4}
    as="button"
    data-testid={dataTestId}
    onClick={onClick}
  >
    <Flex flexDirection="column" alignItems="flex-start" gap={2}>
      <Paragraph textStyle="ds.title.block.medium">{header}</Paragraph>
      <Paragraph sx={{ textAlign: "left" }}>{description}</Paragraph>
    </Flex>
    <Icon
      sx={{ marginRight: "8px" }}
      name="ArrowRightOutlined"
      color="ds.text.brand.quiet"
    />
  </Flex>
);
export const ChooseAccountTypeScreen = ({
  onChooseMpBasedAccount,
  onChoosePasswordlessAccount,
}: ChooseAccountTypeScreenProps) => {
  const { translate } = useTranslate();
  return (
    <Flex
      sx={{ margin: "0px 80px", width: "420px" }}
      flexDirection="column"
      gap={8}
    >
      <Flex gap={6}>
        <Heading
          as="h1"
          textStyle="ds.title.section.large"
          color="ds.text.neutral.catchy"
        >
          {translate(I18N_KEYS.CHOOSE_ACCOUNT_TYPE_HEADER)}
        </Heading>
        <Paragraph color="ds.text.neutral.catchy">
          {translate(I18N_KEYS.CHOOSE_ACCOUNT_TYPE_HEADER_DESCRIPTION)}
        </Paragraph>
      </Flex>
      <Flex flexDirection="column" gap={4}>
        <AccountTypeButton
          header={translate(I18N_KEYS.WITH_PASSWORD_HEADER)}
          description={translate(I18N_KEYS.WITH_PASSWORD_DESCRIPTION)}
          dataTestId="masterPasswordButton"
          onClick={onChooseMpBasedAccount}
        />
        <AccountTypeButton
          header={translate(I18N_KEYS.WITH_PIN_HEADER)}
          description={translate(I18N_KEYS.WITH_PIN_DESCRPTION)}
          dataTestId="pinCodeButton"
          onClick={onChoosePasswordlessAccount}
        />
      </Flex>
      <LinkButton href={DASHLANE_LEARN_HOW_WE_SECURE_YOUR_ACCOUNT} isExternal>
        {translate(I18N_KEYS.LEARN_MORE_LINK)}
      </LinkButton>
    </Flex>
  );
};
