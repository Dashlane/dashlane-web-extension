import * as React from "react";
import { Subtract } from "utility-types";
import { AsRemoteData, RemoteData, RemoteDataTypes } from "./remoteData";
export interface RemoteDataStrategy {}
export type RemoteDataStrategies<InjectedProps> = {
  [key in keyof InjectedProps]: RemoteDataStrategy;
};
export interface RemoteDataConfig<InjectedProps, WrapperProps> {
  errorComponent?:
    | JSX.Element
    | ((props: WrapperProps, error: string) => JSX.Element);
  loadingComponent?:
    | JSX.Element
    | ((props: WrapperProps) => JSX.Element)
    | React.FC<WrapperProps>;
  strategies: RemoteDataStrategies<InjectedProps>;
}
export function remoteDataAdapter<
  InjectedProps extends Record<string, any>,
  Props extends InjectedProps
>(
  WrappedComponent: React.ComponentType<Props>,
  strategy: RemoteDataConfig<
    InjectedProps,
    Subtract<Props, InjectedProps> & AsRemoteData<InjectedProps>
  >
): React.ComponentType<
  Subtract<Props, InjectedProps> & AsRemoteData<InjectedProps>
> {
  type RemoteInjectedProps = AsRemoteData<InjectedProps>;
  type ForwardProps = Subtract<Props, InjectedProps>;
  type WrapperProps = ForwardProps & RemoteInjectedProps;
  type WrapperState = {
    data: RemoteInjectedProps;
  };
  return class extends React.Component<WrapperProps, WrapperState> {
    static displayName = "RemoteDataAdapterWrapper";
    private getRemoteDataInProps = (
      key: keyof RemoteInjectedProps
    ): RemoteData<any> => this.props[key];
    private canRender = (): boolean => {
      const propKeys = Object.keys(strategy.strategies);
      return propKeys.every(
        (propKey) => this.props[propKey].type === "Success"
      );
    };
    private getValues = (): Partial<InjectedProps> => {
      const out = {} as InjectedProps;
      for (const key in strategy.strategies) {
        const remoteData = this.getRemoteDataInProps(key);
        if (remoteData.type === "Success") {
          out[key] = remoteData.data;
        }
      }
      return out;
    };
    private hasStatus = (type: RemoteDataTypes): boolean => {
      const propKeys = Object.keys(strategy.strategies);
      return propKeys.some((propKey) => this.props[propKey].type === type);
    };
    private getWrapperProps = (): WrapperProps => {
      const injectedKeys = new Set(Object.keys(strategy.strategies));
      return Object.keys(this.props)
        .filter((key) => !injectedKeys.has(key))
        .reduce(
          (acc, key) => ({ ...acc, [key]: this.props[key] }),
          {} as WrapperProps
        );
    };
    private getFirstError = (): string => {
      for (const key in strategy.strategies) {
        const remoteData = this.getRemoteDataInProps(key);
        if (remoteData.type === "Err") {
          return remoteData.message;
        }
      }
      return "";
    };
    private getLoadingComponent = () => {
      const { loadingComponent } = strategy;
      if (!loadingComponent) {
        return null;
      }
      if (typeof loadingComponent === "function") {
        return loadingComponent(this.props as WrapperProps);
      }
      return loadingComponent;
    };
    private getErrorComponent = (message: string) => {
      const { errorComponent } = strategy;
      if (!errorComponent) {
        return null;
      }
      if (typeof errorComponent === "function") {
        return errorComponent(this.props as WrapperProps, message);
      }
      return errorComponent;
    };
    public render() {
      if (this.hasStatus("Loading") || this.hasStatus("NotAsked")) {
        return this.getLoadingComponent();
      }
      if (this.hasStatus("Err")) {
        const message = this.getFirstError();
        return this.getErrorComponent(message);
      }
      if (this.canRender()) {
        const props = {
          ...this.getWrapperProps(),
          ...this.getValues(),
        } as Props;
        return <WrappedComponent {...props} />;
      }
      return null;
    }
  };
}
