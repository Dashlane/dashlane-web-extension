import * as React from "react";
import { LocalReducer } from "redux-cursor";
import { RouteComponentProps, RouteProps } from "./dom";
import { Store } from "../../store/create";
import { TranslatorInterface } from "../i18n/types";
import { NamedRoutes } from "../../app/routes/types";
import { PermissionChecker } from "../../user/permissions";
import { Lee, LeeWithStorage } from "../../lee";
export interface RoutesProps<Path = string, Options = void> {
  basePath?: string;
  path: Path;
  options?: Options;
}
export interface RouterGlobalSettings {
  host: string;
  store: Store;
  reducer: LocalReducer<{}>;
  translate: TranslatorInterface;
  routes: NamedRoutes;
}
export interface CommonRouteProps extends RouteProps {
  options?: object;
  additionalProps?: object;
  permission?: (params: PermissionChecker) => boolean;
  redirectPath?: string;
  reducer?: LocalReducer<any>;
  lee?: Lee;
  children: (props: CustomRouteComponentProps) => JSX.Element | null;
  stayMounted?: boolean;
  isB2BCapabilityRestricted?: boolean;
}
export type CustomRouteProps = Omit<CommonRouteProps, "render" | "children">;
export interface CustomRouteComponentProps extends RouteComponentProps {
  lee: Lee | LeeWithStorage<any>;
  options: object;
  params?: object;
  children?: React.ReactNode;
}
export interface WrappingRouteProps extends CustomRouteProps {
  children?: React.ReactNode;
}
