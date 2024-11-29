import * as React from 'react';
import { equals } from 'ramda';
import { DEFAULT_PARAM, Slot } from 'ts-event-bus';
import type { Diff, PickByValueExact, Unionize } from 'utility-types';
import type { ValuesType } from '@dashlane/framework-types';
import { AsRemoteData, getLoading, getRemoteError, getRemoteSuccess, RemoteData, RemoteDataEmptyTypes, } from './remoteData';
import { CarbonEvents } from './carbon/connector/events';
const logPerfs = false;
type CarbonApiSlot = ValuesType<Unionize<CarbonEvents>>;
export interface Selector<InjectedProp, WrapperProps, QueryParam> {
    live?: Slot<InjectedProp> & CarbonApiSlot;
    liveParam?: ((props: WrapperProps) => string) | (keyof PickByValueExact<WrapperProps, string> & string);
    query?: Slot<QueryParam, InjectedProp> & CarbonApiSlot;
    queryParam?: ((props: WrapperProps) => QueryParam) | (keyof PickByValueExact<WrapperProps, QueryParam> & string);
}
export type Selectors<InjectedData extends Record<string, any>, Props extends AsRemoteData<InjectedData>> = {
    [key in keyof InjectedData]: Selector<InjectedData[key], Diff<Props, InjectedData>, any>;
};
export function connect<InjectedData extends Record<string, any>, Props extends AsRemoteData<InjectedData>>(WrappedComponent: React.ComponentType<Props>, selectors: Selectors<InjectedData, Props>) {
    type Injected = AsRemoteData<InjectedData>;
    type WrapperProps = Diff<Props, Injected>;
    type WrapperState = {
        injected: Injected;
    };
    return class extends React.Component<WrapperProps, WrapperState> {
        static displayName = 'CarbonApiConsumerWrapper';
        private subscriptions: {
            [key: string]: () => void;
        } = {};
        private getEmptyInjected = (type: RemoteDataEmptyTypes): Injected => Object.keys(selectors).reduce((acc, key) => ({ ...acc, [key]: { type } }), {} as Injected);
        private getEmptyState = (type: RemoteDataEmptyTypes): WrapperState => ({
            injected: this.getEmptyInjected(type),
        });
        public state = this.getEmptyState('NotAsked');
        private getLiveParam(liveParam: ((props: WrapperProps) => string) | string | undefined, props: WrapperProps): string {
            if (typeof liveParam === 'string') {
                return props[liveParam];
            }
            else if (typeof liveParam === 'function') {
                return liveParam(props);
            }
            else {
                return DEFAULT_PARAM;
            }
        }
        private getQueryParam<T>(queryParam: ((props: WrapperProps) => T) | string | undefined, props: WrapperProps): T | null {
            if (typeof queryParam === 'string') {
                return props[queryParam];
            }
            else if (typeof queryParam === 'function') {
                return queryParam(props);
            }
            return null;
        }
        private updateInjectedInState = <I>(state: WrapperState, key: string, data: RemoteData<I>): WrapperState => ({
            ...state,
            injected: { ...state.injected, [key]: data },
        });
        private setInjectedInState = <I>(state: WrapperState, key: string, data: RemoteData<I>): void => {
            const newState = this.updateInjectedInState(state, key, data);
            this.setState(newState);
        };
        private setOneLoading = (key: string): void => this.setInjectedInState(this.state, key, getLoading());
        private setAllLoading = (): void => this.setState({
            ...this.state,
            injected: this.getEmptyInjected('Loading'),
        });
        private loadOneState = <I extends InjectedData[string]>(key: string): void => {
            const selector: Selector<I, WrapperProps, unknown> = selectors[key];
            const queryParam = this.getQueryParam(selector.queryParam, this.props);
            const query = selector.query;
            if (!query) {
                return;
            }
            const perfLabel = `${key}-reload`;
            if (logPerfs) {
                console.time(perfLabel);
            }
            const successCb = (data: I): void => {
                if (logPerfs) {
                    console.timeEnd(perfLabel);
                }
                this.setInjectedInState(this.state, key, getRemoteSuccess(data));
            };
            const errorCb = (e: any): void => this.setInjectedInState(this.state, key, getRemoteError(e));
            query(queryParam).then(successCb).catch(errorCb);
        };
        private loadAllInitialState = (): void => {
            this.setAllLoading();
            Object.keys(selectors).forEach(this.loadOneState);
        };
        private listenToOneLive = <I extends InjectedData[string]>(key: string): void => {
            const selector: Selector<I, WrapperProps, unknown> = selectors[key];
            const liveParam = this.getLiveParam(selector.liveParam, this.props);
            const live = selector.live;
            if (!live) {
                return;
            }
            const successCb = (data: I): void => this.setInjectedInState(this.state, key, getRemoteSuccess(data));
            this.subscriptions[key] = live.on(liveParam, successCb);
        };
        private listenToAllLive = (): void => Object.keys(selectors).forEach(this.listenToOneLive);
        private stopListeningToOneLive = (key: string): void => {
            if (this.subscriptions[key]) {
                this.subscriptions[key]();
                delete this.subscriptions[key];
            }
        };
        private stopListeningToAllLive = (): void => Object.keys(this.subscriptions).forEach(this.stopListeningToOneLive);
        public componentDidMount(): void {
            this.loadAllInitialState();
            this.listenToAllLive();
        }
        public componentWillUnmount(): void {
            this.stopListeningToAllLive();
        }
        public componentDidUpdate(previousProps: WrapperProps): void {
            Object.keys(selectors).forEach((key: string) => {
                const selector = selectors[key];
                const previousLiveParam = this.getLiveParam(selector.liveParam, previousProps);
                const currentLiveParam = this.getLiveParam(selector.liveParam, this.props);
                const previousQueryParam = this.getQueryParam(selector.queryParam, previousProps);
                const currentQueryParam = this.getQueryParam(selector.queryParam, this.props);
                const liveChanged = !equals(previousLiveParam, currentLiveParam);
                if (liveChanged) {
                    this.stopListeningToOneLive(key);
                    this.listenToOneLive(key);
                }
                const queryChanged = !equals(previousQueryParam, currentQueryParam);
                if (queryChanged) {
                    this.setOneLoading(key);
                    this.loadOneState(key);
                }
            });
        }
        public render(): JSX.Element {
            const props = {
                ...this.props,
                ...this.state.injected,
            } as Props;
            return <WrappedComponent {...props}/>;
        }
    };
}
