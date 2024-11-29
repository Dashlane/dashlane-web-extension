import { useIsB2CUserFrozen } from "./use-is-b2c-user-frozen";
export type IsB2CUserFrozenProps = {
  isUserFrozen: boolean | null;
};
export function withFrozenState<Props>(
  Component: React.ComponentType<Props & IsB2CUserFrozenProps>
): React.ComponentType<Props> {
  return (props) => {
    const isUserFrozen = useIsB2CUserFrozen();
    return <Component {...props} isUserFrozen={isUserFrozen} />;
  };
}
