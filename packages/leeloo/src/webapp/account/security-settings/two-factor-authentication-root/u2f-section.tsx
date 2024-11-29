import * as React from "react";
import { either, isEmpty, isNil } from "ramda";
import { U2FDevice } from "@dashlane/communication";
import { U2FAuthenticator } from "./u2f-authenticator";
import { useU2FDialogs } from "../../../two-factor-authentication/u2f-authenticators/hooks";
const isEmptyArray = either(isNil, isEmpty);
interface Props {
  authenticators: U2FDevice[];
}
export const U2fSection = ({ authenticators }: Props) => {
  const { openU2FRemoveAuthenticatorDialog } = useU2FDialogs();
  const handleRemoveU2fAuthenticator = React.useCallback(
    (keyHandle: string): void => {
      const authenticator = authenticators?.find(
        (element) => element.keyHandle === keyHandle
      );
      if (authenticator) {
        openU2FRemoveAuthenticatorDialog(keyHandle);
      }
    },
    [authenticators, openU2FRemoveAuthenticatorDialog]
  );
  return isEmptyArray(authenticators) ? null : (
    <>
      {authenticators.map(({ name, creationDateUnix, keyHandle }) => {
        return (
          <U2FAuthenticator
            key={keyHandle}
            name={name}
            creationDateUnix={creationDateUnix}
            keyHandle={keyHandle}
            onRemoveAuthenticator={handleRemoveU2fAuthenticator}
          />
        );
      })}
    </>
  );
};
