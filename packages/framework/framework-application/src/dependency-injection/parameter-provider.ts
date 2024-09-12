import { Class } from "@dashlane/framework-types";
import {
  ParameterClassProvider,
  ParameterProviderType,
  ParameterValueProvider,
} from "./parameter-provider.types";
export function provideValue<T>(value: T): ParameterValueProvider<T> {
  return {
    type: ParameterProviderType.VALUE_PROVIDER,
    useValue: value,
  };
}
export function provideClass<T>(cls: Class<T>): ParameterClassProvider<T> {
  return {
    type: ParameterProviderType.CLASS_PROVIDER,
    useClass: cls,
  };
}
