import { useUserMessages } from 'libs/user-messages/useUserMessages';
import { addUserMessage, dismissUserMessage } from 'libs/user-messages';
import { UserMessage, UserMessageTypes } from '@dashlane/communication';
interface UseUserMessageOutput {
    addMessage: () => void;
    dismissMessage: () => void;
    hasMessage: boolean;
    hasDismissedMessage: boolean;
    messages: UserMessage[];
}
export const useUserMessage = (messageType: UserMessageTypes): UseUserMessageOutput => {
    const messages = useUserMessages();
    const hasMessage = !!messages.find((message) => message.type === messageType && !message.dismissedAt);
    const hasDismissedMessage = !!messages.find((message) => message.type === messageType && message.dismissedAt);
    const addMessage = () => addUserMessage({ type: messageType });
    const dismissMessage = () => dismissUserMessage({
        type: messageType,
    });
    return {
        addMessage,
        dismissMessage,
        hasMessage,
        hasDismissedMessage,
        messages,
    };
};
