import * as React from 'react';
import { curry, equals } from 'ramda';
import { BehaviorSubject, from, Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilKeyChanged, filter, map, mergeMap, switchMap, withLatestFrom, } from 'rxjs/operators';
import { Slot } from 'ts-event-bus';
import { Subtract } from 'utility-types';
import { CarbonApiEvents, Page } from '@dashlane/communication';
import { getNotAsked, getRemoteError, getRemoteSuccess, RemoteData, } from 'libs/remoteData';
export interface PaginationConfig<FirstTokenParams, D> {
    tokenEndpoint: Slot<FirstTokenParams, string> & CarbonApiEvents[keyof CarbonApiEvents];
    pageEndpoint: Slot<string, Page<D>> & CarbonApiEvents[keyof CarbonApiEvents];
    batchLiveEndpoint: Slot<D[]> & CarbonApiEvents[keyof CarbonApiEvents];
}
export interface InjectedProps<D> {
    hasNext: boolean;
    hasPrevious: boolean;
    isLoading: boolean;
    loadNext: () => void;
    loadPrevious: () => void;
    paginatedData: Map<string, D[]>;
}
export function connectPagination<D, FirstTokenParams, Props extends InjectedProps<D>>(config: PaginationConfig<FirstTokenParams, D>, WrappedComponent: React.ComponentType<Props>) {
    type RemotePage = RemoteData<Page<D>>;
    type WrapperExclusiveProps = {
        tokenParams: FirstTokenParams;
    };
    type WrapperProps = Subtract<Props, InjectedProps<D>> & WrapperExclusiveProps;
    type State = {
        pages: Map<string, RemotePage>;
    };
    function updatePageInState(state: State, page: RemotePage, token: string): State {
        const { pages } = state;
        if (!pages.get(token)) {
            return state;
        }
        const newPages = new Map(pages);
        newPages.set(token, page);
        return { ...state, pages: newPages };
    }
    function appendPageToState(state: State, page: RemotePage, token: string): State {
        const newPages = new Map(state.pages);
        newPages.set(token, page);
        return { ...state, pages: newPages };
    }
    function prependPageToState(state: State, page: RemotePage, token: string): State {
        const formattedPrepend: [
            string,
            RemotePage
        ] = [token, page];
        const data = [formattedPrepend, ...state.pages];
        const newPages = new Map(data);
        return { ...state, pages: newPages };
    }
    function removePageFromState(state: State, token: string): State {
        const newPages = new Map(state.pages);
        newPages.delete(token);
        return { ...state, pages: newPages };
    }
    function updateBatchInState(state: State, batch: D[], token: string): State {
        const { pages } = state;
        const page = pages.get(token);
        if (!page || page.type !== 'Success') {
            return state;
        }
        const newPage = getRemoteSuccess({ ...page.data, batch });
        return updatePageInState(state, newPage, token);
    }
    return class WrappedComponentClass extends React.Component<WrapperProps, State> {
        private globalSubs: Subscription[] = [];
        private configSubs: Subscription[] = [];
        private liveSubs: Map<string, Subscription> = new Map();
        private defaultBatchesCount = 10;
        private state$: Observable<State>;
        private tokenParams$ = new BehaviorSubject(this.props.tokenParams);
        private loadNext$: Subject<boolean> = new Subject();
        private loadPrevious$: Subject<boolean> = new Subject();
        private readonly initialState: State = {
            pages: new Map(),
        };
        public state: State = this.initialState;
        public componentDidMount() {
            this.init();
        }
        public componentWillUnmount() {
            this.resetGlobalSubs();
            this.resetConfigSubs();
            this.unsubscribeFromAllLiveBatches();
        }
        public componentDidUpdate(prevProps: WrapperProps) {
            const currentConfig = this.props.tokenParams;
            const sameConfig = equals(prevProps.tokenParams, currentConfig);
            if (!sameConfig) {
                this.tokenParams$.next(currentConfig);
            }
        }
        public render(): JSX.Element {
            const { ...forwardedProps } = this.props;
            const props: Props = {
                ...forwardedProps,
                hasNext: this.hasNext(this.state),
                hasPrevious: this.hasPrevious(this.state),
                isLoading: this.isLoading(this.state),
                loadNext: this.loadNext,
                loadPrevious: this.loadPrevious,
                paginatedData: this.getBatches(),
            } as unknown as Props;
            return <WrappedComponent {...props}/>;
        }
        private hasNext = (state: State): boolean => {
            const pagesArray = [...state.pages];
            if (pagesArray.length === 0) {
                return false;
            }
            const [token, page] = pagesArray[pagesArray.length - 1];
            return !!token && page.type === 'NotAsked';
        };
        private hasPrevious = (state: State): boolean => {
            const pagesArray = [...state.pages];
            if (pagesArray.length < 2) {
                return false;
            }
            const [token, page] = pagesArray[0];
            return !!token && page.type === 'NotAsked';
        };
        private isLoading = (state: State): boolean => {
            const pagesArray = [...state.pages];
            if (pagesArray.length === 0) {
                return false;
            }
            const [, pageNext] = pagesArray[pagesArray.length - 1];
            const [, pagePrev] = pagesArray[0];
            return pageNext.type === 'Loading' || pagePrev.type === 'Loading';
        };
        private getBatches = (): Map<string, D[]> => {
            const { pages } = this.state;
            return new Map([...pages]
                .filter(([, p]) => p.type === 'Success')
                .map(([t, p]) => [t, p.type === 'Success' ? p.data.batch : []]));
        };
        private loadNext = (canUnload: boolean) => this.loadNext$.next(canUnload);
        private loadPrevious = (canUnload: boolean) => this.loadPrevious$.next(canUnload);
        private getLastToken = (state: State): string => {
            const tokens = [...state.pages.keys()];
            return tokens[tokens.length - 1];
        };
        private getFirstToken = (state: State): string => {
            const tokens = [...state.pages.keys()];
            return tokens[0];
        };
        private loadFirstToken = (state$: BehaviorSubject<State>, tokenParams: FirstTokenParams): void => {
            const { tokenEndpoint } = config;
            const request = tokenEndpoint(tokenParams);
            const obs = from(request).pipe(withLatestFrom(state$), map(([token, state]) => appendPageToState(state, getNotAsked(), token)));
            obs.subscribe((state) => state$.next(state));
        };
        private subscribeToLiveBatch = (state$: Subject<State>, token: string): void => {
            const { batchLiveEndpoint } = config;
            const obs = new Observable<D[]>((observer) => batchLiveEndpoint.on(token, (batch) => observer.next(batch)));
            const sub = obs
                .pipe(withLatestFrom(state$), map(([batch, state]) => updateBatchInState(state, batch, token)))
                .subscribe((state) => state$.next(state));
            const currentSub = this.liveSubs.get(token);
            if (currentSub) {
                currentSub.unsubscribe();
            }
            this.liveSubs.set(token, sub);
        };
        private removePrependedNotAsked = (state: State): State => {
            const { pages } = state;
            if (pages.size === 0) {
                return state;
            }
            const token = [...pages.keys()][0];
            const page = pages.get(token);
            const notAsked = page ? page.type === 'NotAsked' : false;
            return notAsked ? removePageFromState(state, token) : state;
        };
        private removeAppendedNotAsked = (state: State): State => {
            const { pages } = state;
            if (pages.size === 0) {
                return state;
            }
            const tokens = [...pages.keys()];
            const token = tokens[tokens.length - 1];
            const page = pages.get(token);
            const notAsked = page ? page.type === 'NotAsked' : false;
            return notAsked ? removePageFromState(state, token) : state;
        };
        private unloadFirstPage = (state: State): State => {
            if (state.pages.size === 0) {
                return state;
            }
            const cleanState = this.removePrependedNotAsked(state);
            if (cleanState.pages.size === 0) {
                return cleanState;
            }
            const tokens = [...cleanState.pages.keys()];
            const token = tokens[0];
            this.unsubscribeFromLiveBatch(token);
            const withoutFirstPage = removePageFromState(cleanState, token);
            const lastLoadedPage = withoutFirstPage.pages.get(tokens[1]);
            if (!lastLoadedPage || lastLoadedPage.type !== 'Success') {
                return withoutFirstPage;
            }
            const { prevToken } = lastLoadedPage.data;
            if (!prevToken) {
                return withoutFirstPage;
            }
            const withNewFirstPage = prependPageToState(withoutFirstPage, getNotAsked(), prevToken);
            return withNewFirstPage;
        };
        private unloadLastPage = (state: State): State => {
            if (state.pages.size === 0) {
                return state;
            }
            const cleanState = this.removeAppendedNotAsked(state);
            if (cleanState.pages.size === 0) {
                return cleanState;
            }
            const tokens = [...cleanState.pages.keys()];
            const token = tokens[tokens.length - 1];
            this.unsubscribeFromLiveBatch(token);
            const withoutLastPage = removePageFromState(cleanState, token);
            const lastLoadedPage = withoutLastPage.pages.get(tokens[tokens.length - 2]);
            if (!lastLoadedPage || lastLoadedPage.type !== 'Success') {
                return withoutLastPage;
            }
            const { nextToken } = lastLoadedPage.data;
            if (!nextToken) {
                return withoutLastPage;
            }
            const withNewLastPage = appendPageToState(withoutLastPage, getNotAsked(), nextToken);
            return withNewLastPage;
        };
        private requestPage = curry((tokenField: string, addPageToState: (state: State, page: RemotePage, token: string) => State, unloadPage: (state: State) => State, state$: BehaviorSubject<State>, token: string, canUnload: boolean): Observable<State> => {
            const request = this.getPage(token);
            return from(request).pipe(withLatestFrom(state$), map(([page, state]) => {
                const withCurrentPage = updatePageInState(state, page, token);
                if (page.type !== 'Success') {
                    return withCurrentPage;
                }
                this.subscribeToLiveBatch(state$, token);
                const followingToken = page.data[tokenField];
                const maybeWithNewPage = followingToken
                    ? addPageToState(withCurrentPage, getNotAsked(), followingToken)
                    : withCurrentPage;
                const successPagesCount = [
                    ...maybeWithNewPage.pages.values(),
                ].filter((p) => p.type === 'Success').length;
                const limitReached = successPagesCount > this.defaultBatchesCount;
                const shouldUnload = limitReached && canUnload;
                return shouldUnload
                    ? unloadPage(maybeWithNewPage)
                    : maybeWithNewPage;
            }));
        });
        private requestNextPage = this.requestPage('nextToken', appendPageToState, this.unloadFirstPage);
        private requestPreviousPage = this.requestPage('prevToken', prependPageToState, this.unloadLastPage);
        private subscribeToLoadNext = (state$: BehaviorSubject<State>) => this.loadNext$
            .pipe(withLatestFrom(state$), filter(([, state]) => this.hasNext(state)), map(([canUnload, state]) => ({
            canUnload,
            token: this.getLastToken(state),
        })), distinctUntilKeyChanged('token'), mergeMap(({ canUnload, token }) => this.requestNextPage(state$, token, canUnload)))
            .subscribe((updatedState) => state$.next(updatedState));
        private subscribeToLoadPrevious = (state$: BehaviorSubject<State>) => this.loadPrevious$
            .pipe(withLatestFrom(state$), filter(([, state]) => this.hasPrevious(state)), map(([canUnload, state]) => ({
            canUnload,
            token: this.getFirstToken(state),
        })), distinctUntilKeyChanged('token'), mergeMap(({ canUnload, token }) => this.requestPreviousPage(state$, token, canUnload)))
            .subscribe((updatedState) => state$.next(updatedState));
        private getStateObservableFromConfig = (tokenParams: FirstTokenParams): Observable<State> => {
            const state$ = new BehaviorSubject(this.initialState);
            const loadNextSub = this.subscribeToLoadNext(state$);
            const loadPreviousSub = this.subscribeToLoadPrevious(state$);
            this.configSubs.push(loadNextSub);
            this.configSubs.push(loadPreviousSub);
            this.loadFirstToken(state$, tokenParams);
            return state$;
        };
        private getPage = async (token: string): Promise<RemotePage> => {
            const { pageEndpoint } = config;
            try {
                const page = await pageEndpoint(token);
                return getRemoteSuccess(page);
            }
            catch (err) {
                return getRemoteError(err);
            }
        };
        private resetGlobalSubs = (): void => {
            this.globalSubs.forEach((s) => s.unsubscribe());
            this.globalSubs = [];
        };
        private resetConfigSubs = (): void => {
            this.configSubs.forEach((s) => s.unsubscribe());
            this.configSubs = [];
        };
        private getState$ = (): Observable<State> => {
            return this.tokenParams$.pipe(switchMap(this.getStateObservableFromConfig));
        };
        private listenToStateUpdates = (): void => {
            this.state$ = this.getState$();
            const sub = this.state$.subscribe((state) => this.setState(state));
            this.globalSubs.push(sub);
        };
        private listenToConfigChanges = (): void => {
            const sub = this.tokenParams$.subscribe(() => {
                this.resetConfigSubs();
                this.unsubscribeFromAllLiveBatches();
            });
            this.globalSubs.push(sub);
        };
        private init(): void {
            this.listenToConfigChanges();
            this.listenToStateUpdates();
        }
        private unsubscribeFromLiveBatch = (token: string): void => {
            const sub = this.liveSubs.get(token);
            if (!sub) {
                return;
            }
            sub.unsubscribe();
            this.liveSubs.delete(token);
        };
        private unsubscribeFromAllLiveBatches = (): void => {
            const tokens = [...this.liveSubs.keys()];
            tokens.forEach(this.unsubscribeFromLiveBatch);
        };
    };
}
