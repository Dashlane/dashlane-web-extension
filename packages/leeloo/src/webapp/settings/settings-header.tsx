import { Flex, Heading } from "@dashlane/design-system";
import { Connected as NotificationsDropdown } from "../bell-notifications/connected";
import { HeaderAccountMenu } from "../components/header/header-account-menu";
import { Header } from "../components/header/header";
const I18N_KEYS = {
  PAGE_TITLE: "Settings",
};
export const SettingsHeader = () => {
  const translate = (s: string) => s;
  return (
    <Flex
      sx={{
        padding: "0 24px",
      }}
    >
      <Header
        startWidgets={
          <Heading
            as="h1"
            textStyle="ds.title.section.large"
            color="ds.text.neutral.catchy"
          >
            {translate(I18N_KEYS.PAGE_TITLE)}
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
