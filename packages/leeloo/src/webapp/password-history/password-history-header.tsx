import { Flex, Heading, Icon } from "@dashlane/design-system";
import useTranslate from "../../libs/i18n/useTranslate";
import { Link, useRouterGlobalSettingsContext } from "../../libs/router";
import { Header } from "../components/header/header";
import { HeaderAccountMenu } from "../components/header/header-account-menu";
import { Connected as NotificationsDropdown } from "../bell-notifications/connected";
const I18N_KEYS = {
  BACK: "_common_action_back",
  PASSWORD_HISTORY_HEADER_TITLE: "webapp_password_history_title",
};
export const PasswordHistoryHeader = () => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  return (
    <Flex>
      <Header
        startWidgets={
          <Heading
            as="h1"
            textStyle="ds.title.section.large"
            color="ds.text.neutral.catchy"
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <Link
              to={routes.userCredentials}
              aria-label={translate(I18N_KEYS.BACK)}
            >
              <Icon name="CaretLeftOutlined" color="ds.text.neutral.standard" />
            </Link>
            {translate(I18N_KEYS.PASSWORD_HISTORY_HEADER_TITLE)}
          </Heading>
        }
        endWidget={
          <>
            <HeaderAccountMenu />
            <NotificationsDropdown />
          </>
        }
      />
    </Flex>
  );
};
