import * as React from 'react';
import { NotFound, Switch } from 'libs/router';
import { NewItem as NewItemDeeplinkRedirect } from 'libs/redirect/deeplink/new-item';
import { Sso as SsoDeeplinkRedirect } from 'libs/redirect/deeplink/sso';
import { UUID_REG_EXP_PATH, Uuid as UuidRedirect, } from 'libs/redirect/deeplink/uuid';
import { AfterLogin as AfterLoginRedirect } from 'libs/redirect/after-login/after-login';
interface RouterSwitchProps {
    children: React.ReactNode;
}
export const RootSwitch = ({ children }: RouterSwitchProps) => {
    return (<>
      <Switch>
        <SsoDeeplinkRedirect path="*ssoToken=*"/>
        <NewItemDeeplinkRedirect path="*/new*"/>
        <UuidRedirect path={`*${UUID_REG_EXP_PATH}*`}/>
        {children}
        <NotFound />
      </Switch>
      <AfterLoginRedirect />
    </>);
};
