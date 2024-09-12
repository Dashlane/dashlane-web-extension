import { Class } from "@dashlane/framework-types";
export enum ParameterProviderType {
  VALUE_PROVIDER = "value_provider",
  CLASS_PROVIDER = "class_provider",
}
export interface ParameterValueProvider<T> {
  type: ParameterProviderType.VALUE_PROVIDER;
  useValue: T;
}
export interface ParameterClassProvider<T> {
  type: ParameterProviderType.CLASS_PROVIDER;
  useClass: Class<T>;
}
export type ParameterProvider<T> =
  | ParameterValueProvider<T>
  | ParameterClassProvider<T>;
