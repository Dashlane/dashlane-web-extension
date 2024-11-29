import { useCommunication } from "../../../../context/communication";
import { startAssertion } from "../../../../utils/webAuthn/credential";
import { useCallback, useEffect, useRef } from "react";
import { WebAuthnStatus } from "@dashlane/autofill-engine/types";
export const useWebAuthnHook = (
  onWebAuthnCompletion: (status: WebAuthnStatus, error?: any) => void
) => {
  const abortControllerRef = useRef(new AbortController());
  const { autofillEngineCommands, setAutofillEngineActionsHandlers } =
    useCommunication();
  const abortWebauthnFlow = useCallback(() => {
    abortControllerRef.current.abort();
  }, [abortControllerRef]);
  const status = useCallback(() => {
    return abortControllerRef.current.signal;
  }, [abortControllerRef]);
  const startWebauthnFlow = useCallback(() => {
    autofillEngineCommands?.startWebAuthnUserVerificationFlow();
  }, [autofillEngineCommands]);
  useEffect(() => {
    setAutofillEngineActionsHandlers?.({
      updateWebAuthnChallenge: async ({ publicKeyOptions }) => {
        try {
          const assertion = await startAssertion(
            publicKeyOptions,
            abortControllerRef.current.signal
          );
          autofillEngineCommands?.validateWebAuthnUserVerificationFlow(
            assertion
          );
        } catch (error) {
          onWebAuthnCompletion(WebAuthnStatus.Error, error);
        }
      },
      updateWebAuthnStatus: async (status) => {
        onWebAuthnCompletion(status);
      },
    });
  }, [
    abortWebauthnFlow,
    autofillEngineCommands,
    onWebAuthnCompletion,
    setAutofillEngineActionsHandlers,
  ]);
  return { abortWebauthnFlow, startWebauthnFlow, status };
};
