import * as React from 'react';
import { Lee } from 'lee';
import { LanguageSwitcher } from './language-switcher';
type Props = React.PropsWithChildren<{
    lee: Lee;
}>;
const DevToolsWrapper = (props: Props) => (<div>
    {props.children}
    <LanguageSwitcher dispatchGlobal={props.lee.dispatchGlobal}/>
  </div>);
export default DevToolsWrapper;
