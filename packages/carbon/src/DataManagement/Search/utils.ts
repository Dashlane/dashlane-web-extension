import { PickByValueExact } from "utility-types";
import { prop } from "ramda";
type StringKey<P> = keyof PickByValueExact<P, string>;
type StringGetter = (item: unknown) => string;
export const stringProp = <P>(key: string & StringKey<P>): StringGetter =>
  prop(key);
