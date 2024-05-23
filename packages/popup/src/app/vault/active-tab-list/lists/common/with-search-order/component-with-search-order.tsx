import React, { ComponentType, useState } from 'react';
import { CredentialSearchOrder } from '@dashlane/communication';
import { carbonConnector } from 'src/carbonConnector';
import { ISearchOrderProps } from './types';
interface IComponentWithSearchOrderProps<T> {
    searchOrderData: CredentialSearchOrder;
    WrappedComponent: ComponentType<T & ISearchOrderProps>;
    wrappedComponentProps: T;
}
const ComponentWithSearchOrder: <T>(props: IComponentWithSearchOrderProps<T>) => React.ReactElement = ({ searchOrderData, WrappedComponent, wrappedComponentProps, }) => {
    const [order, setOrder] = useState<CredentialSearchOrder>(searchOrderData);
    const onOrderChangeHandler = (newOrder: CredentialSearchOrder) => {
        setOrder(newOrder);
        void carbonConnector.setCredentialSearchOrder({ order: newOrder });
    };
    return (<WrappedComponent order={order} onOrderChangeHandler={onOrderChangeHandler} {...wrappedComponentProps}/>);
};
export default ComponentWithSearchOrder;
