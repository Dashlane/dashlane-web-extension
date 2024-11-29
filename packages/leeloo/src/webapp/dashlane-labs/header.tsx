import { Flex, Heading } from "@dashlane/design-system";
import { Header } from "../components/header/header";
import { HeaderAccountMenu } from "../components/header/header-account-menu";
import { Connected as NotificationsDropdown } from "../bell-notifications/connected";
export const DashlaneLabsHeader = () => {
  return (
    <Flex
      sx={{
        paddingLeft: "32px",
        paddingRight: "32px",
      }}
    >
      <Header
        startWidgets={
          <Heading
            as="h1"
            textStyle="ds.title.section.large"
            color="ds.text.neutral.catchy"
          >
            Dashlane Labs
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
