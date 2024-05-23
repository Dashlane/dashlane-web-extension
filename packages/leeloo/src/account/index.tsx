import React, { ReactNode, ReactNodeArray } from 'react';
import accountStyles from './styles/index.css';
interface AccountIProps {
    children: ReactNode | ReactNodeArray;
}
const Account = (props: AccountIProps) => (<div className={accountStyles.account}>{props.children}</div>);
export default Account;
