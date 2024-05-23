import { Fragment } from 'react';
import { Heading, jsx } from '@dashlane/design-system';
import { Header } from 'webapp/components/header/header';
import { HeaderAccountMenu } from 'webapp/components/header/header-account-menu';
import { Connected as NotificationsDropdown } from 'webapp/bell-notifications/connected';
const StartWidgets = () => {
    return (<Heading as="h1" textStyle="ds.title.section.large" color="ds.text.neutral.catchy">
      Dashlane Labs
    </Heading>);
};
export const DashlaneLabsHeader = () => {
    const endWidget = (<>
      <HeaderAccountMenu />
      <NotificationsDropdown />
    </>);
    return <Header startWidgets={StartWidgets} endWidget={endWidget}/>;
};
