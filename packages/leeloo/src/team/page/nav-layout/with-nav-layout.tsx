import React from 'react';
import { Lee } from 'lee';
import { NavLayout } from './nav-layout';
interface BaseProps {
    lee: Lee;
}
export const withNavLayout = <Props extends BaseProps>(WrappedComponent: React.ComponentType<Props>, selectedTab: string) => {
    const wrapped = (props: Props) => {
        return (<NavLayout selectedTab={selectedTab} lee={props.lee}>
        <WrappedComponent {...props}/>
      </NavLayout>);
    };
    return wrapped;
};
