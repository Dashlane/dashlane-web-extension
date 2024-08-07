import { runtimeGetId } from "@dashlane/webextensions-apis";
import { AutofillEngineCommands } from "../types/commands";
import { AutofillEngineContext } from "./context";
const isSenderIdTrusted = (sender: chrome.runtime.MessageSender) => {
  const senderId = sender.id ?? "";
  return senderId === runtimeGetId();
};
const getSenderOrigin = (sender: chrome.runtime.MessageSender) => {
  return sender.origin ?? new URL(sender.url ?? "").origin;
};
export const validateMessageSender = async (
  context: AutofillEngineContext,
  sender: chrome.runtime.MessageSender,
  command: keyof AutofillEngineCommands
): Promise<void> => {
  try {
    const senderOrigin = getSenderOrigin(sender);
    if (
      senderOrigin === new URL(context.browserApi.runtime.getURL("")).origin ||
      isSenderIdTrusted(sender)
    ) {
      return;
    }
    let tabOrigin: string | undefined;
    const senderTabUrl = sender.tab?.url || sender.tab?.pendingUrl;
    if (
      senderTabUrl &&
      senderOrigin &&
      senderOrigin === new URL(senderTabUrl).origin
    ) {
      const state = await context.state.tab.get();
      await context.state.tab.set({
        ...state,
        origin: senderOrigin,
      });
      tabOrigin = senderOrigin;
    } else {
      tabOrigin = (await context.state.tab.get()).origin;
    }
    if (
      senderOrigin &&
      senderTabUrl &&
      tabOrigin &&
      tabOrigin === new URL(senderTabUrl).origin
    ) {
      return;
    }
  } catch {}
  if (command === "documentComplete") {
    return;
  }
  throw new Error(`Message sender is not trusted`);
};
