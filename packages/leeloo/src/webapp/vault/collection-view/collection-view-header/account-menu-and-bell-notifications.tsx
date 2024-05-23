import React from 'react';
import { HeaderAccountMenu } from 'webapp/components/header/header-account-menu';
import { Connected as BellNotifications } from 'webapp/bell-notifications/connected';
export const AccountMenuAndBellNotifications = (<>
    <HeaderAccountMenu />
    <BellNotifications />
  </>);
