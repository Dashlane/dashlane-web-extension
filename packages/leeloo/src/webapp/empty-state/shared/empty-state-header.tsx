import { Heading } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import { Header } from "../../components/header/header";
import { HeaderAccountMenu } from "../../components/header/header-account-menu";
import { Connected as NotificationsDropdown } from "../../bell-notifications/connected";
interface EmptyStateHeaderProps {
  title: string;
}
export const EmptyStateHeader = ({ title }: EmptyStateHeaderProps) => {
  const { translate } = useTranslate();
  return (
    <Header
      startWidgets={
        <Heading
          as="h1"
          textStyle="ds.title.section.large"
          color="ds.text.neutral.catchy"
        >
          {translate(title)}
        </Heading>
      }
      endWidget={
        <>
          <HeaderAccountMenu />
          <NotificationsDropdown />
        </>
      }
    />
  );
};
